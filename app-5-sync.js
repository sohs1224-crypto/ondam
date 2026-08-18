/* ===== 서버 동기화 =====
   app-4-actions.js 의 클릭 처리가 전역 배열을 바꾼 뒤,
   여기서 그 변화를 서버에 반영합니다.
   이 파일은 항상 마지막에 로드되므로 앞 파일의 처리가 끝난 뒤 실행됩니다.
   (로그인·회원가입 화면은 auth-screens.js 에 있습니다) */

(function(){

  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el) return;
    var action = el.getAttribute('data-action');
    var value  = el.getAttribute('data-value');
    if(!db || !state.userId) return;

    /* 프로필 (닉네임·학교·학년·반) */
    if(action === 'saveProfile'){
      db.from('profiles').update({
        nickname: me.nickname,
        school:   me.school,
        grade:    parseInt(me.grade, 10) || null,
        class_no: parseInt(me.classNo, 10) || null
      }).eq('id', state.userId).then(function(r){
        if(r.error){ console.error('[온담] 프로필 저장 실패:', r.error.message); return; }
        if(typeof loadSchoolData === 'function') loadSchoolData();
      });
    }

    /* 시험범위 */
    else if(action === 'examSave'){
      var ex = state.examSel || 0;
      var content = (examData[ex] && examData[ex][value]) || '';
      saveExamRange(ex, value, content);
    }

    /* 수행평가 */
    else if(action === 'perfSubmit'){
      var latest = perfPosts[0];
      if(latest && !latest.savedToDb){
        latest.savedToDb = true;
        savePerfPost(latest);
      }
    }

    /* 개인 과제 */
    else if(action === 'addHomework'){
      var added = homeworkList[homeworkList.length - 1];
      if(added && !added.savedToDb){
        added.savedToDb = true;
        saveHomework(added.text, added.due);
      }
    }
    else if(action === 'toggleHomework'){
      var hw = homeworkList.filter(function(h){ return String(h.id) === String(value); })[0];
      if(hw) toggleHomeworkDb(hw.id, hw.done);
    }
    else if(action === 'deleteHomework'){
      deleteHomeworkDb(value);
    }

    /* 학급 기록 */
    else if(action === 'recDelete'){
      deleteClassEvent(value);
    }
    else if(action === 'recApprove'){
      approveClassEvent(value);
    }

    /* 역할 (반장·부반장) */
    else if(action === 'recRole'){
      saveRole(value);
    }

    /* 친구 */
    else if(action === 'acceptFriendReq'){
      var req = friendRequests.filter(function(r){ return r.nick === value; })[0];
      if(req && req.id) acceptFriend(req.id);
    }
    else if(action === 'unfriend'){
      var fr = friendsList.filter(function(f){ return f.nick === value; })[0];
      if(fr && fr.id) removeFriend(fr.id);
    }
    else if(action === 'sendWarmth'){
      var tgt = friendsList.filter(function(f){ return f.nick === value; })[0];
      if(tgt && tgt.userId){
        db.from('warmth_gifts').insert({ sender_id: state.userId, target_id: tgt.userId });
      }
    }
  });

  /* 학급 기록 저장은 화면 코드가 배열에 넣은 직후를 잡습니다.
     반장·부반장이면 recEvents 에, 아니면 recRequests 에 들어갑니다. */
  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el || el.getAttribute('data-action') !== 'recSubmit') return;
    if(!db || !state.userId) return;

    var isLeader = (me.role === '반장' || me.role === '부반장');
    var list = isLeader ? recEvents : recRequests;
    var latest = list[list.length - 1];
    if(!latest) return;

    /* 수정인 경우 */
    if(isLeader && latest.savedToDb){
      updateClassEvent(latest.id, latest.type, latest.title);
      return;
    }
    if(!latest.savedToDb){
      latest.savedToDb = true;
      saveClassEvent(latest, !isLeader);
    }
  });

  /* 로그인 직후 학교생활 데이터 불러오기 */
  var origLoadMyProfile = window.loadMyProfile;
  if(typeof origLoadMyProfile === 'function'){
    window.loadMyProfile = function(){
      return origLoadMyProfile.apply(this, arguments).then(function(ok){
        if(ok && typeof loadSchoolData === 'function') loadSchoolData();
        return ok;
      });
    };
  }

})();
