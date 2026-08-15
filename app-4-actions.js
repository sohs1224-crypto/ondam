function emailValid(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e||'')); }
function reqFields(){ return state.authView==='signup' ? AUTH_FIELDS.concat(['email']) : AUTH_FIELDS; }
function isReqField(f){ return reqFields().indexOf(f)>=0; }
function findIdScreen(){
  var msg = state.form.findIdMsg ? '<div class="id-msg" style="color:#3f8f4f;margin-top:12px">'+escapeHtml(state.form.findIdMsg)+'</div>' : '';
  return '<div class="auth">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><button class="iconbtn" data-action="authGo" data-value="login" aria-label="뒤로">'+icon('back',22)+'</button><div style="font-size:20px;font-weight:800">아이디 찾기</div></div>'+
    '<p class="muted" style="font-size:13px">가입 시 등록한 이메일을 입력하면 아이디를 안내해 드려요.</p>'+
    '<div class="field"><div class="field__label">이메일</div><input class="field__input" data-field="findEmail" id="af-findEmail" value="'+escapeAttr(state.form.findEmail||'')+'" placeholder="이메일을 입력하세요" autocomplete="off"></div>'+
    '<div style="margin-top:16px"><button class="btn btn--primary" data-action="authFindId">아이디 찾기</button></div>'+
    msg+
  '</div>';
}
/* ===== 감정(무드) 문구 ===== */
var MOODS = ['설렘','평온','지침','불안','슬픔'];
var MOOD_PHRASES = {
  '설렘':'설레는 하루네요! 그 마음 그대로 오늘을 즐겨봐요 ✨',
  '평온':'평온한 하루, 이 고요함을 오래 간직해요 🍃',
  '지침':'많이 지쳤군요. 잠시 쉬어가도 괜찮아요 🌿',
  '불안':'불안한 마음, 당신 잘못이 아니에요. 천천히 숨을 골라봐요 🤍',
  '슬픔':'슬픈 날엔 울어도 괜찮아요. 곁에 있어줄게요 🫂'
};
/* ===== 공감 엄지 아이콘 (좋아요/싫어요) ===== */
function thumbSVG(active, down){
  var fill = active ? 'var(--like-fill)' : 'none';
  var stroke = active ? '#a6842a' : 'var(--ink-faint)';
  var line = down ? 'M17 14V2' : 'M7 10v12';
  var hand = down
    ? 'M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z'
    : 'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z';
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display:block"><path d="'+line+'" fill="none"/><path d="'+hand+'"/></svg>';
}
function ratePair(action, key, liked, disliked){
  return '<div class="rate">'+
    '<button class="rate-btn'+(liked?' is-on':'')+'" data-action="'+action+'" data-value="'+key+'|up" aria-label="좋아요">'+thumbSVG(liked,false)+'</button>'+
    '<button class="rate-btn'+(disliked?' is-on':'')+'" data-action="'+action+'" data-value="'+key+'|down" aria-label="싫어요">'+thumbSVG(disliked,true)+'</button>'+
  '</div>';
}
function applyRate(obj, dir, countField){
  if(dir==='up'){
    if(obj.liked){ obj.liked=false; obj[countField]--; }
    else { obj.liked=true; obj[countField]++; obj.disliked=false; }
  } else {
    if(obj.disliked){ obj.disliked=false; }
    else { obj.disliked=true; if(obj.liked){ obj.liked=false; obj[countField]--; } }
  }
}
var EMOJIS = ['🙂','😊','🥹','👍','💪','🌱','🤍','🙏','😢','✨'];
function deleteModal(){
  var pd = state.pendingDelete||{};
  var title = pd.kind==='logout' ? '로그아웃 하시겠습니까?' : pd.kind==='withdraw' ? '정말 탈퇴하시겠습니까?' : pd.kind==='reportWorry' ? '이 게시물을 신고하시겠습니까?' : pd.kind==='hideWorry' ? '이 게시물을 숨기시겠습니까?' : '정말 삭제하시겠습니까?';
  var desc = pd.kind==='withdraw' ? '탈퇴 시 모든 활동 내역이 삭제되며 복구할 수 없어요.' : pd.kind==='logout' ? '다시 로그인 화면으로 돌아가요.' : pd.kind==='reportWorry' ? '신고 내용은 운영팀이 확인 후 처리해요.' : pd.kind==='hideWorry' ? '숨긴 게시물은 고민광장 목록에서 보이지 않아요.' : '삭제한 내용은 복구할 수 없어요.';
  var okLabel = pd.kind==='logout' ? '로그아웃' : pd.kind==='withdraw' ? '탈퇴' : pd.kind==='reportWorry' ? '신고' : pd.kind==='hideWorry' ? '숨기기' : '삭제';
  return '<div class="modal-backdrop"><div class="modal">'+
    '<div class="modal-title">'+title+'</div>'+
    '<div class="modal-desc">'+desc+'</div>'+
    '<div class="modal-actions"><button class="btn--modal" data-action="cancelDelete">취소</button><button class="btn--modal btn--danger" data-action="confirmDelete">'+okLabel+'</button></div>'+
  '</div></div>';
}
function render(){
  if(document.body){ document.body.classList.toggle('is-dark', !!(state.settings && state.settings.dark)); }
  var root = document.getElementById('root');
  var html = '<div class="app-root"><div class="app-frame">';
  if(state.stage==='splash'){
    html += '<div class="splash"'+(state.splashFade?' data-out="1"':'')+'>'
      + '<img class="logo-img" src="'+LOGO+'" alt="온담 로고" style="width:96px;height:96px" />'
      + '<div><div class="brand-name">온담</div><div class="brand-en">ONDAM</div></div>'
      + '<p class="brand-slogan">온기를 나누는 우리들의 이야기</p></div>';
  } else if(state.stage==='login'){
    html += authScreen();
  } else {
    var tab = TABS.filter(function(t){return t.key===state.tab;})[0] || TABS[0];
    if(state.sub){
      html += detailTop(SUBTITLES[state.sub]) + SUBSCREENS[state.sub]() + (state.sub==='worryDetail'?'':tabbar());
    } else {
      html += topbar(tab) + SCREENS[tab.key]() + tabbar();
    }
  }
  if(state.pendingDelete){ html += deleteModal(); }
  html += '</div></div>';
  root.innerHTML = html;
}

/* ===== Events (delegation) ===== */
document.addEventListener('click', function(e){
  var el = e.target.closest ? e.target.closest('[data-action]') : null;
  if(!el) return;
  var action = el.getAttribute('data-action');
  var value = el.getAttribute('data-value');
  if(action==='go'){ state.stage = value; state.sub=null; if(value==='app') state.tab='home'; render(); }
  else if(action==='tab'){ if(value==='plaza' && db && !state.plazaLoading) loadWorries(); state.tab = value; state.sub=null; state.bounceMood=false; render(); }
  else if(action==='sort'){ if(value==='학교별'){ state.sub='schoolPick'; render(); } else { state.sort = value; render(); } }
  else if(action==='open'){ if(value==='search') state.query=''; if(value==='write'){ state.draftWorry=''; state.draftTitle=''; state.draftCategory=null; state.worryCatErr=null; state.modWorry=null; } if(value==='notif'){ state.notifUnread=0; } if(value==='meal'){ state.mealMonthOffset=0; } if(value==='perfWrite'){ state.perfErr=null; if(!state.perfDraft) state.perfDraft={subject:null,title:'',due:'',body:'',photo:null}; } if(value==='classRec'){ state.recSelDate=todayISO(0); state.recMonthOffset=0; state.recForm=null; state.recErr=null; } if(value==='examScope'){ state.examEdit=null; } if(value==='perf'){ checkPerfDdayNotifs(); } if(value==='editProfile'){ state.profileForm = { nickname:me.nickname, school:me.school, grade:String(me.grade), classNo:String(me.classNo), touched:{} }; } state.sub = value; render(); }
  else if(action==='mealNav'){ var minOff=-(new Date().getMonth()); state.mealMonthOffset += parseInt(value,10); if(state.mealMonthOffset>0) state.mealMonthOffset=0; if(state.mealMonthOffset<minOff) state.mealMonthOffset=minOff; render(); }
  else if(action==='examSel'){ state.examSel=parseInt(value,10); state.examEdit=null; render(); }
  else if(action==='examEdit'){ var ex=state.examSel||0; state.examEdit={exam:ex,sub:value}; state.examDraft=(examData[ex]&&examData[ex][value])||''; render(); }
  else if(action==='examCancel'){ state.examEdit=null; render(); }
  else if(action==='examSave'){
    var ex2=state.examSel||0; var ta=document.getElementById('examInput'); var v=ta?ta.value.trim():'';
    if(!examData[ex2]) examData[ex2]={};
    if(v) examData[ex2][value]=v; else delete examData[ex2][value];
    state.examEdit=null; render();
  }
  else if(action==='perfSort'){ state.perfSort=value; if(value!=='과목별') state.perfSubj=null; render(); }
  else if(action==='perfSubj'){ state.perfSubj=(state.perfSubj===value?null:value); render(); }
  else if(action==='perfPickSubj'){ if(!state.perfDraft) state.perfDraft={}; state.perfDraft.subject=value; state.perfErr=null; render(); }
  else if(action==='perfRmPhoto'){ if(state.perfDraft) state.perfDraft.photo=null; render(); }
  else if(action==='perfSubmit'){
    var d=state.perfDraft||{};
    var ti=document.getElementById('perfTitle'), du=document.getElementById('perfDue'), bo=document.getElementById('perfBody');
    d.title=ti?ti.value.trim():(d.title||''); d.due=du?du.value:(d.due||''); d.body=bo?bo.value.trim():(d.body||'');
    if(!d.subject){ state.perfErr='과목을 1개 선택해 주세요.'; render(); return; }
    if(!d.title){ state.perfErr='제목을 입력해 주세요.'; render(); return; }
    perfPosts.unshift({ id:Date.now(), subject:d.subject, title:d.title, body:d.body, due:d.due||todayISO(0), photo:d.photo||null, nick:'익명의 나', createdAt:Date.now() });
    state.perfDraft={subject:null,title:'',due:'',body:'',photo:null}; state.perfErr=null; state.sub='perf'; render();
  }
  else if(action==='recNav'){ state.recMonthOffset=(state.recMonthOffset||0)+parseInt(value,10); render(); }
  else if(action==='recPickDate'){ state.recSelDate=value; state.recForm=null; state.recErr=null; render(); }
  else if(action==='recRole'){ me.role=value; state.recForm=null; render(); }
  else if(action==='recAdd'){ state.recForm={type:null,title:'',editId:null}; state.recErr=null; render(); }
  else if(action==='recReq'){ state.recForm={type:null,title:'',editId:null}; state.recErr=null; render(); }
  else if(action==='recPickType'){ if(state.recForm){ state.recForm.type=value; state.recErr=null; } render(); }
  else if(action==='recCancel'){ state.recForm=null; state.recErr=null; render(); }
  else if(action==='recEdit'){ var ev=recEvents.filter(function(x){return String(x.id)===String(value);})[0]; if(ev){ state.recForm={type:ev.type,title:ev.title,editId:ev.id}; } render(); }
  else if(action==='recDelete'){ recEvents=recEvents.filter(function(x){return String(x.id)!==String(value);}); render(); }
  else if(action==='recSubmit'){
    var f=state.recForm||{}; var rt=document.getElementById('recTitle'); f.title=rt?rt.value.trim():(f.title||'');
    if(!f.type){ state.recErr='일정 종류를 선택해 주세요.'; render(); return; }
    if(!f.title){ state.recErr='일정 내용을 입력해 주세요.'; render(); return; }
    var sel=state.recSelDate||todayISO(0);
    var isLeader=(me.role==='반장'||me.role==='부반장');
    if(isLeader){
      if(f.editId){ recEvents.forEach(function(e){ if(String(e.id)===String(f.editId)){ e.type=f.type; e.title=f.title; } }); }
      else { recEvents.push({ id:Date.now(), date:sel, type:f.type, title:f.title }); }
    } else {
      recRequests.push({ id:Date.now(), date:sel, type:f.type, title:f.title, by:me.nickname });
    }
    state.recForm=null; state.recErr=null; render();
  }
  else if(action==='recApprove'){ var rq=recRequests.filter(function(x){return String(x.id)===String(value);})[0]; if(rq){ recEvents.push({id:Date.now(),date:rq.date,type:rq.type,title:rq.title}); recRequests=recRequests.filter(function(x){return String(x.id)!==String(value);}); } render(); }
  else if(action==='recRejReq'){ recRequests=recRequests.filter(function(x){return String(x.id)!==String(value);}); render(); }
  else if(action==='back'){ state.sub = null; state.moreMenuOpen=false; render(); }
  else if(action==='authGo'){ state.authView = value; state.form.touched = {}; render(); }
  else if(action==='pickAuthSchool'){ if(!state.form.touched) state.form.touched={}; state.form.school = value; state.form.touched.school = true; render(); }
  else if(action==='checkId'){
    var idv = String(state.form.id||'').trim();
    if(!state.form.touched) state.form.touched={};
    state.form.touched.id = true;
    if(!idv){ state.form.idChecked=false; state.form.idAvailable=null; render(); return; }
    if(!db){ state.form.idChecked=true; state.form.idAvailable = (TAKEN_IDS.indexOf(idv.toLowerCase())<0); render(); return; }
    state.form.idChecking = true; render();
    db.rpc('is_login_id_available', { want: idv }).then(function(r){
      state.form.idChecking = false;
      state.form.idChecked = true;
      state.form.idAvailable = r.error ? null : !!r.data;
      if(r.error) state.form.authError = authMsg(r.error);
      render();
    });
    return;
  }
  else if(action==='authLogin'){
    var inv = AUTH_FIELDS.some(function(k){ return !String(state.form[k]||'').trim(); });
    if(inv){ if(!state.form.touched) state.form.touched={}; AUTH_FIELDS.forEach(function(k){ state.form.touched[k]=true; }); render(); return; }
    if(!db){ applyAuthProfile(); setLoggedIn(); state.stage='app'; state.tab='home'; checkPerfDdayNotifs(); loadWorries(); render(); return; }
    state.form.authError = null; state.form.busy = true; render();
    db.auth.signInWithPassword({
      email: idToEmail(state.form.id),
      password: String(state.form.pw||'')
    }).then(function(r){
      state.form.busy = false;
      if(r.error){ state.form.authError = authMsg(r.error); render(); return; }
      setLoggedIn();
      loadMyProfile().then(function(){
        state.form.pw=''; state.stage='app'; state.tab='home'; checkPerfDdayNotifs(); loadWorries(); render();
      });
    });
  }
  else if(action==='authSignup'){
    if(authInvalidSignup()){ if(!state.form.touched) state.form.touched={}; reqFields().forEach(function(k){ state.form.touched[k]=true; }); render(); return; }
    if(!db){ applyAuthProfile(); setLoggedIn(); state.stage='app'; state.tab='home'; checkPerfDdayNotifs(); loadWorries(); render(); return; }
    if(state.form.idAvailable !== true){
      state.form.authError = '아이디 중복확인을 먼저 해주세요.'; render(); return;
    }
    state.form.authError = null; state.form.busy = true; render();
    db.auth.signUp({
      email: idToEmail(state.form.id),
      password: String(state.form.pw||''),
      options: { data: {
        login_id: String(state.form.id||'').trim().toLowerCase(),
        nickname: randomNick(),
        school: state.form.school || '',
        grade: String(state.form.grade||''),
        class_no: String(state.form.classNo||''),
        recovery_email: String(state.form.email||'').trim()
      } }
    }).then(function(r){
      state.form.busy = false;
      if(r.error){ state.form.authError = authMsg(r.error); render(); return; }
      if(!r.data.session){
        state.form.authError = '가입은 됐지만 자동 로그인이 안 됐어요. Supabase 설정에서 Confirm email을 꺼주세요.';
        render(); return;
      }
      setLoggedIn();
      loadMyProfile().then(function(){
        state.form.pw=''; state.stage='app'; state.tab='home'; checkPerfDdayNotifs(); loadWorries(); render();
      });
    });
  }
  else if(action==='authFind'){
    var fid = String(state.form.fpId||'').trim();
    state.form.fpMsg = fid ? ('입력하신 아이디("'+fid+'")로 비밀번호 재설정 안내를 보냈어요.') : '아이디를 입력해 주세요.';
    render();
  }
  else if(action==='authFindId'){
    var fem = String(state.form.findEmail||'').trim();
    if(!fem || !emailValid(fem)){ state.form.findIdMsg='올바른 이메일을 입력해 주세요.'; render(); return; }
    if(!db){ state.form.findIdMsg='입력하신 이메일로 가입된 아이디를 안내해 드렸어요.'; render(); return; }
    db.rpc('find_login_id', { email_in: fem }).then(function(r){
      state.form.findIdMsg = (r.error || !r.data)
        ? '해당 이메일로 가입된 계정을 찾지 못했어요.'
        : ('가입된 아이디는 "'+r.data+'" 입니다.');
      render();
    });
    return;
  }
  else if(action==='pickSchool'){ state.sort='학교별'; state.school = value; state.sub=null; state.tab='plaza'; render(); }
  else if(action==='openWorry'){
    state.worryId = value;
    var vw = worries.filter(function(x){return String(x.id)===String(value);})[0];
    if(vw){ vw.views = (vw.views||0)+1; }
    state.draftAnswer=''; state.modAnswer=null; state.emojiOpen=false; state.moreMenuOpen=false; state.sub='worryDetail';
    if(db && vw && !vw.answersLoaded){ loadAnswers(value); db.rpc('increment_views', { w_id: value }); }
    render();
  }
  else if(action==='cardWarm'){
    var cw=worries.filter(function(x){return String(x.id)===String(value);})[0];
    if(!cw) return;
    cw.liked=!cw.liked; cw.warmth += cw.liked?1:-1; render();
    if(db){
      if(cw.liked){ db.from('worry_likes').insert({ worry_id: cw.id, user_id: state.userId }); }
      else { db.from('worry_likes').delete().eq('worry_id', cw.id).eq('user_id', state.userId); }
    }
  }
  else if(action==='cardReply'){ state.worryId=value; state.draftAnswer=''; state.modAnswer=null; state.emojiOpen=false; state.sub='worryDetail'; var rw2=worries.filter(function(x){return String(x.id)===String(value);})[0]; if(db && rw2 && !rw2.answersLoaded){ loadAnswers(value); } render(); setTimeout(function(){ var el=document.getElementById('answerInput'); if(el&&el.focus) el.focus(); },60); }
  else if(action==='toggleFriend'){
    var st = friendStatus(value);
    if(st==='friend'){ friendsList = friendsList.filter(function(f){return f.nick!==value;}); }
    else if(st==='pending'){ friendRequests = friendRequests.filter(function(r){return r.nick!==value;}); }
    else {
      var prof = userProfileData(value);
      friendRequests.push({ nick:value, school:prof.school, warmth:prof.warmth });
      notifs.unshift({ kind:'friendReq', nick:value, title:value+'님이 친구 추가를 요청했어요', time:'방금 전' });
      state.notifUnread = (state.notifUnread||0)+1;
    }
    render();
  }
  else if(action==='acceptFriendReq'){
    var rq = friendRequests.filter(function(r){return r.nick===value;})[0];
    if(rq){ friendsList.push({ nick:rq.nick, school:rq.school, warmth:rq.warmth }); friendRequests = friendRequests.filter(function(r){return r.nick!==value;}); }
    notifs = notifs.filter(function(n){return !(n.kind==='friendReq' && n.nick===value);});
    render();
  }
  else if(action==='declineFriendReq'){
    friendRequests = friendRequests.filter(function(r){return r.nick!==value;});
    notifs = notifs.filter(function(n){return !(n.kind==='friendReq' && n.nick===value);});
    render();
  }
  else if(action==='openFriend'){ state.selFriend=value; state.sub='friendProfile'; render(); }
  else if(action==='openChat'){ if(!isFriend(value)) return; state.selFriend=value; state.sub='friendChat'; state.fchatDraft=''; state.emojiOpen=false; render(); setTimeout(function(){ var el=document.getElementById('fchatInput'); if(el&&el.focus) el.focus(); },60); }
  else if(action==='unfriend'){ friendsList=friendsList.filter(function(f){return f.nick!==value;}); render(); }
  else if(action==='sendWarmth'){
    if(!state.warmthSent) state.warmthSent={};
    if(state.warmthSent[value]) return;
    var fr=friendsList.filter(function(f){return f.nick===value;})[0];
    if(fr){ fr.warmth+=5; state.warmthSent[value]=true; }
    render();
  }
  else if(action==='fchatSend'){
    var fnick=state.selFriend; var inp=document.getElementById('fchatInput'); var fv=inp?inp.value.trim():String(state.fchatDraft||'').trim();
    if(!fnick||!fv) return;
    if(!friendChats[fnick]) friendChats[fnick]=[];
    friendChats[fnick].push({from:'me',text:fv});
    friendChats[fnick].push({from:'them',text:FRIEND_REPLIES[Math.floor(Math.random()*FRIEND_REPLIES.length)]});
    state.fchatDraft=''; render();
    setTimeout(function(){ var el=document.getElementById('fchatInput'); if(el&&el.focus) el.focus(); },60);
  }
  else if(action==='pickMood'){
    state.selectedMood = value; state.moodPhase = 'phrase'; render();
    setTimeout(function(){ state.moodPhase='phraseOut'; render(); setTimeout(function(){ state.moodPhase='done'; render(); }, 450); }, 1900);
  }
  else if(action==='gotoMoodStats'){
    state.bounceMood = true; state.tab='school'; state.sub=null; render();
    setTimeout(function(){ var el=document.getElementById('moodStatCard'); if(el && el.scrollIntoView) el.scrollIntoView({behavior:'smooth',block:'center'}); }, 60);
    setTimeout(function(){ state.bounceMood = false; }, 1700);
  }
  else if(action==='logout'){
    clearLoggedIn();
    state.loginForm = { school:'', grade:'', classNo:'', id:'', pw:'', touched:{} };
    state.stage='login'; state.authView='login'; state.sub=null; render();
  }
  else if(action==='setToggle'){ if(!state.settings) state.settings={}; state.settings[value]=!state.settings[value]; render(); }
  else if(action==='unblock'){ blockedList = blockedList.filter(function(n){return n!==value;}); render(); }
  else if(action==='askLogout'){ state.pendingDelete = { kind:'logout', value:null }; render(); }
  else if(action==='askWithdraw'){ state.pendingDelete = { kind:'withdraw', value:null }; render(); }
  else if(action==='withdraw'){ clearLoggedIn(); state.loginForm={ school:'', grade:'', classNo:'', id:'', pw:'', touched:{} }; state.stage='login'; state.authView='login'; state.sub=null; render(); }
  else if(action==='toggleLike'){
    var wl = worries.filter(function(x){ return String(x.id)===String(value); })[0];
    if(wl){ wl.liked = !wl.liked; wl.warmth += wl.liked ? 1 : -1; render(); }
  }
  else if(action==='rateAnswer'){
    var ap = String(value).split('|'); var ids = ap[0].split('~');
    var wq = worries.filter(function(x){ return String(x.id)===ids[0]; })[0];
    if(wq){
      var an = wq.answers.filter(function(x){ return String(x.id)===ids[1]; })[0];
      if(an){
        var wasLiked = an.liked;
        applyRate(an, ap[1], 'likes');
        render();
        if(db && an.liked !== wasLiked){
          if(an.liked){ db.from('answer_likes').insert({ answer_id: an.id, user_id: state.userId }); }
          else { db.from('answer_likes').delete().eq('answer_id', an.id).eq('user_id', state.userId); }
        }
      }
    }
  }
  else if(action==='toggleEmoji'){ state.emojiOpen = !state.emojiOpen; render(); }
  else if(action==='addEmoji'){ if(state.sub==='friendChat'){ state.fchatDraft=(state.fchatDraft||'')+value; } else { state.draftAnswer=(state.draftAnswer||'')+value; } state.emojiOpen = false; render(); }
  else if(action==='answerSort'){ state.answerSort = value; render(); }
  else if(action==='submitAnswer'){
    var wa = worries.filter(function(x){ return String(x.id)===String(value); })[0];
    var ai = document.getElementById('answerInput');
    var raw2 = ai ? ai.value : (state.draftAnswer||'');
    var av = String(raw2).trim();
    state.draftAnswer = raw2;
    if(!wa || !av){ return; }
    if(containsBad(av)){ state.modAnswer = softenSuggestions(av); render(); return; }
    if(!db){
      wa.answers.push({ id:Date.now(), createdAt:Date.now(), likes:0, liked:false, disliked:false, mine:true, nick:'익명의 나', school:me.school, ago:'방금 전', body:av });
      state.draftAnswer=''; state.modAnswer=null; render(); return;
    }
    state.posting = true; render();
    db.from('answers').insert({
      worry_id: wa.id,
      author_id: state.userId,
      nickname: me.nickname,
      school: me.school,
      body: av
    }).then(function(r){
      state.posting = false;
      state.draftAnswer=''; state.modAnswer=null;
      if(!r.error){
        loadAnswers(wa.id);
        db.rpc('refresh_warmth', { u_id: state.userId }).then(function(rr){
          if(!rr.error && rr.data != null){ me.warmth = rr.data; render(); }
        });
      }
      render();
    });
  }
  else if(action==='submitWorry'){
    var ta = document.getElementById('worryInput');
    var ti = document.getElementById('worryTitleInput');
    var raw = ta ? ta.value : (state.draftWorry||'');
    var rawTitle = ti ? ti.value : (state.draftTitle||'');
    var v = String(raw).trim();
    var title = String(rawTitle).trim();
    state.draftWorry = raw; state.draftTitle = rawTitle;
    if(!state.draftCategory){ state.worryCatErr='카테고리를 선택해 주세요.'; render(); return; }
    if(!v){ return; }
    if(containsBad(title+' '+v)){ state.modWorry = softenSuggestions(v); render(); return; }
    if(!db){
      worries.unshift({ id:Date.now(), nick:'익명의 나', school:me.school, ago:'방금 전', createdAt:Date.now(), warmth:0, views:0, liked:false, disliked:false, mine:true, category:state.draftCategory, bestAnswerId:null, reportCount:0, title:title, body:v, answers:[] });
      state.draftWorry=''; state.draftTitle=''; state.draftCategory=null; state.worryCatErr=null; state.modWorry=null; state.sub = null; state.tab = 'plaza'; render(); return;
    }
    state.posting = true; render();
    db.from('worries').insert({
      author_id: state.userId,
      nickname: me.nickname,
      school: me.school,
      category: state.draftCategory,
      title: title || null,
      body: v
    }).then(function(r){
      state.posting = false;
      if(r.error){ state.worryCatErr = '저장하지 못했어요: '+r.error.message; render(); return; }
      state.draftWorry=''; state.draftTitle=''; state.draftCategory=null; state.worryCatErr=null; state.modWorry=null;
      state.sub = null; state.tab = 'plaza';
      loadWorries();
      render();
    });
  }
  else if(action==='pickWorryCat'){ state.draftCategory=value; state.worryCatErr=null; render(); }
  else if(action==='worryCatFilter'){ state.worryCat=(state.worryCat===value?null:value); render(); }
  else if(action==='pickBest'){
    var bp = String(value).split('~');
    var bw = worries.filter(function(x){return String(x.id)===bp[0];})[0];
    if(!bw || !bw.mine) return;
    var aid = bp[1];
    if(String(bw.bestAnswerId)===aid){
      var prevAns = bw.answers.filter(function(a){return String(a.id)===aid;})[0];
      if(prevAns && prevAns.mine){ me.warmth = Math.max(0, me.warmth-30); }
      bw.bestAnswerId = null;
    } else {
      if(bw.bestAnswerId){
        var oldAns = bw.answers.filter(function(a){return String(a.id)===String(bw.bestAnswerId);})[0];
        if(oldAns && oldAns.mine){ me.warmth = Math.max(0, me.warmth-30); }
      }
      bw.bestAnswerId = aid;
      var newAns = bw.answers.filter(function(a){return String(a.id)===aid;})[0];
      if(newAns && newAns.mine){ me.warmth += 30; }
    }
    if(db){
      db.rpc('pick_best_answer', { a_id: aid }).then(function(r){
        if(!r.error) loadAnswers(bw.id);
      });
    }
    render();
  }
  else if(action==='askReportWorry'){ state.moreMenuOpen=false; state.pendingDelete = { kind:'reportWorry', value:value }; render(); }
  else if(action==='askHideWorry'){ state.moreMenuOpen=false; state.pendingDelete = { kind:'hideWorry', value:value }; render(); }
  else if(action==='toggleMoreMenu'){ state.moreMenuOpen = !state.moreMenuOpen; render(); }
  else if(action==='addHomework'){
    var hti=document.getElementById('hwTextInput'), hdi=document.getElementById('hwDueInput');
    var htext=hti?hti.value.trim():''; var hdue=hdi?hdi.value:'';
    state.hwDraftText=hti?hti.value:''; state.hwDraftDue=hdue;
    if(!htext) return;
    homeworkList.push({ id:Date.now(), text:htext, due:hdue||'', done:false });
    state.hwDraftText=''; state.hwDraftDue=''; render();
  }
  else if(action==='toggleHomework'){ var hw=homeworkList.filter(function(h){return String(h.id)===String(value);})[0]; if(hw){ hw.done=!hw.done; } render(); }
  else if(action==='deleteHomework'){ homeworkList = homeworkList.filter(function(h){return String(h.id)!==String(value);}); render(); }
  else if(action==='requestCounsel'){ state.counselRequested=true; render(); }
  else if(action==='pickEditSchool'){ if(!state.profileForm) return; if(!state.profileForm.touched) state.profileForm.touched={}; state.profileForm.school = value; state.profileForm.touched.school = true; render(); }
  else if(action==='saveProfile'){
    var pf = state.profileForm || {};
    var reqPF = ['nickname','school','grade','classNo'];
    var invalidPF = reqPF.some(function(k){ return !String(pf[k]||'').trim(); });
    if(invalidPF){ if(!pf.touched) pf.touched={}; reqPF.forEach(function(k){ pf.touched[k]=true; }); render(); return; }
    me.nickname = pf.nickname.trim();
    me.school = pf.school.trim();
    me.grade = parseInt(pf.grade,10) || me.grade;
    me.classNo = parseInt(pf.classNo,10) || me.classNo;
    state.sub = null; state.tab = 'my'; render();
  }
  else if(action==='applyWorrySuggest'){ if(state.modWorry){ state.draftWorry = state.modWorry[parseInt(value,10)]||''; state.modWorry=null; render(); } }
  else if(action==='applyAnswerSuggest'){ if(state.modAnswer){ state.draftAnswer = state.modAnswer[parseInt(value,10)]||''; state.modAnswer=null; render(); } }
  else if(action==='askDeleteWorry'){ state.pendingDelete = { kind:'worry', value:value }; render(); }
  else if(action==='askDeleteAnswer'){ state.pendingDelete = { kind:'answer', value:value }; render(); }
  else if(action==='cancelDelete'){ state.pendingDelete = null; render(); }
  else if(action==='confirmDelete'){
    var pd = state.pendingDelete; state.pendingDelete = null;
    if(pd){
      if(pd.kind==='worry'){
        worries = worries.filter(function(x){ return String(x.id)!==String(pd.value); });
        state.sub=null; state.tab='plaza';
        if(db){ db.from('worries').delete().eq('id', pd.value); }
      }
      else if(pd.kind==='answer'){
        var dp = String(pd.value).split(':');
        var wd = worries.filter(function(x){ return String(x.id)===dp[0]; })[0];
        if(wd){ wd.answers = wd.answers.filter(function(a){ return String(a.id)!==dp[1]; }); wd.answerCount = wd.answers.length; }
        if(db){
          db.from('answers').delete().eq('id', dp[1]).then(function(){
            db.rpc('refresh_warmth', { u_id: state.userId }).then(function(rr){
              if(!rr.error && rr.data != null){ me.warmth = rr.data; render(); }
            });
          });
        }
      }
      else if(pd.kind==='logout'){ if(db) db.auth.signOut(); clearLoggedIn(); state.loginForm = { school:'', grade:'', classNo:'', id:'', pw:'', touched:{} }; state.stage='login'; state.authView='login'; state.sub=null; }
      else if(pd.kind==='withdraw'){ clearLoggedIn(); state.loginForm={ school:'', grade:'', classNo:'', id:'', pw:'', touched:{} }; state.stage='login'; state.authView='login'; state.sub=null; }
      else if(pd.kind==='reportWorry'){
        var rw = worries.filter(function(x){return String(x.id)===String(pd.value);})[0];
        if(rw){ rw.reportCount = (rw.reportCount||0)+1; }
        if(db){ db.from('reports').insert({ target_type:'worry', target_id: pd.value, reporter_id: state.userId }); }
        notifs.unshift({ title:'게시물을 신고했어요. 운영팀이 확인 후 조치할게요.', time:'방금 전' });
      }
      else if(pd.kind==='hideWorry'){
        state.hiddenWorryIds[pd.value] = true;
        state.sub=null; state.tab='plaza';
        if(db){
          db.from('hidden_worries').insert({ user_id: state.userId, worry_id: pd.value })
            .then(function(){ loadWorries(); });
        }
        notifs.unshift({ title:'게시물을 숨겼어요. 고민광장 목록에서 보이지 않아요.', time:'방금 전' });
      }
    }
    render();
  }
});

document.addEventListener('input', function(e){
  var t = e.target; if(!t) return;
  if(t.id==='schoolSearchInput'){ var list = document.getElementById('schoolList'); if(list) list.innerHTML = schoolRows(t.value); return; }
  if(t.id==='worryInput'){ state.draftWorry = t.value; return; }
  if(t.id==='worryTitleInput'){ state.draftTitle = t.value; return; }
  if(t.id==='examInput'){ state.examDraft = t.value; return; }
  if(t.id==='perfTitle'){ if(!state.perfDraft) state.perfDraft={}; state.perfDraft.title = t.value; return; }
  if(t.id==='perfDue'){ if(!state.perfDraft) state.perfDraft={}; state.perfDraft.due = t.value; return; }
  if(t.id==='perfBody'){ if(!state.perfDraft) state.perfDraft={}; state.perfDraft.body = t.value; return; }
  if(t.id==='recTitle'){ if(state.recForm) state.recForm.title = t.value; return; }
  if(t.id==='fchatInput'){ state.fchatDraft = t.value; return; }
  if(t.id==='hwTextInput'){ state.hwDraftText = t.value; return; }
  if(t.id==='hwDueInput'){ state.hwDraftDue = t.value; return; }
  if(t.getAttribute && t.getAttribute('data-pfield')!=null){
    var pf = t.getAttribute('data-pfield');
    if(!state.profileForm) state.profileForm={};
    state.profileForm[pf] = t.value;
    if(!state.profileForm.touched) state.profileForm.touched={};
    state.profileForm.touched[pf] = true;
    if(pf==='school'){ var eac=document.getElementById('editSchoolAC'); if(eac) eac.innerHTML=editSchoolAC(t.value); }
    return;
  }
  if(t.id==='answerInput'){ state.draftAnswer = t.value; return; }
  if(t.getAttribute && t.getAttribute('data-field')!=null){
    var f = t.getAttribute('data-field');
    if(!state.form) state.form={};
    state.form[f] = t.value;
    if(!state.form.touched) state.form.touched={};
    if(state.authView!=='login'){ state.form.touched[f] = true; }
    if(f==='id'){ state.form.idChecked=false; state.form.idAvailable=null; var im=document.getElementById('idCheckMsg'); if(im) im.innerHTML=''; }
    if(f==='school'){ var ac=document.getElementById('authSchoolAC'); if(ac) ac.innerHTML=authSchoolAC(t.value); }
    if(isReqField(f)){ updateAuthErrors(); updateAuthSubmit(); if(state.authView==='signup'){ updatePwHint(); updateEmailHint(); } }
  }
});
document.addEventListener('focusout', function(e){
  var t = e.target;
  if(t && t.getAttribute && t.getAttribute('data-field')!=null){
    var f = t.getAttribute('data-field');
    if(isReqField(f)){
      if(state.authView==='login') return;
      if(!state.form.touched) state.form.touched={};
      state.form.touched[f] = true;
      updateAuthErrors(); updateAuthSubmit(); updatePwHint(); updateEmailHint();
    }
  }
});

render();
startApp();