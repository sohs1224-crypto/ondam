/* ===== 시작 · 로그인 · 회원가입 · 비밀번호/아이디 찾기 화면 ===== */

var ONDAM_LOGO = 'logo.png';

function errBox(msg){
  if(!msg) return '';
  return '<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:12px 16px;margin-top:14px;text-align:center;font-size:14px;color:#dc2626">'+escapeHtml(msg)+'</div>';
}

function authPwField(withHint){
  var f = state.form;
  var bad = f.pw && !pwValid(f.pw);
  var hint = withHint
    ? '<div class="pw-hint" id="pwHint" style="color:'+(bad?'#d9534f':'var(--ink-faint)')+'">8자 이상, 영문과 숫자를 포함하여 입력해주세요.</div>'
    : '';
  return '<div class="field"><div class="field__label">비밀번호</div>'+
    '<input class="field__input" data-field="pw" id="af-pw" type="password" value="'+escapeAttr(f.pw)+'" placeholder="비밀번호를 입력하세요" autocomplete="new-password">'+hint+
  '</div>';
}

authInvalidSignup = function(){
  var f = state.form;
  var miss = ['school','grade','classNo','id','pw','email'].some(function(k){ return !String(f[k]||'').trim(); });
  var picked = !!(f.atptCode && f.schulCode);
  var idBad = f.id && !/^[a-zA-Z0-9]+$/.test(f.id);
  return miss || idBad || !picked || !(f.idChecked && f.idAvailable) || !pwValid(f.pw) || !emailValid(f.email);
};

function welcomeScreen(){
  return '<div style="display:flex;flex-direction:column;min-height:100vh;padding:0 24px;background:#fff">'+
    '<div style="flex:1.2"></div>'+
    '<div style="text-align:center">'+
      '<img src="'+ONDAM_LOGO+'" alt="온담 로고" style="width:130px;height:auto;margin:0 auto -18px;display:block" />'+
      '<div style="font-size:26px;font-weight:800;color:#1a1a1a;margin:0;letter-spacing:-0.5px">온담</div>'+
      '<p style="font-size:14px;font-weight:400;color:#888;line-height:1.6;margin:6px 0 0 0">마음이 머무르는 곳<br>이야기에 따뜻한 온기를 더해봐요.</p>'+
    '</div>'+
    '<div style="flex:1.8"></div>'+
    '<div style="padding-bottom:calc(32px + env(safe-area-inset-bottom, 0px))">'+
      '<button data-action="authGo" data-value="signup" style="width:100%;padding:17px 0;font-size:17px;font-weight:700;border-radius:12px;border:none;cursor:pointer;background:#8fae7e;color:#fff;font-family:inherit">시작하기</button>'+
      '<div style="text-align:center;margin-top:18px;font-size:13px"><span style="color:#aaa">이미 계정이 있나요? </span><span data-action="authGo" data-value="loginForm" style="color:#8fae7e;font-weight:600;cursor:pointer;text-decoration:underline">로그인</span></div>'+
    '</div>'+
  '</div>';
}

function loginScreen(){
  var f = state.form;
  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">로그인</div></div>'+
    '<div style="text-align:center;margin:16px 0 24px"><img src="'+ONDAM_LOGO+'" alt="온담" style="width:80px;height:auto;margin:0 auto -10px;display:block" /><p style="font-size:14px;color:#888;margin:0">다시 만나 반가워요</p></div>'+
    '<div class="field"><div class="field__label">아이디</div><input class="field__input" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="아이디를 입력하세요" autocomplete="off"></div>'+
    '<div class="field"><div class="field__label">비밀번호</div><input class="field__input" data-field="pw" id="af-pw" type="password" value="'+escapeAttr(f.pw)+'" placeholder="비밀번호를 입력하세요" autocomplete="off"></div>'+
    '<div style="margin-top:20px"><button class="btn btn--primary" id="loginBtn" data-action="authLogin" disabled>'+(f.busy?'잠시만요…':'로그인')+'</button></div>'+
    errBox(f.authError)+
    '<div class="auth__links"><span data-action="authGo" data-value="findid">아이디 찾기</span><span class="dot"></span><span data-action="authGo" data-value="findpw">비밀번호 찾기</span></div>'+
  '</div>';
}

findIdScreen = function(){
  var f = state.form;
  if(f.foundId){
    return '<div class="auth">'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="loginForm" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">아이디 찾기</div></div>'+
      '<div style="text-align:center;margin:40px 0"><p style="font-size:14px;color:#888;margin:0 0 12px">입력하신 이메일로 등록된 아이디입니다.</p><div style="font-size:22px;font-weight:800;color:#1a1a1a;background:#f4f4f4;padding:16px;border-radius:12px">'+escapeHtml(f.foundId)+'</div></div>'+
      '<div style="margin-top:20px"><button class="btn btn--primary" data-action="authGo" data-value="loginForm">로그인하러 가기</button></div>'+
    '</div>';
  }
  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="loginForm" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">아이디 찾기</div></div>'+
    '<p style="font-size:13px;color:#888;margin:0 0 16px">가입 시 등록한 이메일을 입력해 주세요.</p>'+
    '<div class="field"><div class="field__label">이메일</div><input class="field__input" data-field="email" id="af-email" value="'+escapeAttr(f.email||'')+'" placeholder="이메일을 입력하세요" autocomplete="off"></div>'+
    '<div style="margin-top:20px"><button class="btn btn--primary" id="findIdBtn" data-action="findId" disabled>'+(f.busy?'잠시만요…':'아이디 찾기')+'</button></div>'+
    errBox(f.authError)+
  '</div>';
};

findPwScreen = function(){
  var f = state.form;
  if(f.resetOk){
    return '<div class="auth">'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="loginForm" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">비밀번호 찾기</div></div>'+
      '<div style="text-align:center;margin:40px 0"><div style="font-size:48px;margin-bottom:16px">✅</div><p style="font-size:16px;font-weight:700;color:#1a1a1a;margin:0 0 8px">비밀번호가 변경되었습니다</p><p style="font-size:14px;color:#888;margin:0">새 비밀번호로 로그인해 주세요.</p></div>'+
      '<div style="margin-top:20px"><button class="btn btn--primary" data-action="authGo" data-value="loginForm">로그인하러 가기</button></div>'+
    '</div>';
  }
  var np = f.newPw || '';
  var npBad = np && !pwValid(np);
  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="loginForm" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">비밀번호 찾기</div></div>'+
    '<p style="font-size:13px;color:#888;margin:0 0 16px">가입 시 등록한 아이디와 이메일을 입력하면<br>새 비밀번호를 설정할 수 있어요.</p>'+
    '<div class="field"><div class="field__label">아이디</div><input class="field__input" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="아이디를 입력하세요" autocomplete="off"></div>'+
    '<div class="field"><div class="field__label">가입 시 등록한 이메일</div><input class="field__input" data-field="email" id="af-email" value="'+escapeAttr(f.email||'')+'" placeholder="이메일을 입력하세요" autocomplete="off"></div>'+
    '<div class="field"><div class="field__label">새 비밀번호</div><input class="field__input" data-field="newPw" id="af-newPw" type="password" value="'+escapeAttr(np)+'" placeholder="새 비밀번호를 입력하세요" autocomplete="new-password"><div class="pw-hint" style="color:'+(npBad?'#d9534f':'var(--ink-faint)')+'">8자 이상, 영문과 숫자를 포함하여 입력해주세요.</div></div>'+
    '<div style="margin-top:20px"><button class="btn btn--primary" id="resetPwBtn" data-action="resetPw" disabled>'+(f.busy?'잠시만요…':'비밀번호 변경')+'</button></div>'+
    errBox(f.authError)+
  '</div>';
};

function signupSchoolField(){
  var f = state.form;
  var picked = !!(f.atptCode && f.schulCode);
  var lockStyle = picked ? 'padding-right:44px;cursor:pointer;background:var(--neutral-fill)' : 'padding-right:44px';
  var lockAttr = picked ? ' readonly' : '';
  var iconBtn = '<button type="button" class="in-field-btn" data-action="searchSchool" aria-label="학교 검색">'+icon('search',18)+'</button>';
  var msg = picked
    ? '<div class="id-msg" style="color:#3f8f4f">'+escapeHtml(f.school)+' 선택됨</div>'
    : (f.schoolSearched ? '<div class="id-msg" style="color:#d9534f">목록에서 학교를 선택해 주세요.</div>' : '<div class="id-msg" style="color:var(--ink-faint)">학교명을 입력하고 검색 버튼을 눌러주세요.</div>');
  return '<div class="field" style="position:relative"><div class="field__label">학교</div><div style="position:relative"><input class="field__input" data-field="school" id="af-school" value="'+escapeAttr(f.school)+'" placeholder="학교명을 입력하세요" autocomplete="off" style="'+lockStyle+'"'+lockAttr+'>'+iconBtn+'</div><div class="ac-list" id="authSchoolAC"></div>'+msg+'</div>';
}

function signupScreen(){
  var f = state.form;
  var idMsg;
  if(f.idChecking) idMsg='<div class="id-msg" id="idCheckMsg">확인 중…</div>';
  else if(f.idChecked) idMsg = f.idAvailable ? '<div class="id-msg" id="idCheckMsg" style="color:#3f8f4f">사용 가능한 아이디입니다.</div>' : '<div class="id-msg" id="idCheckMsg" style="color:#d9534f">이미 사용 중인 아이디입니다.</div>';
  else idMsg='<div class="id-msg" id="idCheckMsg"></div>';
  var emailBad = f.email && !emailValid(f.email);
  var idBad = f.id && !/^[a-zA-Z0-9]*$/.test(f.id);
  var idHint = idBad ? '<div class="pw-hint" style="color:#d9534f">영문 숫자로 입력하세요.</div>' : '';
  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">회원가입</div></div>'+
    signupSchoolField()+
    '<div class="field"><div class="field__label">학년 · 반</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><input class="field__input" data-field="grade" id="af-grade" value="'+escapeAttr(f.grade)+'" placeholder="학년" inputmode="numeric"><input class="field__input" data-field="classNo" id="af-classNo" value="'+escapeAttr(f.classNo)+'" placeholder="반" inputmode="numeric"></div></div>'+
    '<div class="field"><div class="field__label">아이디</div><div style="display:flex;gap:8px"><input class="field__input" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="아이디를 입력하세요" autocomplete="off" style="flex:1"><button class="btn--check" data-action="checkId">중복확인</button></div>'+idHint+idMsg+'</div>'+
    authPwField(true)+
    '<div class="field"><div class="field__label">이메일</div><input class="field__input" data-field="email" id="af-email" value="'+escapeAttr(f.email||'')+'" placeholder="이메일을 입력하세요" autocomplete="off"><div class="pw-hint" id="emailHint" style="color:'+(emailBad?'#d9534f':'var(--ink-faint)')+'">아이디·비밀번호 찾기에 사용할 이메일이에요.</div></div>'+
    '<div style="margin-top:20px"><button class="btn btn--primary" id="authSubmit" data-action="authSignup" disabled>'+(f.busy?'잠시만요…':'회원가입')+'</button></div>'+
    errBox(f.authError)+
    '<div class="auth__links"><span data-action="authGo" data-value="login">이미 계정이 있어요 · 로그인</span></div></div>';
}

authScreen = function(){
  if(state.authView==='findpw') return findPwScreen();
  if(state.authView==='findid') return findIdScreen();
  if(state.authView==='signup') return signupScreen();
  if(state.authView==='loginForm') return loginScreen();
  return welcomeScreen();
};

var LOGIN_FIELDS = ['id','pw'];
reqFields = function(){ return state.authView==='signup' ? ['school','grade','classNo','id','pw','email'] : LOGIN_FIELDS; };

document.addEventListener('click', function(e){
  var el = e.target.closest ? e.target.closest('[data-action]') : null;
  if(!el) return;
  var action = el.getAttribute('data-action');
  var value = el.getAttribute('data-value');
  var f = state.form;
  if(action==='authGo'&&value==='loginForm'){f.id='';f.pw='';f.authError='';f.resetOk=false;f.foundId='';}
  if(action==='authGo'&&value==='findpw'){f.id='';f.email='';f.newPw='';f.authError='';f.resetOk=false;}
  if(action==='authGo'&&value==='findid'){f.email='';f.authError='';f.foundId='';}
  if(action==='authLogin'){f.school=f.school||me.school||'온담고등학교';f.grade=f.grade||me.grade||1;f.classNo=f.classNo||me.classNo||1;}
  if(action==='resetPw'){
    e.stopImmediatePropagation();
    f.busy=true;f.authError='';render();
    db.rpc('reset_password',{login_id_in:String(f.id||'').trim(),email_in:String(f.email||'').trim(),new_pw:String(f.newPw||'').trim()})
      .then(function(r){f.busy=false;if(r.error){f.authError='처리 중 오류가 발생했습니다.';render();return;}if(r.data===true){f.resetOk=true;f.authError='';}else{f.authError='아이디 또는 이메일이 일치하지 않습니다.';}render();});
  }
  if(action==='findId'){
    e.stopImmediatePropagation();
    f.busy=true;f.authError='';render();
    db.rpc('find_login_id',{email_in:String(f.email||'').trim()})
      .then(function(r){f.busy=false;if(r.error||!r.data){f.authError='해당 이메일로 등록된 아이디가 없습니다.';render();return;}f.foundId=r.data;f.authError='';render();});
  }
}, true);

document.addEventListener('input', function(e){
  if(e.target && e.target.id === 'af-newPw') state.form.newPw = e.target.value;
});

/* render 후 버튼 활성/비활성을 직접 제어 */
(function(){
  var origRender2 = window.render;
  if(typeof origRender2 !== 'function') return;
  window.render = function(){
    var r = origRender2.apply(this, arguments);
    if(state.stage !== 'login') return r;
    var f = state.form;
    var av = state.authView;
    var loginBtn = document.getElementById('loginBtn');
    if(loginBtn) loginBtn.disabled = f.busy || !String(f.id||'').trim() || !String(f.pw||'').trim();
    var findIdBtn = document.getElementById('findIdBtn');
    if(findIdBtn) findIdBtn.disabled = f.busy || !String(f.email||'').trim();
    var resetPwBtn = document.getElementById('resetPwBtn');
    if(resetPwBtn) resetPwBtn.disabled = f.busy || !String(f.id||'').trim() || !String(f.email||'').trim() || !String(f.newPw||'').trim() || !pwValid(f.newPw||'');
    var signupBtn = document.getElementById('authSubmit');
    if(signupBtn && av==='signup') signupBtn.disabled = f.busy || authInvalidSignup();
    return r;
  };
})();
