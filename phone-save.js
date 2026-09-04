/* ===== 회원가입 시 전화번호를 프로필에 저장 =====
   app-4-actions.js 의 signUp 은 phone 을 넘기지 않으므로,
   가입 성공 직후 프로필에 전화번호를 채워 넣습니다. */

(function(){
  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el || el.getAttribute('data-action') !== 'authSignup') return;
    if(!db) return;

    var phone = String(state.form.phone||'').trim();
    if(!phone) return;

    /* 가입 처리가 끝나 userId 가 생긴 뒤에 저장 */
    var tries = 0;
    var timer = setInterval(function(){
      tries++;
      if(tries > 40){ clearInterval(timer); return; }
      if(state.userId){
        clearInterval(timer);
        db.from('profiles').update({ phone: phone }).eq('id', state.userId)
          .then(function(r){
            if(r.error) console.error('[온담] 전화번호 저장 실패:', r.error.message);
          });
      }
    }, 250);
  });
})();
