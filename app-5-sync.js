/* ===== 서버 동기화 연결부 =====
   app-4-actions.js 의 클릭 처리가 전역 배열을 바꾼 뒤,
   여기서 그 변화를 서버에 반영합니다.
   기존 코드를 고치지 않기 위해 클릭을 한 번 더 듣는 방식을 씁니다. */

(function(){

  /* app-4 의 리스너가 먼저 돌도록 캡처 단계가 아닌 버블 단계에서 듣습니다.
     같은 단계에 등록된 리스너는 등록 순서대로 실행되므로,
     이 파일이 app-4 보다 뒤에 로드되면 항상 나중에 실행됩니다. */
  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el) return;
    var action = el.getAttribute('data-action');
    var value  = el.getAttribute('data-value');
    if(!db || !state.userId) return;

    /* ── 시험범위 저장 ── */
    if(action === 'examSave'){
      var ex = state.examSel || 0;
      var content = (examData[ex] && examData[ex][value]) || '';
      saveExamRange(ex, value, content);
    }

    /* ── 수행평가 ── */
    else if(action === 'perfSubmit'){
      var latest = perfPosts[0];
      if(latest && !latest.savedToDb){
        latest.savedToDb = true;
        savePerfPost(latest);
      }
    }

    /* ── 개인 과제 ── */
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

    /* ── 친구 ── */
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

  /* ── 로그인 직후 학교생활 데이터 불러오기 ──
     loadMyProfile 이 끝난 뒤 me.school / me.grade 가 채워지므로 그 뒤에 실행합니다. */
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
