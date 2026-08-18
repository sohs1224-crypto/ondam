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

    /* 시험범위 */
    if(action === 'examSave'){
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
