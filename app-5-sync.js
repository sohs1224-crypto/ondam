/* ===== 서버 동기화 + 화면 보정 =====
   app-4-actions.js 의 클릭 처리가 전역 배열을 바꾼 뒤,
   여기서 그 변화를 서버에 반영합니다.
   이 파일은 항상 마지막에 로드되므로, 앞 파일의 함수를 덮어쓸 수 있습니다. */

/* ── 로그인 화면: 아이디·비밀번호만 입력받도록 교체 ──
   회원가입은 기존처럼 학교·학년·반을 그대로 받습니다.
   (원래 app-3-detail.js 에 있던 authScreen 을 여기서 대체합니다) */
authScreen = function(){
  if(state.authView==='findpw') return findPwScreen();
  if(state.authView==='findid') return findIdScreen();
  var isSignup = (state.authView==='signup');
  var f = state.form;
  function errC(k){ var t=f.touched&&f.touched[k]; var e=!String(f[k]||'').trim(); return (t&&e)?' is-err':''; }
  var idMsg;
  if(isSignup && f.idChecking){ idMsg = '<div class="id-msg" id="idCheckMsg">확인 중…</div>'; }
  else if(isSignup && f.idChecked){
    idMsg = f.idAvailable
      ? '<div class="id-msg" id="idCheckMsg" style="color:#3f8f4f">사용 가능한 아이디입니다.</div>'
      : '<div class="id-msg" id="idCheckMsg" style="color:#d9534f">이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.</div>';
  } else { idMsg = '<div class="id-msg" id="idCheckMsg"></div>'; }
  var disabledAttr = isSignup ? (authInvalidSignup()?' disabled':'') : '';
  var pwBad = f.pw && !pwValid(f.pw);
  var pwHintHtml = '<div class="pw-hint" id="pwHint" style="color:'+(pwBad?'#d9534f':'var(--ink-faint)')+'">8자 이상, 영문과 숫자를 포함하여 입력해주세요.</div>';
  var emailBad = f.email && !emailValid(f.email);
  var emailFieldHtml = '<div class="field"><div class="field__label">이메일</div>'+
    '<input class="field__input'+errC('email')+'" data-field="email" id="af-email" value="'+escapeAttr(f.email||'')+'" placeholder="이메일을 입력하세요" autocomplete="off">'+
    authFieldError('email')+
    '<div class="pw-hint" id="emailHint" style="color:'+(emailBad?'#d9534f':'var(--ink-faint)')+'">아이디·비밀번호 찾기에 사용할 이메일이에요.</div>'+
  '</div>';
  var head = isSignup
    ? '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">회원가입</div></div>'
    : '<div style="text-align:center;margin-bottom:8px"><img class="logo-img" src="'+LOGO+'" alt="온담 로고" style="width:66px;height:66px;margin:0 auto 14px;display:block" /><div class="brand-name" style="font-size:30px">온담</div><p class="brand-slogan">다시 만나 반가워요</p></div>';
  var idField = isSignup
    ? '<div style="display:flex;gap:8px"><input class="field__input'+errC('id')+'" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="아이디를 입력하세요" autocomplete="off" style="flex:1"><button class="btn--check" data-action="checkId">중복확인</button></div>'
    : '<input class="field__input'+errC('id')+'" data-field="id" id="af-id" value="'+escapeAttr(f.id)+'" placeholder="아이디를 입력하세요" autocomplete="off">';
  var links = isSignup
    ? '<div class="auth__links"><span data-action="authGo" data-value="login">이미 계정이 있어요 · 로그인</span></div>'
    : '<div class="auth__links"><span data-action="authGo" data-value="signup">회원가입</span><span class="dot"></span><span data-action="authGo" data-value="findid">아이디 찾기</span><span class="dot"></span><span data-action="authGo" data-value="findpw">비밀번호 찾기</span></div>'+
      '<div class="divider">또는</div>'+
      '<button class="btn btn--outline" data-action="go" data-value="app">먼저 둘러보기</button>'+
      '<p class="placeholder-note" style="text-align:center">로그인 없이 앱을 미리 볼 수 있어요 (작성·온기 기능은 로그인 후 이용)</p>';

  /* 학교·학년·반은 회원가입에서만 */
  var schoolFields = isSignup
    ? ('<div class="field" style="position:relative">'+
        '<div class="field__label">학교</div>'+
        '<input class="field__input'+errC('school')+'" data-field="school" id="af-school" value="'+escapeAttr(f.school)+'" placeholder="학교명을 검색하세요" autocomplete="off">'+
        '<div class="ac-list" id="authSchoolAC"></div>'+
        authFieldError('school')+
      '</div>'+
      '<div class="field"><div class="field__label">학년 · 반</div>'+
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
          '<input class="field__input'+errC('grade')+'" data-field="grade" id="af-grade" value="'+escapeAttr(f.grade)+'" placeholder="학년" inputmode="numeric">'+
          '<input class="field__input'+errC('classNo')+'" data-field="classNo" id="af-classNo" value="'+escapeAttr(f.classNo)+'" placeholder="반" inputmode="numeric">'+
        '</div>'+
        '<div style="display:flex;gap:16px">'+authFieldError('grade')+authFieldError('classNo')+'</div>'+
      '</div>')
    : '';

  return '<div class="auth">'+head+
    schoolFields+
    '<div class="field"><div class="field__label">아이디</div>'+idField+authFieldError('id')+(isSignup?idMsg:'')+'</div>'+
    '<div class="field"><div class="field__label">비밀번호</div>'+
      '<input class="field__input'+errC('pw')+'" data-field="pw" id="af-pw" type="password" value="'+escapeAttr(f.pw)+'" placeholder="비밀번호를 입력하세요">'+
      authFieldError('pw')+(isSignup?pwHintHtml:'')+
    '</div>'+
    (isSignup?emailFieldHtml:'')+
    '<div style="margin-top:20px"><button class="btn btn--primary" id="authSubmit" data-action="'+(isSignup?'authSignup':'authLogin')+'"'+(f.busy?' disabled':disabledAttr)+'>'+(f.busy?'잠시만요…':(isSignup?'회원가입':'로그인'))+'</button></div>'+
    (f.authError?'<div class="id-msg" style="color:#d9534f;text-align:center;margin-top:10px">'+escapeHtml(f.authError)+'</div>':'')+
    links+
  '</div>';
};

/* 로그인 시 필수 항목은 아이디·비밀번호만 */
var LOGIN_FIELDS = ['id','pw'];
reqFields = function(){
  return state.authView==='signup' ? AUTH_FIELDS.concat(['email']) : LOGIN_FIELDS;
};

(function(){

  /* app-4 의 로그인 검사는 학교·학년·반까지 확인합니다.
     로그인 화면에서는 그 칸이 없으므로, 검사 전에 기존 값으로 채워 통과시킵니다.
     (로그인 성공 후 서버 프로필로 다시 덮어씁니다) */
  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el) return;
    if(el.getAttribute('data-action') !== 'authLogin') return;
    state.form.school  = state.form.school  || me.school  || '온담고등학교';
    state.form.grade   = state.form.grade   || me.grade   || 1;
    state.form.classNo = state.form.classNo || me.classNo || 1;
  }, true);

  /* ── 클릭 결과를 서버에 반영 ── */
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
