/* ===== 시작 · 로그인 · 회원가입 화면 ===== */

var ONDAM_LOGO = 'logo.png';

function authErrClass(k){
  var f = state.form;
  var touched = f.touched && f.touched[k];
  var empty = !String(f[k]||'').trim();
  return (touched && empty) ? ' is-err' : '';
}

function authSubmitBtn(action, label){
  var f = state.form;
  var disabled = f.busy ? ' disabled'
    : (action==='authSignup' && authInvalidSignup() ? ' disabled' : '');
  return '<div style="margin-top:20px">'+
      '<button class="btn btn--primary" id="authSubmit" data-action="'+action+'"'+disabled+'>'+
        (f.busy ? '잠시만요…' : label)+
      '</button>'+
    '</div>'+
    (f.authError
      ? '<div class="id-msg" style="color:#d9534f;text-align:center;margin-top:10px">'+escapeHtml(f.authError)+'</div>'
      : '');
}

function authPwField(withHint){
  var f = state.form;
  var bad = f.pw && !pwValid(f.pw);
  var hint = withHint
    ? '<div class="pw-hint" id="pwHint" style="color:'+(bad?'#d9534f':'var(--ink-faint)')+'">8자 이상, 영문과 숫자를 포함하여 입력해주세요.</div>'
    : '';
  return '<div class="field"><div class="field__label">비밀번호</div>'+
    '<input class="field__input'+authErrClass('pw')+'" data-field="pw" id="af-pw" type="password" value="'+escapeAttr(f.pw)+'" placeholder="비밀번호를 입력하세요" autocomplete="new-password">'+
    authFieldError('pw')+hint+
  '</div>';
}

authInvalidSignup = function(){
  var f = state.form;
  var miss = reqFields().some(function(k){ return !String(f[k]||'').trim(); });
  var picked = !!(f.atptCode && f.schulCode);
  return miss || !picked || !(f.idChecked && f.idAvailable)
    || !pwValid(f.pw) || !emailValid(f.email);
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
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
      '<button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button>'+
      '<div style="font-size:20px;font-weight:800">로그인</div>'+
    '</div>'+
    '<div style="text-align:center;margin:16px 0 24px">'+
      '<img src="'+ONDAM_LOGO+'" alt="온담" style="width:80px;height:auto;margin:0 auto -10px;display:block" />'+
      '<p style="font-size:14px;color:#888;margin:0">다시 만나 반가워요</p>'+
    '</div>'+
    '<div class="field"><div class="field__label">아이디</div>'+
      '<input class="field__input" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="아이디를 입력하세요" autocomplete="off"></div>'+
    '<div class="field"><div class="field__label">비밀번호</div>'+
      '<input class="field__input" data-field="pw" id="af-pw" type="password" value="'+escapeAttr(f.pw)+'" placeholder="비밀번호를 입력하세요" autocomplete="off"></div>'+
    '<div style="margin-top:20px"><button class="btn btn--primary" id="loginBtn" data-action="authLogin"'+(f.busy?' disabled':'')+'>'+(f.busy?'잠시만요…':'로그인')+'</button></div>'+
    (f.authError?'<div style="color:#d9534f;text-align:center;margin-top:12px;font-size:14px">아이디/비밀번호가 틀렸습니다.</div>':'')+
    '<div class="auth__links"><span data-action="authGo" data-value="findid">아이디 찾기</span><span class="dot"></span><span data-action="authGo" data-value="findpw">비밀번호 찾기</span></div>'+
  '</div>';
}

function signupSchoolField(){
  var f = state.form;
  var picked = !!(f.atptCode && f.schulCode);
  var lockStyle = picked ? 'padding-right:44px;cursor:pointer;background:var(--neutral-fill)' : 'padding-right:44px';
  var lockAttr = picked ? ' readonly' : '';
  var iconBtn = '<button type="button" class="in-field-btn" data-action="searchSchool" aria-label="학교 검색">'+icon('search',18)+'</button>';
  var msg = picked
    ? '<div class="id-msg" style="color:#3f8f4f">'+escapeHtml(f.school)+' 선택됨</div>'
    : (f.schoolSearched ? '<div class="id-msg" style="color:#d9534f">목록에서 학교를 선택해 주세요.</div>' : '<div class="id-msg" style="color:var(--ink-faint)">학교명을 입력하고 검색 버튼을 눌러주세요.</div>');
  return '<div class="field" style="position:relative"><div class="field__label">학교</div><div style="position:relative"><input class="field__input'+authErrClass('school')+'" data-field="school" id="af-school" value="'+escapeAttr(f.school)+'" placeholder="학교명을 입력하세요" autocomplete="off" style="'+lockStyle+'"'+lockAttr+'>'+iconBtn+'</div><div class="ac-list" id="authSchoolAC"></div>'+authFieldError('school')+msg+'</div>';
}

function signupScreen(){
  var f = state.form;
  var idMsg;
  if(f.idChecking) idMsg='<div class="id-msg" id="idCheckMsg">확인 중…</div>';
  else if(f.idChecked) idMsg = f.idAvailable ? '<div class="id-msg" id="idCheckMsg" style="color:#3f8f4f">사용 가능한 아이디입니다.</div>' : '<div class="id-msg" id="idCheckMsg" style="color:#d9534f">이미 사용 중인 아이디입니다.</div>';
  else idMsg='<div class="id-msg" id="idCheckMsg"></div>';
  var emailBad = f.email && !emailValid(f.email);
  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">회원가입</div></div>'+
    signupSchoolField()+
    '<div class="field"><div class="field__label">학년 · 반</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><input class="field__input'+authErrClass('grade')+'" data-field="grade" id="af-grade" value="'+escapeAttr(f.grade)+'" placeholder="학년" inputmode="numeric"><input class="field__input'+authErrClass('classNo')+'" data-field="classNo" id="af-classNo" value="'+escapeAttr(f.classNo)+'" placeholder="반" inputmode="numeric"></div><div style="display:flex;gap:16px">'+authFieldError('grade')+authFieldError('classNo')+'</div></div>'+
    '<div class="field"><div class="field__label">아이디</div><div style="display:flex;gap:8px"><input class="field__input'+authErrClass('id')+'" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="영문·숫자로 입력하세요" autocomplete="off" style="flex:1"><button class="btn--check" data-action="checkId">중복확인</button></div>'+authFieldError('id')+idMsg+'</div>'+
    authPwField(true)+
    '<div class="field"><div class="field__label">이메일</div><input class="field__input'+authErrClass('email')+'" data-field="email" id="af-email" value="'+escapeAttr(f.email||'')+'" placeholder="이메일을 입력하세요" autocomplete="off">'+authFieldError('email')+'<div class="pw-hint" id="emailHint" style="color:'+(emailBad?'#d9534f':'var(--ink-faint)')+'">아이디·비밀번호 찾기에 사용할 이메일이에요.</div></div>'+
    authSubmitBtn('authSignup','회원가입')+
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
reqFields = function(){ return state.authView==='signup' ? AUTH_FIELDS.concat(['email']) : LOGIN_FIELDS; };

/* 로그인 화면 진입 시 폼 초기화 */
document.addEventListener('click', function(e){
  var el = e.target.closest ? e.target.closest('[data-action]') : null;
  if(!el) return;
  var action = el.getAttribute('data-action');
  var value = el.getAttribute('data-value');

  /* 로그인 화면으로 갈 때 아이디·비밀번호 초기화 */
  if(action === 'authGo' && value === 'loginForm'){
    state.form.id = '';
    state.form.pw = '';
    state.form.authError = '';
  }

  /* 로그인 버튼 누를 때 학교·학년·반 기본값 채우기 */
  if(action === 'authLogin'){
    state.form.school = state.form.school || me.school || '온담고등학교';
    state.form.grade = state.form.grade || me.grade || 1;
    state.form.classNo = state.form.classNo || me.classNo || 1;
  }
}, true);

/* render 후 로그인 버튼 강제 활성화 */
(function(){
  var origRender2 = window.render;
  if(typeof origRender2 !== 'function') return;
  window.render = function(){
    var r = origRender2.apply(this, arguments);
    if(state.stage==='login' && state.authView==='loginForm'){
      var btn = document.getElementById('loginBtn');
      if(btn && !state.form.busy) btn.disabled = false;
    }
    return r;
  };
})();
