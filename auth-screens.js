/* ===== 시작 · 학교선택 · 학년선택 · 닉네임 · 소셜가입 · 로그인 · 비밀번호/아이디 찾기 화면 ===== */

var ONDAM_LOGO = 'logo.png';

function errBox(msg){
  if(!msg) return '';
  return '<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:12px 16px;margin-top:14px;text-align:center;font-size:14px;color:#dc2626">'+escapeHtml(msg)+'</div>';
}

function phoneValid(p){
  var d = String(p||'').replace(/[^0-9]/g,'');
  return d.length >= 10 && d.length <= 11;
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
  var miss = ['school','grade','classNo','id','pw','email','phone','nickname'].some(function(k){ return !String(f[k]||'').trim(); });
  var picked = !!(f.atptCode && f.schulCode);
  var idBad = f.id && !/^[a-zA-Z0-9]+$/.test(f.id);
  return miss || idBad || !picked || !(f.idChecked && f.idAvailable)
    || !pwValid(f.pw) || !emailValid(f.email) || !f.phoneVerified;
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
      '<button data-action="authGo" data-value="signupSchool" style="width:100%;padding:17px 0;font-size:17px;font-weight:700;border-radius:12px;border:none;cursor:pointer;background:#8fae7e;color:#fff;font-family:inherit">시작하기</button>'+
      '<div style="text-align:center;margin-top:18px;font-size:13px"><span style="color:#aaa">이미 계정이 있나요? </span><span data-action="authGo" data-value="loginForm" style="color:#8fae7e;font-weight:600;cursor:pointer;text-decoration:underline">로그인</span></div>'+
    '</div>'+
  '</div>';
}

/* ══════════════════════════════════════
   1단계: 학교 선택
   ══════════════════════════════════════ */
function signupSchoolScreen(){
  var f = state.form;
  var picked = !!(f.atptCode && f.schulCode);
  var lockStyle = picked ? 'padding-right:44px;cursor:pointer;background:var(--neutral-fill)' : 'padding-right:44px';
  var lockAttr = picked ? ' readonly' : '';
  var iconBtn = '<button type="button" class="in-field-btn" data-action="searchSchool" aria-label="학교 검색">'+icon('search',18)+'</button>';

  return '<div style="min-height:100vh;padding:0 0 96px 0;background:#fff">'+
    '<div class="auth" style="padding-bottom:0">'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
        '<button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button>'+
        '<div style="font-size:20px;font-weight:800">학교 선택</div>'+
      '</div>'+
      '<p style="font-size:13px;color:#888;margin:6px 0 20px">다니고 있는 학교를 선택해 주세요.</p>'+
      '<div class="field" style="position:relative">'+
        '<div class="field__label">학교</div>'+
        '<div style="position:relative">'+
          '<input class="field__input" data-field="school" id="af-school" value="'+escapeAttr(f.school)+'" placeholder="학교명을 입력하세요" autocomplete="off" style="'+lockStyle+'"'+lockAttr+'>'+
          iconBtn+
        '</div>'+
        '<div class="ac-list" id="authSchoolAC"></div>'+
      '</div>'+
    '</div>'+

    '<div id="schoolNextBar" style="position:fixed;left:0;right:0;bottom:0;background:#fff;'+
      'padding:12px 24px calc(12px + env(safe-area-inset-bottom, 0px));'+
      'border-top:1px solid #eee;z-index:100">'+
      '<button class="btn btn--primary" id="schoolNextBtn" data-action="schoolNext" disabled '+
        'style="width:100%;padding:16px 0;font-size:16px;font-weight:700;border-radius:12px;border:none;font-family:inherit">다음</button>'+
    '</div>'+
  '</div>';
}

/* ══════════════════════════════════════
   2단계: 학년 선택
   ══════════════════════════════════════ */
function signupGradeScreen(){
  var f = state.form;
  var sel = String(f.grade||'');

  var card = function(g){
    var on = sel === String(g);
    return '<button data-action="pickGrade" data-value="'+g+'" '+
      'style="display:block;width:100%;padding:26px 24px;margin-bottom:14px;'+
      'font-size:20px;font-weight:700;text-align:center;cursor:pointer;font-family:inherit;'+
      'border-radius:14px;border:2px solid '+(on?'#8fae7e':'#e8e8e8')+';'+
      'background:'+(on?'#f2f7ef':'#fff')+';color:'+(on?'#4a6b3a':'#1a1a1a')+'">'+
      g+'학년</button>';
  };

  return '<div style="min-height:100vh;padding:0 0 96px 0;background:#fff">'+
    '<div class="auth" style="padding-bottom:0">'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
        '<button class="iconbtn" data-action="authGo" data-value="signupSchool" aria-label="뒤로">'+icon('back',22)+'</button>'+
        '<div style="font-size:20px;font-weight:800">학년 선택</div>'+
      '</div>'+
      '<p style="font-size:13px;color:#888;margin:6px 0 24px">몇 학년인가요?</p>'+
      card(1)+card(2)+card(3)+
    '</div>'+

    '<div id="schoolNextBar" style="position:fixed;left:0;right:0;bottom:0;background:#fff;'+
      'padding:12px 24px calc(12px + env(safe-area-inset-bottom, 0px));'+
      'border-top:1px solid #eee;z-index:100">'+
      '<button class="btn btn--primary" id="gradeNextBtn" data-action="gradeNext" disabled '+
        'style="width:100%;padding:16px 0;font-size:16px;font-weight:700;border-radius:12px;border:none;font-family:inherit">다음</button>'+
    '</div>'+
  '</div>';
}

/* ══════════════════════════════════════
   3단계: 닉네임 입력
   ══════════════════════════════════════ */
function signupNickScreen(){
  var f = state.form;
  var nick = f.nickname || '';
  var tooLong = nick.length > 12;

  return '<div style="min-height:100vh;padding:0 0 96px 0;background:#fff">'+
    '<div class="auth" style="padding-bottom:0">'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+
        '<button class="iconbtn" data-action="authGo" data-value="signupGrade" aria-label="뒤로">'+icon('back',22)+'</button>'+
        '<div style="font-size:20px;font-weight:800">닉네임 설정</div>'+
      '</div>'+
      '<p style="font-size:13px;color:#888;margin:6px 0 24px">온담에서 사용할 닉네임을 정해주세요.</p>'+
      '<div class="field">'+
        '<div class="field__label">닉네임</div>'+
        '<input class="field__input" data-field="nickname" id="af-nickname" value="'+escapeAttr(nick)+'" placeholder="닉네임을 입력하세요" autocomplete="off" maxlength="12">'+
        '<div class="pw-hint" style="color:'+(tooLong?'#d9534f':'var(--ink-faint)')+'">12자 이내로 입력해 주세요.</div>'+
      '</div>'+
    '</div>'+

    '<div id="schoolNextBar" style="position:fixed;left:0;right:0;bottom:0;background:#fff;'+
      'padding:12px 24px calc(12px + env(safe-area-inset-bottom, 0px));'+
      'border-top:1px solid #eee;z-index:100">'+
      '<button class="btn btn--primary" id="nickNextBtn" data-action="nickNext" disabled '+
        'style="width:100%;padding:16px 0;font-size:16px;font-weight:700;border-radius:12px;border:none;font-family:inherit">다음</button>'+
    '</div>'+
  '</div>';
}

/* ══════════════════════════════════════
   4단계: 소셜 로그인으로 가입 완료
   ══════════════════════════════════════ */
function signupSocialScreen(){
  var f = state.form;

  var btn = function(provider, label, bg, color, border, iconSvg){
    return '<button data-action="socialAuth" data-value="'+provider+'" '+
      'style="display:flex;align-items:center;justify-content:center;gap:10px;'+
      'width:100%;padding:15px 0;margin-bottom:11px;font-size:15px;font-weight:600;'+
      'cursor:pointer;font-family:inherit;border-radius:12px;'+
      'background:'+bg+';color:'+color+';border:'+border+'">'+
      iconSvg+'<span>'+label+'</span></button>';
  };

  var appleIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.54c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.61-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.75-.78-2.87-.76-1.48.02-2.84.86-3.6 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.29-.88-2.31-3.5zM14.9 5.6c.6-.74 1.01-1.75.9-2.77-.87.04-1.93.58-2.56 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.58-1.22z"/></svg>';
  var kakaoIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.48 2 10.78c0 2.77 1.84 5.2 4.6 6.58l-1.17 4.3c-.1.37.31.66.63.45l5.15-3.4c.26.02.52.03.79.03 5.52 0 10-3.48 10-7.96S17.52 3 12 3z"/></svg>';
  var googleIcon = '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.89-1.74 2.98-4.3 2.98-7.34z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.41 13.91a6.01 6.01 0 0 1 0-3.82V7.5H3.06a10 10 0 0 0 0 9l3.35-2.59z"/><path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2A10 10 0 0 0 3.06 7.5l3.35 2.59C7.2 7.73 9.4 5.98 12 5.98z"/></svg>';

  return '<div style="display:flex;flex-direction:column;min-height:100vh;padding:0 24px;background:#fff">'+
    '<div style="padding-top:8px">'+
      '<button class="iconbtn" data-action="authGo" data-value="signupNick" aria-label="뒤로">'+icon('back',22)+'</button>'+
    '</div>'+

    '<div style="flex:1"></div>'+

    '<div style="text-align:center">'+
      '<img src="'+ONDAM_LOGO+'" alt="온담 로고" style="width:120px;height:auto;margin:0 auto -16px;display:block" />'+
      '<div style="font-size:24px;font-weight:800;color:#1a1a1a;margin:0;letter-spacing:-0.5px">온담</div>'+
      '<p style="font-size:14px;color:#888;line-height:1.6;margin:6px 0 0 0">마음이 머무르는 곳<br>이야기에 따뜻한 온기를 더해봐요.</p>'+
    '</div>'+

    '<div style="flex:1.1"></div>'+

    '<div style="padding-bottom:calc(32px + env(safe-area-inset-bottom, 0px))">'+
      btn('kakao',  '카카오톡으로 로그인', '#FEE500',  '#191600',  'none',            kakaoIcon)+
      btn('google', 'Google로 로그인',  '#fff',     '#1a1a1a',  '1px solid #dadce0', googleIcon)+
      errBox(f.authError)+
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
    (f.authError?'<div style="color:#d9534f;text-align:center;margin-top:8px;font-size:13px">아이디 또는 비밀번호가 올바르지 않아요.</div>':'')+
    '<div class="auth__links"><span data-action="authGo" data-value="findid">아이디 찾기</span><span class="dot"></span><span data-action="authGo" data-value="findpw">비밀번호 찾기</span></div>'+
  '</div>';
}

findIdScreen = function(){
  var f = state.form;
  if(f.foundId){
    return '<div class="auth">'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="loginForm" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">아이디 찾기</div></div>'+
      '<div style="text-align:center;margin:40px 0"><p style="font-size:14px;color:#888;margin:0 0 12px">등록된 아이디입니다.</p><div style="font-size:22px;font-weight:800;color:#1a1a1a;background:#f4f4f4;padding:16px;border-radius:12px">'+escapeHtml(f.foundId)+'</div></div>'+
      '<div style="margin-top:20px"><button class="btn btn--primary" data-action="authGo" data-value="loginForm">로그인하러 가기</button></div>'+
    '</div>';
  }
  var mode = f.findMode || 'phone';
  var isPhone = mode === 'phone';
  var tabStyle = function(on){
    return 'flex:1;padding:11px 0;font-size:14px;font-weight:'+(on?'700':'400')+
      ';border:none;cursor:pointer;background:'+(on?'#8fae7e':'#f4f4f4')+
      ';color:'+(on?'#fff':'#888')+';font-family:inherit';
  };
  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="loginForm" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">아이디 찾기</div></div>'+
    '<p style="font-size:13px;color:#888;margin:0 0 16px">가입 시 등록한 정보로 아이디를 찾을 수 있어요.</p>'+
    '<div style="display:flex;border-radius:10px;overflow:hidden;margin-bottom:18px">'+
      '<button data-action="findMode" data-value="phone" style="'+tabStyle(isPhone)+'">전화번호</button>'+
      '<button data-action="findMode" data-value="email" style="'+tabStyle(!isPhone)+'">본인확인 이메일</button>'+
    '</div>'+
    (isPhone
      ? '<div class="field"><div class="field__label">전화번호</div><div style="display:flex;gap:8px"><input class="field__input" data-field="findPhone" id="af-findPhone" value="'+escapeAttr(f.findPhone||'')+'" placeholder="010-0000-0000" inputmode="numeric" autocomplete="off" style="flex:1"><button class="btn--check" id="findIdBtn" data-action="findId">다음</button></div></div>'
      : '<div class="field"><div class="field__label">본인확인 이메일</div><div style="display:flex;gap:8px"><input class="field__input" data-field="email" id="af-email" value="'+escapeAttr(f.email||'')+'" placeholder="이메일을 입력하세요" autocomplete="off" style="flex:1"><button class="btn--check" id="findIdBtn" data-action="findId">다음</button></div></div>'
    )+
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

authScreen = function(){
  if(state.authView==='findpw') return findPwScreen();
  if(state.authView==='findid') return findIdScreen();
  if(state.authView==='signupSchool') return signupSchoolScreen();
  if(state.authView==='signupGrade') return signupGradeScreen();
  if(state.authView==='signupNick') return signupNickScreen();
  if(state.authView==='signupSocial') return signupSocialScreen();
  if(state.authView==='loginForm') return loginScreen();
  return welcomeScreen();
};

var LOGIN_FIELDS = ['id','pw'];
reqFields = function(){ return LOGIN_FIELDS; };

document.addEventListener('click', function(e){
  var el = e.target.closest ? e.target.closest('[data-action]') : null;
  if(!el) return;
  var action = el.getAttribute('data-action');
  var value = el.getAttribute('data-value');
  var f = state.form;

  /* 학교 선택 → 학년 선택 */
  if(action==='schoolNext'){
    e.stopImmediatePropagation(); e.preventDefault();
    if(!(f.atptCode && f.schulCode)) return;
    state.authView = 'signupGrade';
    render(); return;
  }

  /* 학년 카드 선택 */
  if(action==='pickGrade'){
    e.stopImmediatePropagation(); e.preventDefault();
    f.grade = value;
    render(); return;
  }

  /* 학년 → 닉네임 */
  if(action==='gradeNext'){
    e.stopImmediatePropagation(); e.preventDefault();
    if(!String(f.grade||'').trim()) return;
    state.authView = 'signupNick';
    render(); return;
  }

  /* 닉네임 → 소셜 로그인 */
  if(action==='nickNext'){
    e.stopImmediatePropagation(); e.preventDefault();
    var nk = String(f.nickname||'').trim();
    if(!nk || nk.length > 12) return;
    state.authView = 'signupSocial';
    render(); return;
  }

  /* 소셜 로그인으로 가입 */
  if(action==='socialAuth'){
    e.stopImmediatePropagation(); e.preventDefault();
    if(!db){ f.authError='로그인 서비스에 연결할 수 없어요.'; render(); return; }
    try{
      localStorage.setItem('ondam_signup', JSON.stringify({
        nickname: String(f.nickname||'').trim(),
        school: f.school, atptCode: f.atptCode, schulCode: f.schulCode,
        schoolKind: f.schoolKind || '', grade: String(f.grade||'')
      }));
    }catch(err){}
    f.authError=''; render();
    db.auth.signInWithOAuth({
      provider: value,
      options: { redirectTo: window.location.origin }
    }).then(function(r){
      if(r.error){ f.authError = '로그인에 실패했어요. 잠시 후 다시 시도해 주세요.'; render(); }
    });
    return;
  }

  if(action==='findMode'){
    e.stopImmediatePropagation(); e.preventDefault();
    f.findMode = value; f.authError=''; f.findPhone=''; f.email='';
    render(); return;
  }

  if(action==='authGo'&&value==='loginForm'){f.id='';f.pw='';f.authError='';f.resetOk=false;f.foundId='';}
  if(action==='authGo'&&value==='findpw'){f.id='';f.email='';f.newPw='';f.authError='';f.resetOk=false;}
  if(action==='authGo'&&value==='findid'){f.email='';f.findPhone='';f.authError='';f.foundId='';f.findMode='phone';}
  if(action==='authGo'&&value==='signupSchool'){f.authError='';}
  if(action==='authLogin'){f.school=f.school||me.school||'온담고등학교';f.grade=f.grade||me.grade||1;f.classNo=f.classNo||me.classNo||1;}

  if(action==='resetPw'){
    e.stopImmediatePropagation();
    f.busy=true;f.authError='';render();
    db.rpc('reset_password',{login_id_in:String(f.id||'').trim(),email_in:String(f.email||'').trim(),new_pw:String(f.newPw||'').trim()})
      .then(function(r){f.busy=false;if(r.error){f.authError='처리 중 오류가 발생했습니다.';render();return;}if(r.data===true){f.resetOk=true;f.authError='';}else{f.authError='아이디 또는 이메일이 일치하지 않습니다.';}render();});
  }

  if(action==='findId'){
    e.stopImmediatePropagation();
    var contact = (f.findMode==='email') ? String(f.email||'').trim() : String(f.findPhone||'').trim();
    if(!contact){ render(); return; }
    f.busy=true;f.authError='';render();
    db.rpc('find_login_id_by',{contact:contact})
      .then(function(r){
        f.busy=false;
        if(r.error||!r.data){ f.authError='등록된 아이디를 찾지 못했어요.'; render(); return; }
        f.foundId=r.data; f.authError=''; render();
      });
  }
}, true);

document.addEventListener('input', function(e){
  var t = e.target; if(!t) return;
  if(t.id === 'af-newPw') state.form.newPw = t.value;
  if(t.id === 'af-nickname') state.form.nickname = t.value;
  if(t.id === 'af-findPhone') state.form.findPhone = t.value;
});

/* 200ms마다 버튼 상태 갱신 */
setInterval(function(){
  if(typeof state==='undefined' || state.stage!=='login') return;
  var f = state.form;
  if(f.busy) return;

  var schoolNextBtn = document.getElementById('schoolNextBtn');
  if(schoolNextBtn) schoolNextBtn.disabled = !(f.atptCode && f.schulCode);

  var gradeNextBtn = document.getElementById('gradeNextBtn');
  if(gradeNextBtn) gradeNextBtn.disabled = !String(f.grade||'').trim();

  var nickNextBtn = document.getElementById('nickNextBtn');
  if(nickNextBtn){
    var nk = String(f.nickname||'').trim();
    nickNextBtn.disabled = !nk || nk.length > 12;
  }

  var loginBtn = document.getElementById('loginBtn');
  if(loginBtn) loginBtn.disabled = !(String(f.id||'').trim() && String(f.pw||'').trim());

  var findIdBtn = document.getElementById('findIdBtn');
  if(findIdBtn){
    var contact = (f.findMode==='email') ? String(f.email||'').trim() : String(f.findPhone||'').trim();
    findIdBtn.disabled = !contact;
  }

  var resetPwBtn = document.getElementById('resetPwBtn');
  if(resetPwBtn) resetPwBtn.disabled = !(String(f.id||'').trim() && String(f.email||'').trim() && String(f.newPw||'').trim() && pwValid(f.newPw||''));
}, 200);

/* 모바일 키보드 위로 다음 버튼 올리기 */
(function(){
  if(!window.visualViewport) return;
  function adjustBar(){
    var bar = document.getElementById('schoolNextBar');
    if(!bar) return;
    var vv = window.visualViewport;
    var gap = window.innerHeight - vv.height - vv.offsetTop;
    bar.style.transform = gap > 0 ? 'translateY(-'+gap+'px)' : '';
  }
  window.visualViewport.addEventListener('resize', adjustBar);
  window.visualViewport.addEventListener('scroll', adjustBar);
  setInterval(adjustBar, 300);
})();

/* 탈퇴 후 세션 정리 */
(function(){
  setTimeout(function(){
    if(typeof db==='undefined') return;
    db.auth.getSession().then(function(res){
      var s = res && res.data && res.data.session;
      if(!s) return;
      db.from('profiles').select('id').eq('id', s.user.id).single().then(function(r){
        if(r.error || !r.data){ db.auth.signOut().then(function(){ location.reload(); }); }
      });
    });
  }, 2000);
})();
