function privacyScreen(){ return '<div class="screen"><section class="section"><div class="card"><p style="font-size:13px;line-height:1.7;color:var(--ink-soft);white-space:pre-line">온담은 학생들의 안전한 고민 공유를 위해 최소한의 정보만 수집합니다.\n\n· 수집 항목: 닉네임, 학교/학년/반, 이메일(아이디·비밀번호 찾기용)\n· 이용 목적: 서비스 제공, 학교별 커뮤니티 운영, 부적절한 게시물 관리\n· 보관 기간: 회원 탈퇴 시 즉시 파기\n· 익명성: 고민·답변은 닉네임으로만 표시되며 실명은 공개되지 않습니다.\n\n본 방침은 서비스 정책에 따라 변경될 수 있습니다.</p></div></section></div>'; }
function termsScreen(){ return '<div class="screen"><section class="section"><div class="card"><p style="font-size:13px;line-height:1.7;color:var(--ink-soft);white-space:pre-line">제1조(목적) 본 약관은 온담 서비스 이용에 관한 조건을 규정합니다.\n\n제2조(이용) 이용자는 서로를 존중하며 따뜻한 커뮤니티를 함께 만들어갑니다.\n\n제3조(금지행위) 욕설·비방·차별·괴롭힘 등 타인에게 해가 되는 행위를 금지하며, 위반 시 온기점수 차감 및 이용 제한이 있을 수 있습니다.\n\n제4조(콘텐츠) 작성한 고민·답변의 책임은 작성자에게 있으며, 부적절한 게시물은 관리자에 의해 조치될 수 있습니다.</p></div></section></div>'; }
var SUBSCREENS = { dday:ddayScreen, warmthTop:warmthTopScreen, tempTop:tempTopScreen, write:writeScreen, search:searchScreen, notif:notifScreen, schoolPick:schoolPickScreen, worryDetail:worryDetailScreen, meal:mealScreen, examScope:examScreen, perf:perfScreen, perfWrite:perfWriteScreen, timetable:timetableScreen, classRec:classRecScreen, myWarmth:myWarmthScreen, myRank:myRankScreen, monster:monsterScreen, weapon:weaponScreen, friends:friendsScreen, activity:activityScreen, friendProfile:friendProfileScreen, friendChat:friendChatScreen, settings:settingsScreen, myInfo:myInfoScreen, blocked:blockedScreen, privacy:privacyScreen, terms:termsScreen, homework:homeworkScreen, counsel:counselScreen, editProfile:editProfileScreen };
var SUBTITLES = { dday:'시험 D-Day 전체', warmthTop:'이번 달 온기왕 TOP20', tempTop:'학교 온도전 TOP10', write:'고민 작성', search:'고민 검색', notif:'알림', schoolPick:'학교 선택', worryDetail:'고민', meal:'급식', examScope:'시험범위', perf:'수행평가 일정', perfWrite:'수행평가 작성', timetable:'시간표', classRec:'학생 공동 기록', myWarmth:'내 온기점수', myRank:'내 순위', monster:'내 몬스터 도감', weapon:'획득 무기', friends:'친구 목록', activity:'활동 기록', friendProfile:'친구 프로필', friendChat:'1:1 채팅', settings:'설정', myInfo:'내 정보', blocked:'차단 목록', privacy:'개인정보 처리방침', terms:'이용약관', homework:'과제 체크리스트', counsel:'마음 상담 안내', editProfile:'내 정보 수정' };

/* ===== Shell renderers ===== */
function topbar(tab){
  var warmth = tab.warmthOnBar ? '<span class="warmth">'+icon('thermometer',14,2.4)+' '+fmt(me.warmth)+'</span>' : '';
  var badge = state.notifUnread>0 ? '<span class="badge">'+(state.notifUnread>99?'99+':state.notifUnread)+'</span>' : '';
  return '<header class="topbar"><div class="topbar__title">'+tab.title+'</div><div class="topbar__spacer"></div>'+
    '<div class="topbar__actions">'+warmth+'<button class="iconbtn" data-action="open" data-value="notif" aria-label="알림" style="position:relative">'+icon('bell',20)+badge+'</button></div></header>';
}
function tabbar(){
  return '<nav class="tabbar">'+ TABS.map(function(t){
    var active = t.key===state.tab;
    return '<button class="tabbar__item'+(active?' is-active':'')+'" style="--tab-accent:'+t.accent+'" data-action="tab" data-value="'+t.key+'">'+
      icon(t.icon,22,active?2.4:2)+'<span>'+t.label+'</span><span class="tabbar__dot"></span></button>';
  }).join('') + '</nav>';
}

/* ===== Auth (login / signup / find-pw) ===== */
var LOGO = 'data:image/png;base64,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';
var SCHOOL_DB = ['부천고등학교','부천여자고등학교','부천북고등학교','부천정보산업고등학교','부천공업고등학교','부천중학교','부천여자중학교','부천남중학교','부천서중학교','부일중학교','부천일신중학교','상동고등학교','부명고등학교','원미고등학교','계남고등학교','인천고등학교','인천여자고등학교','부평고등학교','계양고등학교','송도고등학교','인천남중학교','제물포고등학교','서울고등학교','경기고등학교','수원고등학교','안양고등학교','성남고등학교','온담고등학교','햇살중학교','바람고등학교','푸른솔중학교','다솜고등학교','한빛중학교','별빛고등학교','가온중학교','미리내고등학교','새봄중학교'];
var AUTH_FIELDS = ['school','grade','classNo','id','pw'];
var TAKEN_IDS = ['ondam','admin','test','user','user123','hong','minsu'];

function authSchoolAC(q){
  q = (q||'').trim();
  if(!q) return '';
  var items = SCHOOL_DB.filter(function(n){ return n.indexOf(q)>=0; });
  if(items.length===1 && items[0]===q) return '';
  items = items.slice(0,8);
  if(items.length===0) return '<div class="ac-item ac-empty">검색 결과가 없어요</div>';
  return items.map(function(n){ return '<button type="button" class="ac-item" data-action="pickAuthSchool" data-value="'+escapeAttr(n)+'">'+escapeHtml(n)+'</button>'; }).join('');
}
function authFieldError(f){
  var t = state.form.touched && state.form.touched[f];
  var e = !String(state.form[f]||'').trim();
  var show = t && e;
  return '<div class="field-err" id="aerr-'+f+'" style="display:'+(show?'block':'none')+'">* 필수 입력 항목입니다.</div>';
}
function updateAuthErrors(){
  reqFields().forEach(function(f){
    var errEl = document.getElementById('aerr-'+f), inp = document.getElementById('af-'+f);
    if(!errEl) return;
    var t = state.form.touched && state.form.touched[f];
    var e = !String(state.form[f]||'').trim();
    if(t && e){ errEl.style.display='block'; if(inp) inp.classList.add('is-err'); }
    else { errEl.style.display='none'; if(inp) inp.classList.remove('is-err'); }
  });
}
function updateAuthSubmit(){
  var btn = document.getElementById('authSubmit'); if(!btn) return;
  if(state.authView==='login'){ btn.disabled = false; return; }
  btn.disabled = authInvalidSignup();
}
function randomNick(){
  var A=['따뜻한','조용한','느린','구름','바람','햇살','별헤는','포근한','씩씩한','다정한'];
  var B=['고래','달팽이','한조각','바다','새싹','오후','산책','노을','민들레','토끼'];
  return A[Math.floor(Math.random()*A.length)] + B[Math.floor(Math.random()*B.length)];
}
function applyAuthProfile(){
  if(state.form.school) me.school = state.form.school;
  if(state.form.grade) me.grade = parseInt(state.form.grade,10) || me.grade;
  if(state.form.classNo) me.classNo = parseInt(state.form.classNo,10) || me.classNo;
}
function findPwScreen(){
  var msg = state.form.fpMsg ? '<div class="id-msg" style="color:#3f8f4f;margin-top:12px">'+escapeHtml(state.form.fpMsg)+'</div>' : '';
  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">비밀번호 찾기</div></div>'+
    '<p class="muted" style="font-size:13px">가입 시 등록한 아이디를 입력하면 비밀번호 재설정을 안내해 드려요.</p>'+
    '<div class="field"><div class="field__label">아이디</div><input class="field__input" data-field="fpId" id="af-fpId" value="'+escapeAttr(state.form.fpId||'')+'" placeholder="아이디를 입력하세요" autocomplete="off"></div>'+
    '<div style="margin-top:16px"><button class="btn btn--primary" data-action="authFind">비밀번호 재설정 안내 받기</button></div>'+
    msg+
  '</div>';
}
function authScreen(){
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
  return '<div class="auth">'+head+
    '<div class="field" style="position:relative">'+
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
    '</div>'+
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
}

/* ===== 자동 로그인 ===== */
function isLoggedIn(){ try{ return localStorage.getItem('ondam_login')==='1'; }catch(e){ return false; } }
function setLoggedIn(){ try{ localStorage.setItem('ondam_login','1'); }catch(e){} }
function clearLoggedIn(){ try{ localStorage.removeItem('ondam_login'); }catch(e){} }

/* 로그인한 사람의 프로필을 서버에서 가져와 me 에 반영 */
function loadMyProfile(){
  if(!db) return Promise.resolve(false);
  return db.auth.getUser().then(function(res){
    var u = res && res.data && res.data.user;
    if(!u) return false;
    state.userId = u.id;
    return db.from('profiles').select('*').eq('id', u.id).single().then(function(r){
      if(r.error || !r.data) return false;
      var d = r.data;
      me.nickname = d.nickname || me.nickname;
      me.school   = d.school   || me.school;
      me.grade    = d.grade    || me.grade;
      me.classNo  = d.class_no || me.classNo;
      me.warmth   = (d.warmth == null) ? me.warmth : d.warmth;
      me.loginId  = d.login_id || '';
      return true;
    });
  }).catch(function(){ return false; });
}
/* ===== 스플래시 ===== */
function startApp(){
  if(state.stage!=='splash') return;
  setTimeout(function(){
    state.splashFade = true; render();
    setTimeout(function(){
      state.splashFade = false;
      if(db){
        db.auth.getSession().then(function(res){
          var s = res && res.data && res.data.session;
          if(s){
            setLoggedIn();
            loadMyProfile().then(function(){
              state.stage='app'; state.tab='home'; checkPerfDdayNotifs(); loadWorries(); render();
            });
          } else {
            clearLoggedIn();
            state.stage='login'; state.authView='login'; render();
          }
        });
      } else {
        state.stage='login'; state.authView='login';
      }
      render();
    }, 450);
  }, 2300);
}
/* ===== 이메일 / 필수 필드 ===== */