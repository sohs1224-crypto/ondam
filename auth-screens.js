/* ===== 로그인 · 회원가입 화면 =====
   두 화면을 각각 독립된 함수로 나눠 둡니다.
   app-3-detail.js 의 authScreen 을 이 파일이 대체합니다. */

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

/* 회원가입은 목록에서 고른 학교여야 통과합니다 */
authInvalidSignup = function(){
  var f = state.form;
  var miss = reqFields().some(function(k){ return !String(f[k]||'').trim(); });
  var schoolPicked = !!(f.atptCode && f.schulCode);
  return miss || !schoolPicked || !(f.idChecked && f.idAvailable)
    || !pwValid(f.pw) || !emailValid(f.email);
};


/* ── 로그인 화면 ── */
function loginScreen(){
  var f = state.form;
  return '<div class="auth">'+
    '<div style="text-align:center;margin-bottom:8px">'+
      '<img class="logo-img" src="'+LOGO+'" alt="온담 로고" style="width:66px;height:66px;margin:0 auto 14px;display:block" />'+
      '<div class="brand-name" style="font-size:30px">온담</div>'+
      '<p class="brand-slogan">다시 만나 반가워요</p>'+
    '</div>'+

    '<div class="field"><div class="field__label">아이디</div>'+
      '<input class="field__input'+authErrClass('id')+'" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="아이디를 입력하세요" autocomplete="off">'+
      authFieldError('id')+
    '</div>'+

    authPwField(false)+
    authSubmitBtn('authLogin', '로그인')+

    '<div class="auth__links">'+
      '<span data-action="authGo" data-value="signup">회원가입</span><span class="dot"></span>'+
      '<span data-action="authGo" data-value="findid">아이디 찾기</span><span class="dot"></span>'+
      '<span data-action="authGo" data-value="findpw">비밀번호 찾기</span>'+
    '</div>'+
    '<div class="divider">또는</div>'+
    '<button class="btn btn--outline" data-action="go" data-value="app">먼저 둘러보기</button>'+
    '<p class="placeholder-note" style="text-align:center">로그인 없이 앱을 미리 볼 수 있어요 (작성·온기 기능은 로그인 후 이용)</p>'+
  '</div>';
}


/* ── 회원가입 화면 ── */
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

  /* 학교: 검색 버튼 + 선택 여부 안내 */
  var schoolPicked = !!(f.atptCode && f.schulCode);
  var schoolMsg = schoolPicked
    ? '<div class="id-msg" style="color:#3f8f4f">'+escapeHtml(f.school)+' 선택됨</div>'
    : (f.schoolSearched
        ? '<div class="id-msg" style="color:#d9534f">목록에서 학교를 선택해 주세요.</div>'
        : '<div class="id-msg" style="color:var(--ink-faint)">검색 후 목록에서 학교를 선택해야 해요.</div>');

  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
      '<button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button>'+
      '<div style="font-size:20px;font-weight:800">회원가입</div>'+
    '</div>'+

    '<div class="field" style="position:relative">'+
      '<div class="field__label">학교</div>'+
      '<div style="display:flex;gap:8px">'+
        '<input class="field__input'+authErrClass('school')+'" data-field="school" id="af-school" value="'+escapeAttr(f.school)+'" placeholder="학교명을 입력하세요" autocomplete="off" style="flex:1">'+
        '<button class="btn--check" data-action="searchSchool">검색</button>'+
      '</div>'+
      '<div class="ac-list" id="authSchoolAC"></div>'+
      authFieldError('school')+schoolMsg+
    '</div>'+

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


/* ── 어느 화면을 보여줄지 ── */
authScreen = function(){
  if(state.authView==='findpw') return findPwScreen();
  if(state.authView==='findid') return findIdScreen();
  if(state.authView==='signup') return signupScreen();
  return loginScreen();
};


/* ── 로그인 시 필수 항목은 아이디·비밀번호만 ── */
var LOGIN_FIELDS = ['id','pw'];
reqFields = function(){
  return state.authView==='signup' ? AUTH_FIELDS.concat(['email']) : LOGIN_FIELDS;
};

/* app-4 의 로그인 검사는 학교·학년·반까지 확인합니다.
   로그인 화면에는 그 칸이 없으므로 검사 직전에 기존 값으로 채워 통과시킵니다. */
document.addEventListener('click', function(e){
  var el = e.target.closest ? e.target.closest('[data-action]') : null;
  if(!el || el.getAttribute('data-action') !== 'authLogin') return;
  state.form.school  = state.form.school  || me.school  || '온담고등학교';
  state.form.grade   = state.form.grade   || me.grade   || 1;
  state.form.classNo = state.form.classNo || me.classNo || 1;
}, true);
