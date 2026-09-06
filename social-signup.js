/* ===== 소셜 로그인 후 프로필 채우기 =====
   소셜 로그인은 페이지를 떠났다 돌아오므로,
   가입 단계에서 고른 닉네임·학교·학년을 localStorage 에 담아뒀다가
   돌아온 뒤 프로필에 반영합니다. */

(function(){

  function applyPendingSignup(){
    if(typeof db === 'undefined' || !db) return;

    var raw = null;
    try{ raw = localStorage.getItem('ondam_signup'); }catch(err){ return; }
    if(!raw) return;

    var info;
    try{ info = JSON.parse(raw); }catch(err){ return; }
    if(!info) return;

    db.auth.getSession().then(function(res){
      var s = res && res.data && res.data.session;
      if(!s || !s.user) return;

      var uid = s.user.id;
      var patch = {};
      if(info.nickname)  patch.nickname  = info.nickname;
      if(info.school)    patch.school    = info.school;
      if(info.grade)     patch.grade     = parseInt(info.grade, 10) || null;
      if(info.atptCode)  patch.atpt_code = info.atptCode;
      if(info.schulCode) patch.schul_code = info.schulCode;

      db.from('profiles').update(patch).eq('id', uid).then(function(r){
        if(r.error){ console.error('[온담] 소셜 가입 프로필 저장 실패:', r.error.message); return; }
        try{ localStorage.removeItem('ondam_signup'); }catch(err){}

        if(typeof me !== 'undefined'){
          if(info.nickname)  me.nickname  = info.nickname;
          if(info.school)    me.school    = info.school;
          if(info.grade)     me.grade     = parseInt(info.grade,10) || me.grade;
          if(info.atptCode)  me.atptCode  = info.atptCode;
          if(info.schulCode) me.schulCode = info.schulCode;
          if(info.schoolKind) me.schoolKind = info.schoolKind;
        }
        if(typeof render === 'function') render();
      });
    });
  }

  /* 앱이 뜨고 세션이 자리잡을 시간을 준 뒤 실행 */
  setTimeout(applyPendingSignup, 1500);

  /* 로그인 상태가 바뀌는 순간에도 한 번 더 */
  if(typeof db !== 'undefined' && db && db.auth && db.auth.onAuthStateChange){
    db.auth.onAuthStateChange(function(event){
      if(event === 'SIGNED_IN') setTimeout(applyPendingSignup, 300);
    });
  }

})();
