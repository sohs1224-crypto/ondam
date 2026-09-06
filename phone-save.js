/* ===== 회원가입 시 전화번호·닉네임을 프로필에 저장 =====
   app-4-actions.js 의 signUp 은 phone 을 넘기지 않고
   nickname 도 randomNick() 으로 자동 생성하므로,
   가입 성공 직후 프로필에 사용자가 입력한 값을 덮어씁니다. */

(function(){
  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el || el.getAttribute('data-action') !== 'authSignup') return;
    if(!db) return;

    var phone = String(state.form.phone||'').trim();
    var nick  = String(state.form.nickname||'').trim();
    if(!phone && !nick) return;

    /* 가입 처리가 끝나 userId 가 생긴 뒤에 저장 */
    var tries = 0;
    var timer = setInterval(function(){
      tries++;
      if(tries > 40){ clearInterval(timer); return; }
      if(state.userId){
        clearInterval(timer);
        var patch = {};
        if(phone) patch.phone = phone;
        if(nick)  patch.nickname = nick;
        db.from('profiles').update(patch).eq('id', state.userId)
          .then(function(r){
            if(r.error){ console.error('[온담] 프로필 저장 실패:', r.error.message); return; }
            if(nick){ me.nickname = nick; render(); }
          });
      }
    }, 250);
  });
})();
