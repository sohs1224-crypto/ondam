/* ===== 시작 · 로그인 · 회원가입 화면 ===== */

/* ── 공통 조각 ── */
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
    '<input class="field__input'+authErrClass('pw')+'" data-field="pw" id="af-pw" type="password" value="'+escapeAttr(f.pw)+'" placeholder="비밀번호를 입력하세요">'+
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


/* ══════════════════════════════════════
   시작 화면 (스플래시 후 첫 화면)
   ══════════════════════════════════════ */
function welcomeScreen(){
  return '<div class="auth" style="display:flex;flex-direction:column;min-height:calc(100vh - 40px);padding:0 24px;justify-content:space-between">'+

    /* 상단 여백 */
    '<div style="flex:0.8"></div>'+

    /* 로고 + 제목 + 슬로건 */
    '<div style="text-align:center">'+
      '<img src="'+LOGO+'" alt="온담 로고" style="width:88px;height:88px;margin:0 auto 20px;display:block" />'+
      '<div style="font-size:34px;font-weight:800;color:var(--ink);margin-bottom:16px">온담</div>'+
      '<p style="font-size:15px;font-weight:400;color:var(--ink-soft);line-height:1.7;margin:0">'+
        '마음이 머무르는 곳<br>'+
        '우리의 이야기에 따뜻한 온기를 더해봐요.'+
      '</p>'+
    '</div>'+

    /* 하단 여백 */
    '<div style="flex:1"></div>'+

    /* 시작하기 버튼 + 로그인 링크 */
    '<div style="padding-bottom:40px">'+
      '<button class="btn btn--primary" data-action="authGo" data-value="signup" '+
        'style="width:100%;padding:16px;font-size:16px;font-weight:700;'+
        'border-radius:14px;border:none;cursor:pointer;'+
        'background:#8fae7e;color:#fff">시작하기</button>'+
      '<div style="text-align:center;margin-top:16px;font-size:13px">'+
        '<span style="color:#999">이미 계정이 있나요? </span>'+
        '<span data-action="authGo" data-value="loginForm" '+
          'style="color:#8fae7e;font-weight:700;cursor:pointer">로그인</span>'+
      '</div>'+
    '</div>'+

  '</div>';
}


/* ══════════════════════════════════════
   로그인 화면 (아이디 + 비밀번호)
   ══════════════════════════════════════ */
function loginScreen(){
  var f = state.form;
  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
      '<button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button>'+
      '<div style="font-size:20px;font-weight:800">로그인</div>'+
    '</div>'+

    '<div style="text-align:center;margin:16px 0 24px">'+
      '<img src="'+LOGO+'" alt="온담 로고" style="width:56px;height:56px;margin:0 auto 10px;display:block" />'+
      '<p style="font-size:14px;color:var(--ink-soft);margin:0">다시 만나 반가워요</p>'+
    '</div>'+

    '<div class="field"><div class="field__label">아이디</div>'+
      '<input class="field__input'+authErrClass('id')+'" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="아이디를 입력하세요" autocomplete="off">'+
      authFieldError('id')+
    '</div>'+

    authPwField(false)+
    authSubmitBtn('authLogin', '로그인')+

    '<div class="auth__links">'+
      '<span data-action="authGo" data-value="findid">아이디 찾기</span><span class="dot"></span>'+
      '<span data-action="authGo" data-value="findpw">비밀번호 찾기</span>'+
    '</div>'+
  '</div>';
}


/* ══════════════════════════════════════
   회원가입: 학교 입력칸
   ══════════════════════════════════════ */
function signupSchoolField(){
  var f = state.form;
  var picked = !!(f.atptCode && f.schulCode);

  var lockStyle = picked
    ? 'padding-right:44px;cursor:pointer;background:var(--neutral-fill)'
    : 'padding-right:44px';
  var lockAttr = picked ? ' readonly title="다시 누르면 새로 검색할 수 있어요"' : '';

  var iconBtn = '<button type="button" class="in-field-btn" data-action="searchSchool" aria-label="학교 검색">'+
      icon('search', 18)+
    '</button>';

  var msg = picked
    ? '<div class="id-msg" style="color:#3f8f4f">'+escapeHtml(f.school)+' 선택됨</div>'
    : (f.schoolSearched
        ? '<div class="id-msg" style="color:#d9534f">목록에서 학교를 선택해 주세요.</div>'
        : '<div class="id-msg" style="color:var(--ink-faint)">학교명을 입력하고 검색 버튼을 눌러주세요.</div>');

  return '<div class="field" style="position:relative">'+
    '<div class="field__label">학교</div>'+
    '<div style="position:relative">'+
      '<input class="field__input'+authErrClass('school')+'" data-field="school" id="af-school" '+
        'value="'+escapeAttr(f.school)+'" placeholder="학교명을 입력하세요" autocomplete="off" '+
        'style="'+lockStyle+'"'+lockAttr+'>'+
      iconBtn+
    '</div>'+
    '<div class="ac-list" id="authSchoolAC"></div>'+
    authFieldError('school')+msg+
  '</div>';
}


/* ══════════════════════════════════════
   회원가입 화면
   ══════════════════════════════════════ */
function signupScreen(){
  var f = state.form;

  var idMsg;
  if(f.idChecking){ idMsg = '<div class="id-msg" id="idCheckMsg">확인 중…</div>'; }
  else if(f.idChecked){
    idMsg = f.idAvailable
      ? '<div class="id-msg" id="idCheckMsg" style="color:#3f8f4f">사용 가능한 아이디입니다.</div>'
      : '<div class="id-msg" id="idCheckMsg" style="color:#d9534f">이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.</div>';
  } else { idMsg = '<div class="id-msg" id="idCheckMsg"></div>'; }

  var emailBad = f.email && !emailValid(f.email);

  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
      '<button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button>'+
      '<div style="font-size:20px;font-weight:800">회원가입</div>'+
    '</div>'+

    signupSchoolField()+

    '<div class="field"><div class="field__label">학년 · 반</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
        '<input class="field__input'+authErrClass('grade')+'" data-field="grade" id="af-grade" value="'+escapeAttr(f.grade)+'" placeholder="학년" inputmode="numeric">'+
        '<input class="field__input'+authErrClass('classNo')+'" data-field="classNo" id="af-classNo" value="'+escapeAttr(f.classNo)+'" placeholder="반" inputmode="numeric">'+
      '</div>'+
      '<div style="display:flex;gap:16px">'+authFieldError('grade')+authFieldError('classNo')+'</div>'+
    '</div>'+

    '<div class="field"><div class="field__label">아이디</div>'+
      '<div style="display:flex;gap:8px">'+
        '<input class="field__input'+authErrClass('id')+'" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="영문·숫자로 입력하세요" autocomplete="off" style="flex:1">'+
        '<button class="btn--check" data-action="checkId">중복확인</button>'+
      '</div>'+
      authFieldError('id')+idMsg+
    '</div>'+

    authPwField(true)+

    '<div class="field"><div class="field__label">이메일</div>'+
      '<input class="field__input'+authErrClass('email')+'" data-field="email" id="af-email" value="'+escapeAttr(f.email||'')+'" placeholder="이메일을 입력하세요" autocomplete="off">'+
      authFieldError('email')+
      '<div class="pw-hint" id="emailHint" style="color:'+(emailBad?'#d9534f':'var(--ink-faint)')+'">아이디·비밀번호 찾기에 사용할 이메일이에요.</div>'+
    '</div>'+

    authSubmitBtn('authSignup', '회원가입')+

    '<div class="auth__links"><span data-action="authGo" data-value="login">이미 계정이 있어요 · 로그인</span></div>'+
  '</div>';
}


/* ══════════════════════════════════════
   화면 라우팅
   ══════════════════════════════════════ */
authScreen = function(){
  if(state.authView==='findpw') return findPwScreen();
  if(state.authView==='findid') return findIdScreen();
  if(state.authView==='signup') return signupScreen();
  if(state.authView==='loginForm') return loginScreen();
  /* 기본: 시작 화면 */
  return welcomeScreen();
};


/* ── 로그인 시 필수 항목은 아이디·비밀번호만 ── */
var LOGIN_FIELDS = ['id','pw'];
reqFields = function(){
  return state.authView==='signup' ? AUTH_FIELDS.concat(['email']) : LOGIN_FIELDS;
};

/* 로그인 화면에는 학교·학년·반 칸이 없으므로 검사 직전에 채워 통과시킵니다. */
document.addEventListener('click', function(e){
  var el = e.target.closest ? e.target.closest('[data-action]') : null;
  if(!el || el.getAttribute('data-action') !== 'authLogin') return;
  state.form.school  = state.form.school  || me.school  || '온담고등학교';
  state.form.grade   = state.form.grade   || me.grade   || 1;
  state.form.classNo = state.form.classNo || me.classNo || 1;
}, true);
