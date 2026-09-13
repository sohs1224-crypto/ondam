/* ===== 소셜 로그인 후 프로필 반영 =====
   - 첫 가입: 가입 단계에서 고른 닉네임/학교/학년을 프로필에 저장
   - 재로그인: DB에서 프로필을 가져와 me 에 반영 (홈 화면에 기본값 대신 실제 값이 뜨도록) */

(function(){

  /* DB에서 내 프로필을 가져와 me 에 채워 넣기 */
  function refreshMeFromDb(){
    if(typeof db === 'undefined' || !db) return Promise.resolve(false);
    return db.auth.getUser().then(function(res){
      var u = res && res.data && res.data.user;
      if(!u) return false;
      if(typeof state !== 'undefined') state.userId = u.id;
      return db.from('profiles').select('*').eq('id', u.id).single().then(function(r){
        if(r.error || !r.data) return false;
        var d = r.data;
        if(typeof me !== 'undefined'){
          if(d.nickname)   me.nickname  = d.nickname;
          if(d.school)     me.school    = d.school;
          if(d.grade)      me.grade     = d.grade;
          if(d.class_no)   me.classNo   = d.class_no;
          if(d.warmth!=null) me.warmth  = d.warmth;
          if(d.login_id)   me.loginId   = d.login_id;
          if(d.atpt_code)  me.atptCode  = d.atpt_code;
          if(d.schul_code) me.schulCode = d.schul_code;
        }
        if(typeof render === 'function') render();
        return true;
      });
    }).catch(function(){ return false; });
  }

  /* 가입 직후: localStorage 에 담아둔 닉네임/학교/학년을 프로필에 반영 */
  function applyPendingSignup(){
    if(typeof db === 'undefined' || !db){ refreshMeFromDb(); return; }

    var raw = null;
    try{ raw = localStorage.getItem('ondam_signup'); }catch(err){}
    if(!raw){ refreshMeFromDb(); return; }

    var info;
    try{ info = JSON.parse(raw); }catch(err){ refreshMeFromDb(); return; }
    if(!info){ refreshMeFromDb(); return; }

    db.auth.getSession().then(function(res){
      var s = res && res.data && res.data.session;
      if(!s || !s.user){ refreshMeFromDb(); return; }

      var uid = s.user.id;
      var patch = {};
      if(info.nickname)  patch.nickname  = info.nickname;
      if(info.school)    patch.school    = info.school;
      if(info.grade)     patch.grade     = parseInt(info.grade, 10) || null;
      if(info.atptCode)  patch.atpt_code = info.atptCode;
      if(info.schulCode) patch.schul_code = info.schulCode;

      db.from('profiles').update(patch).eq('id', uid).then(function(r){
        if(r.error){ console.error('[온담] 소셜 가입 프로필 저장 실패:', r.error.message); refreshMeFromDb(); return; }
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

  /* 로그인 상태가 바뀌는 순간에도 한 번 더 (재로그인 커버) */
  if(typeof db !== 'undefined' && db && db.auth && db.auth.onAuthStateChange){
    db.auth.onAuthStateChange(function(event){
      if(event === 'SIGNED_IN') setTimeout(applyPendingSignup, 300);
    });
  }

})();
