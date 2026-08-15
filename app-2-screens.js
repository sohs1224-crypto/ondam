function mealMenuFor(y,m,d){
  var rices=['흑미밥','잡곡밥','기장밥','백미밥','콩나물밥'];
  var soups=['미역국','된장국','김치찌개','북엇국','유부국','감자국'];
  var mains=['제육볶음','치킨마요','돈까스','불고기','카레','닭갈비','생선까스','떡볶이','고등어구이','오징어볶음'];
  var sides=['배추김치','깍두기','시금치나물','콩나물무침','계란찜','어묵볶음','멸치볶음'];
  var desserts=['요구르트','사과','바나나','우유','식혜','귤'];
  var i=(y*372)+(m*31)+d;
  return [ rices[i%rices.length], soups[(i+1)%soups.length], mains[(i+2)%mains.length], sides[(i+3)%sides.length], desserts[(i+4)%desserts.length] ];
}
function mealScreen(){
  var base = new Date();
  var t = new Date(base.getFullYear(), base.getMonth()+state.mealMonthOffset, 1);
  var y = t.getFullYear(), m = t.getMonth();
  var monthLabel = y+'년 '+(m+1)+'월';
  var daysInMonth = new Date(y, m+1, 0).getDate();
  var weeks=[], week=[null,null,null,null,null], has=false;
  for(var d=1; d<=daysInMonth; d++){
    var dow = new Date(y,m,d).getDay();
    if(dow===0||dow===6) continue;
    if(dow===1 && has){ weeks.push(week); week=[null,null,null,null,null]; has=false; }
    week[dow-1]=d; has=true;
  }
  if(has) weeks.push(week);
  var header = ['월','화','수','목','금'].map(function(w){ return '<div class="meal-hd">'+w+'</div>'; }).join('');
  var todayD = (state.mealMonthOffset===0) ? base.getDate() : -1;
  var rows = weeks.map(function(wk){
    return '<div class="meal-row">'+ wk.map(function(dd){
      if(!dd) return '<div class="meal-cell meal-cell--empty"></div>';
      return '<div class="meal-cell'+(dd===todayD?' is-today':'')+'"><div class="meal-date">'+dd+'</div><div class="meal-menu">'+mealMenuFor(y,m,dd).map(function(x){ return '<div>'+escapeHtml(x)+'</div>'; }).join('')+'</div></div>';
    }).join('')+'</div>';
  }).join('');
  var minOff = -base.getMonth();
  var canPrev = state.mealMonthOffset > minOff;
  var canNext = state.mealMonthOffset < 0;
  var sat = [{k:'맛있어요',v:62,c:'var(--accent-game)'},{k:'보통이에요',v:28,c:'var(--warm-500)'},{k:'아쉬워요',v:10,c:'var(--ink-faint)'}];
  var satRows = sat.map(function(s){
    return '<div class="sat-row"><span class="sat-k">'+s.k+'</span><div class="sat-bar"><div class="sat-fill" style="width:'+s.v+'%;background:'+s.c+'"></div></div><span class="sat-v">'+s.v+'%</span></div>';
  }).join('');
  return '<div class="screen">'+
    '<section class="section">'+
      '<div class="meal-nav">'+
        '<button class="meal-navbtn'+(canPrev?'':' is-disabled')+'"'+(canPrev?' data-action="mealNav" data-value="-1"':'')+' aria-label="이전 달">'+icon('back',20)+'</button>'+
        '<div class="meal-month">'+monthLabel+'</div>'+
        '<button class="meal-navbtn'+(canNext?'':' is-disabled')+'"'+(canNext?' data-action="mealNav" data-value="1"':'')+' aria-label="다음 달">'+icon('chevron',20)+'</button>'+
      '</div>'+
      '<div class="meal-school">'+escapeHtml(me.school)+' 급식</div>'+
      '<div class="meal-cal"><div class="meal-row meal-head">'+header+'</div>'+rows+'</div>'+
    '</section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">우리학교 급식 만족도</h2></div>'+
      '<div class="card">'+satRows+'</div></section>'+
  '</div>';
}
/* ===== 학교생활 카테고리 공통 ===== */
var SUBJECTS = ['국어','영어','수학','과학','사회','한국사','도덕','기술·가정','음악','체육','미술','기타'];
function isoDate(y,m,d){ return y+'-'+('0'+(m+1)).slice(-2)+'-'+('0'+d).slice(-2); }
function todayISO(off){ var t=new Date(); t.setDate(t.getDate()+(off||0)); return isoDate(t.getFullYear(),t.getMonth(),t.getDate()); }

/* ===== 시험범위 ===== */
var EXAMS = ['1학기 중간고사','1학기 기말고사','2학기 중간고사','2학기 기말고사'];
var examData = [
  {'국어':'문학 1~3단원 · 시 5편 암기','수학':'수1 지수·로그, 수열 전 범위','영어':'교과서 Lesson 1~3, 단어시험 포함'},
  {}, {}, {}
];
function examScreen(){
  var sel = state.examSel||0;
  var tabs = EXAMS.map(function(e,i){ return '<button class="seg'+(sel===i?' is-active':'')+'" style="flex:1 1 46%;font-size:12px" data-action="examSel" data-value="'+i+'">'+e+'</button>'; }).join('');
  var data = examData[sel]||{};
  var list = SUBJECTS.map(function(sub){
    var scope = data[sub];
    var editing = state.examEdit && String(state.examEdit.exam)===String(sel) && state.examEdit.sub===sub;
    if(editing){
      return '<div class="card" style="margin-bottom:10px"><div style="font-weight:800">'+sub+'</div>'+
        '<textarea id="examInput" class="textarea" style="min-height:80px" placeholder="시험범위를 입력하세요">'+escapeHtml(state.examDraft||'')+'</textarea>'+
        '<div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn--primary" data-action="examSave" data-value="'+sub+'" style="flex:1">저장</button><button class="btn btn--outline" data-action="examCancel" style="flex:1">취소</button></div></div>';
    }
    return '<div class="card" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><div style="font-weight:800">'+sub+'</div>'+
      '<button class="del-btn" data-action="examEdit" data-value="'+sub+'">'+(scope?'수정·보완':'작성')+'</button></div>'+
      '<div class="muted" style="font-size:13px;margin-top:6px;white-space:pre-wrap">'+(scope?escapeHtml(scope):'아직 작성된 시험범위가 없어요. 같은 반 친구들과 함께 채워보세요.')+'</div></div>';
  }).join('');
  return '<div class="screen">'+
    '<section class="section"><div style="display:flex;flex-wrap:wrap;gap:6px">'+tabs+'</div>'+
      '<p class="placeholder-note" style="margin-top:8px">'+escapeHtml(me.school)+' '+me.grade+'학년 '+me.classNo+'반 · 함께 작성하는 시험범위</p></section>'+
    '<section class="section">'+list+'</section></div>';
}

/* ===== 수행평가 일정 ===== */
var perfPosts = [
  {id:1,subject:'수학',title:'2차함수 그래프 그리기',body:'그래프를 손으로 그려 제출. 채점 기준표 배부됨.',due:todayISO(6),photo:null,nick:'익명의 짝꿍',createdAt:300},
  {id:2,subject:'영어',title:'영어 말하기 발표',body:'3분 자유주제 스피킹, 대본 암기 필수.',due:todayISO(3),photo:null,nick:'옆자리친구',createdAt:200},
  {id:3,subject:'과학',title:'중화반응 실험 보고서',body:'산-염기 중화반응 보고서 A4 2장 분량.',due:todayISO(12),photo:null,nick:'앞자리',createdAt:100}
];
var homeworkList = [
  {id:1,text:'수학 익힘책 24p 풀기',due:todayISO(1),done:false},
  {id:2,text:'국어 독서기록장 제출',due:todayISO(4),done:false},
  {id:3,text:'영어 단어시험 대비 암기',due:todayISO(-1),done:true}
];
function hwDaysLabel(due){
  if(!due) return '';
  var d=new Date(due+'T00:00:00'), n=new Date(); n.setHours(0,0,0,0);
  var diff=Math.round((d-n)/86400000);
  return diff>0?'D-'+diff:(diff===0?'D-DAY':'지남');
}
function homeworkScreen(){
  var items = homeworkList.slice().sort(function(a,b){
    if(a.done!==b.done) return a.done?1:-1;
    if(!a.due) return 1; if(!b.due) return -1;
    return a.due.localeCompare(b.due);
  });
  var rows = items.length ? items.map(function(h){
    return '<div class="hw-row'+(h.done?' is-done':'')+'">'+
      '<button class="hw-check" data-action="toggleHomework" data-value="'+h.id+'" aria-label="완료 체크">'+(h.done?icon('check',14,3,'#fff'):'')+'</button>'+
      '<span class="hw-text">'+escapeHtml(h.text)+'</span>'+
      (h.due?'<span class="hw-due">'+hwDaysLabel(h.due)+'</span>':'')+
      '<button class="hw-del" data-action="deleteHomework" data-value="'+h.id+'" aria-label="삭제">×</button>'+
    '</div>';
  }).join('') : '<p class="placeholder-note" style="text-align:center;padding:24px 0">등록된 과제가 없어요.</p>';
  return '<div class="screen"><section class="section">'+
    '<div class="card"><input class="field__input" id="hwTextInput" placeholder="과제 내용을 입력하세요" value="'+escapeAttr(state.hwDraftText||'')+'" autocomplete="off">'+
    '<div style="display:flex;gap:8px;margin-top:8px"><input class="field__input" id="hwDueInput" type="date" value="'+escapeAttr(state.hwDraftDue||'')+'" style="flex:1"><button class="btn btn--primary" data-action="addHomework" style="flex:none;width:auto;white-space:nowrap;padding:0 18px">추가</button></div></div>'+
    '</section><section class="section"><div class="rows" style="gap:8px;display:flex;flex-direction:column">'+rows+'</div></section></div>';
}
function counselScreen(){
  var reqDone = !!state.counselRequested;
  return '<div class="screen"><section class="section"><div class="card" style="background:var(--surface-alt)">'+
    '<p class="muted" style="font-size:14px;line-height:1.7">힘든 마음이 들 때는 혼자 참지 않아도 돼요. 온담과 함께, 또는 아래 도움을 통해 이야기해보세요. 당신의 마음은 소중해요 🌱</p></div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">도움을 받을 수 있는 곳</h2></div><div class="rows">'+
      '<div class="list-row" style="cursor:default"><span class="list-row__ic">'+icon('bell',18)+'</span><span class="list-row__txt"><span class="list-row__title">청소년전화 1388</span><span class="list-row__sub">24시간 무료 상담 · 문자 #1388</span></span></div>'+
      '<div class="list-row" style="cursor:default"><span class="list-row__ic">'+icon('heart',18)+'</span><span class="list-row__txt"><span class="list-row__title">정신건강 위기상담전화 1577-0199</span><span class="list-row__sub">24시간 전문 상담</span></span></div>'+
      '<div class="list-row" style="cursor:default"><span class="list-row__ic">'+icon('users',18)+'</span><span class="list-row__txt"><span class="list-row__title">자살예방상담전화 1393</span><span class="list-row__sub">24시간 위기 상담</span></span></div>'+
    '</div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">학교 상담 선생님께 요청하기</h2></div>'+
      (reqDone
        ? '<div class="card" style="text-align:center;color:var(--warm-600);font-weight:800">신청이 접수되었어요. 선생님이 곧 연락드릴게요 🌱</div>'
        : '<button class="btn btn--primary" data-action="requestCounsel">상담 신청하기</button>')+
    '</section></div>';
}
function checkPerfDdayNotifs(){
  perfPosts.forEach(function(p){
    var d=new Date(p.due+'T00:00:00'), n=new Date(); n.setHours(0,0,0,0);
    var diff=Math.round((d-n)/86400000);
    if(diff>=0 && diff<=3 && !state.notifiedPerfIds[p.id]){
      state.notifiedPerfIds[p.id]=true;
      var label = diff===0?'D-DAY':('D-'+diff);
      notifs.unshift({ title:"'"+p.title+"' 수행평가 마감이 "+label+"이에요!", time:'방금 전' });
      state.notifUnread = (state.notifUnread||0)+1;
    }
  });
}
function perfDday(due){ var d=new Date(due+'T00:00:00'),n=new Date();n.setHours(0,0,0,0);var diff=Math.round((d-n)/86400000);return diff>0?'D-'+diff:(diff===0?'D-DAY':'지남'); }
function wbWords(t){ return String(t||'').split(/\s+/).filter(Boolean).map(function(w){ return '<span class="wbw">'+escapeHtml(w)+'</span>'; }).join(' '); }
function perfCard(p){
  return '<article class="worry" style="cursor:default"><div class="worry__meta"><span class="subj-tag">'+escapeHtml(p.subject)+'</span><span class="worry__nick">'+escapeHtml(p.nick)+'</span><span>·</span><span style="color:var(--warm-600);font-weight:800">'+perfDday(p.due)+'</span></div>'+
    '<div class="worry__title">'+wbWords(p.title)+'</div>'+
    '<p class="worry__body">'+escapeHtml(p.body)+'</p>'+
    (p.photo?'<img src="'+p.photo+'" alt="첨부" style="margin-top:8px;width:100%;border-radius:12px;max-height:200px;object-fit:cover">':'')+
    '<div class="worry__foot"><span>'+icon('calendar',14)+' 마감 '+p.due+'</span></div></article>';
}
function perfScreen(){
  var posts = perfPosts.slice();
  if(state.perfSort==='가까운순'){ posts.sort(function(a,b){ return a.due.localeCompare(b.due); }); }
  else if(state.perfSort==='과목별'){ if(state.perfSubj){ posts=posts.filter(function(p){return p.subject===state.perfSubj;}); } posts.sort(function(a,b){return b.createdAt-a.createdAt;}); }
  else { posts.sort(function(a,b){return b.createdAt-a.createdAt;}); }
  var sorts = ['최신순','가까운순','과목별'].map(function(s){ return '<button class="seg'+(state.perfSort===s?' is-active':'')+'" style="font-size:12px" data-action="perfSort" data-value="'+s+'">'+s+'</button>'; }).join('');
  var subjChips = state.perfSort==='과목별' ? '<div class="subj-wrap" style="margin-top:8px">'+SUBJECTS.map(function(s){ return '<button class="subj-chip'+(state.perfSubj===s?' is-on':'')+'" data-action="perfSubj" data-value="'+s+'">'+s+'</button>'; }).join('')+'</div>' : '';
  var cards = posts.length ? posts.map(perfCard).join('') : '<p class="placeholder-note" style="text-align:center;padding:24px 0">해당 과목의 수행평가가 없어요.</p>';
  return '<div class="screen screen--flush">'+
    '<div style="padding:12px 16px 0"><div style="display:flex;gap:6px">'+sorts+'</div>'+subjChips+
      '<p class="placeholder-note" style="margin-top:8px">'+escapeHtml(me.school)+' '+me.grade+'학년 '+me.classNo+'반 학생만 작성·확인할 수 있어요</p></div>'+
    '<div style="padding:4px 16px 0">'+cards+'</div>'+
    '<button class="fab" data-action="open" data-value="perfWrite" aria-label="수행평가 작성">'+icon('plus',26)+'</button></div>';
}
function perfWriteScreen(){
  var d = state.perfDraft||{};
  var chips = SUBJECTS.map(function(s){ return '<button class="subj-chip'+(d.subject===s?' is-on':'')+'" data-action="perfPickSubj" data-value="'+s+'">'+s+'</button>'; }).join('');
  return '<div class="screen"><section class="section">'+
    '<div class="field__label">과목 · 1개 필수 선택</div><div class="subj-wrap">'+chips+'</div>'+
    '<input class="field__input" id="perfTitle" placeholder="제목을 입력하세요" value="'+escapeAttr(d.title||'')+'" style="margin-top:12px" autocomplete="off">'+
    '<div class="field__label" style="margin-top:10px">수행평가 마감일</div>'+
    '<input class="field__input" id="perfDue" type="date" value="'+escapeAttr(d.due||'')+'">'+
    '<textarea id="perfBody" class="textarea" placeholder="수행평가 내용을 적어주세요">'+escapeHtml(d.body||'')+'</textarea>'+
    '<div style="margin-top:10px"><label class="photo-btn">📷 사진 첨부<input type="file" accept="image/*" onchange="handlePerfPhoto(this)" style="display:none"></label></div>'+
    (d.photo?'<div style="margin-top:10px;position:relative"><img src="'+d.photo+'" alt="첨부 미리보기" style="width:100%;border-radius:12px;max-height:220px;object-fit:cover"><button class="del-btn" data-action="perfRmPhoto" style="position:absolute;top:8px;right:8px;background:#fff">사진 삭제</button></div>':'')+
    (state.perfErr?'<div class="field-err" style="display:block">'+escapeHtml(state.perfErr)+'</div>':'')+
    '<button class="btn btn--primary" data-action="perfSubmit" style="margin-top:14px">등록</button>'+
  '</section></div>';
}
function handlePerfPhoto(input){
  var f = input.files && input.files[0]; if(!f) return;
  var r = new FileReader();
  r.onload = function(){ if(!state.perfDraft) state.perfDraft={}; state.perfDraft.photo = r.result; render(); };
  r.readAsDataURL(f);
}

/* ===== 시간표 (오늘) ===== */
var TIMETABLE = {
  1:['국어','수학','영어','과학','한국사','체육','미술'],
  2:['수학','영어','국어','사회','기술·가정','음악','자율'],
  3:['영어','과학','수학','국어','도덕','체육','동아리'],
  4:['국어','사회','영어','수학','과학','미술','음악'],
  5:['수학','국어','영어','한국사','체육','기술·가정','자율']
};
function timetableScreen(){
  var names=['','월','화','수','목','금'];
  var todayDow=new Date().getDay();
  var head='<div class="tt-head">'+escapeHtml(me.school)+' '+me.grade+'학년 '+me.classNo+'반</div>';
  var hdr='<div class="tt-cell tt-corner">교시</div>'+[1,2,3,4,5].map(function(d){ return '<div class="tt-cell tt-dayhd'+(d===todayDow?' is-today':'')+'">'+names[d]+'</div>'; }).join('');
  var body='';
  for(var per=0; per<7; per++){
    body+='<div class="tt-cell tt-perno">'+(per+1)+'</div>';
    for(var d=1; d<=5; d++){
      var sub=(TIMETABLE[d]&&TIMETABLE[d][per])||'';
      body+='<div class="tt-cell tt-subj'+(d===todayDow?' is-today':'')+'">'+escapeHtml(sub)+'</div>';
    }
  }
  return '<div class="screen"><section class="section">'+head+
    '<p class="placeholder-note" style="margin:2px 0 12px">이번 주 시간표 (월~금)</p>'+
    '<div class="tt-grid">'+hdr+body+'</div></section></div>';
}

/* ===== 학생 공동 기록 (캘린더) ===== */
var REC_TYPES = ['체육대회','축제','현장체험학습','학급 행사','생일','기타'];
var recEvents = [
  {id:1,date:todayISO(0),type:'학급 행사',title:'학급 회의 (7교시)'},
  {id:2,date:todayISO(3),type:'생일',title:'민준이 생일 🎂'},
  {id:3,date:todayISO(6),type:'체육대회',title:'교내 체육대회'},
  {id:4,date:todayISO(12),type:'현장체험학습',title:'현장체험학습 · 놀이공원'}
];
var recRequests = [];
function classRecScreen(){
  var base=new Date(); var t=new Date(base.getFullYear(), base.getMonth()+(state.recMonthOffset||0), 1);
  var y=t.getFullYear(), m=t.getMonth(), monthLabel=y+'년 '+(m+1)+'월';
  var first=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate(), todayIso=todayISO(0);
  var cells='';
  for(var i=0;i<first;i++) cells+='<div class="rc-cell rc-cell--empty"></div>';
  for(var d=1; d<=dim; d++){
    var iso=isoDate(y,m,d);
    var has=recEvents.some(function(e){return e.date===iso;});
    cells+='<button class="rc-cell'+(state.recSelDate===iso?' is-sel':'')+(iso===todayIso?' is-today':'')+'" data-action="recPickDate" data-value="'+iso+'">'+d+(has?'<span class="rc-dot"></span>':'')+'</button>';
  }
  var isLeader=(me.role==='반장'||me.role==='부반장');
  var sel=state.recSelDate||todayIso;
  var dayEvents=recEvents.filter(function(e){return e.date===sel;});
  var evList=dayEvents.length ? dayEvents.map(function(e){
    var ctrl=isLeader?'<div style="display:flex;gap:6px;margin-top:8px"><button class="del-btn" data-action="recEdit" data-value="'+e.id+'">수정</button><button class="del-btn" data-action="recDelete" data-value="'+e.id+'">삭제</button></div>':'';
    return '<div class="card" style="margin-bottom:8px"><span class="rc-type">'+escapeHtml(e.type)+'</span><div style="font-weight:700;margin-top:6px">'+escapeHtml(e.title)+'</div>'+ctrl+'</div>';
  }).join('') : '<p class="placeholder-note" style="padding:10px 0">이 날짜에 등록된 일정이 없어요.</p>';
  var reqBlock='';
  if(isLeader && recRequests.length){
    reqBlock='<section class="section"><div class="section__head"><h2 class="section__title">기록 추가 요청 '+recRequests.length+'</h2></div>'+
      recRequests.map(function(r){ return '<div class="card" style="margin-bottom:8px"><span class="rc-type">'+escapeHtml(r.type)+'</span><div style="font-weight:700;margin-top:6px">'+escapeHtml(r.title)+'</div><div class="muted" style="font-size:12px;margin-top:2px">'+r.date+' · '+escapeHtml(r.by)+' 요청</div><div style="display:flex;gap:6px;margin-top:8px"><button class="btn btn--primary" data-action="recApprove" data-value="'+r.id+'" style="flex:1;padding:8px">승인</button><button class="btn btn--outline" data-action="recRejReq" data-value="'+r.id+'" style="flex:1;padding:8px">삭제</button></div></div>'; }).join('')+'</section>';
  }
  var formBlock='';
  if(state.recForm){
    var f=state.recForm;
    var typeChips=REC_TYPES.map(function(tp){ return '<button class="subj-chip'+(f.type===tp?' is-on':'')+'" data-action="recPickType" data-value="'+tp+'">'+tp+'</button>'; }).join('');
    formBlock='<section class="section"><div class="card"><div style="font-weight:800;margin-bottom:8px">'+(isLeader?(f.editId?'일정 수정':'일정 추가'):'기록 추가 요청')+' · '+sel+'</div>'+
      '<div class="subj-wrap">'+typeChips+'</div>'+
      '<input class="field__input" id="recTitle" placeholder="일정 내용을 입력하세요" value="'+escapeAttr(f.title||'')+'" style="margin-top:10px" autocomplete="off">'+
      (state.recErr?'<div class="field-err" style="display:block">'+escapeHtml(state.recErr)+'</div>':'')+
      '<div style="display:flex;gap:8px;margin-top:10px"><button class="btn btn--primary" data-action="recSubmit" style="flex:1">'+(isLeader?'저장':'요청 보내기')+'</button><button class="btn btn--outline" data-action="recCancel" style="flex:1">취소</button></div></div></section>';
  }
  var actionBtn = state.recForm ? '' : (isLeader
    ? '<button class="btn btn--primary" data-action="recAdd">+ 이 날짜에 일정 추가</button>'
    : '<button class="btn btn--outline" data-action="recReq">기록 추가 요청하기</button>');
  return '<div class="screen">'+
    '<section class="section">'+
      '<div class="meal-nav"><button class="meal-navbtn" data-action="recNav" data-value="-1" aria-label="이전 달">'+icon('back',20)+'</button><div class="meal-month">'+monthLabel+'</div><button class="meal-navbtn" data-action="recNav" data-value="1" aria-label="다음 달">'+icon('chevron',20)+'</button></div>'+
      '<div class="rc-cal"><div class="rc-grid rc-week">'+['일','월','화','수','목','금','토'].map(function(w){return '<div class="rc-hd">'+w+'</div>';}).join('')+'</div><div class="rc-grid">'+cells+'</div></div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">'+sel+' 일정</h2></div>'+evList+
      '<div style="margin-top:8px">'+actionBtn+'</div></section>'+
    formBlock+reqBlock+
  '</div>';
}

function myWarmthScreen(){
  var bars=[18,22,20,28,26,34,30,40].map(function(v){return '<div style="flex:1;height:'+v+'px;border-radius:4px;background:var(--warm-300)"></div>';}).join('');
  var items=[{k:'답변 채택 보상',v:'+120'},{k:'고민 공감(온기) 받기',v:'+40'},{k:'미니게임 보상',v:'+20'},{k:'출석 보너스',v:'+0'}];
  var list=items.map(function(i){return '<div class="list-row" style="cursor:default"><span class="list-row__txt"><span class="list-row__title">'+i.k+'</span></span><span style="font-weight:800;color:var(--accent-game)">'+i.v+'</span></div>';}).join('');
  return '<div class="screen"><section class="section"><div class="card">'+
    '<div class="muted" style="font-size:12px">내 온기점수</div><div style="font-size:34px;font-weight:800;color:var(--warm-600)">'+fmt(me.warmth)+'</div>'+
    '<div class="faint" style="font-size:13px">이번 달 +180</div>'+
    '<div style="display:flex;gap:4px;margin-top:14px;align-items:flex-end;height:48px">'+bars+'</div></div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">이번 달 온기 내역</h2></div><div class="rows">'+list+'</div></section></div>';
}
function myRankScreen(){
  var rows=[{k:'이번 달 온기왕',v:'7위',s:'상위 5% · 우리 학교'},{k:'학교 온도전',v:'3위',s:'우리 반 기여도 높음'},{k:'답변 채택률',v:'82%',s:'따뜻한 답변러'}];
  return '<div class="screen"><section class="section"><div class="rows">'+rows.map(function(r){return '<div class="list-row" style="cursor:default"><span class="list-row__txt"><span class="list-row__title">'+r.k+'</span><span class="list-row__sub">'+r.s+'</span></span><span style="font-weight:800;font-size:18px;color:var(--warm-600)">'+r.v+'</span></div>';}).join('')+'</div></section></div>';
}
function monsterScreen(){
  var mons=[{n:'불꽃 도깨비',got:1},{n:'물방울 정령',got:1},{n:'바람 여우',got:1},{n:'숲의 요정',got:1},{n:'번개 늑대',got:0},{n:'얼음 곰',got:0},{n:'별빛 나비',got:0},{n:'그림자 룡',got:0}];
  var grid=mons.map(function(m){return '<div class="mon-cell'+(m.got?'':' is-lock')+'"><div class="mon-emoji">'+(m.got?'👾':'❓')+'</div><div class="mon-name">'+(m.got?escapeHtml(m.n):'???')+'</div></div>';}).join('');
  return '<div class="screen"><section class="section"><p class="placeholder-note">수집한 몬스터 4 / 8</p><div class="mon-grid">'+grid+'</div></section></div>';
}
function weaponScreen(){
  var w=[{n:'용사의 검',d:'공격 +12',got:1},{n:'수호자의 방패',d:'방어 +8',got:1},{n:'바람의 활',d:'명중 +10',got:1},{n:'전설의 창',d:'아직 획득 전',got:0}];
  return '<div class="screen"><section class="section"><div class="rows">'+w.map(function(i){return '<div class="list-row" style="cursor:default"><span class="list-row__ic" style="background:'+(i.got?'var(--accent-plaza)':'var(--line-strong)')+';color:#fff">'+icon('sword',18)+'</span><span class="list-row__txt"><span class="list-row__title">'+(i.got?escapeHtml(i.n):'미획득 무기')+'</span><span class="list-row__sub">'+escapeHtml(i.d)+'</span></span></div>';}).join('')+'</div></section></div>';
}
var friendsList = [
  {nick:'토닥토닥', school:'온담고등학교', warmth:820},
  {nick:'구름산책', school:'햇살중학교', warmth:640},
  {nick:'별헤는밤', school:'온담고등학교', warmth:1180}
];
var friendChats = {};
var FRIEND_REPLIES = ['응 나도 그래 ㅎㅎ','헐 진짜? 무슨 일이야?','괜찮아, 잘 될 거야 🙂','오늘 급식 맛있었지 않아?','같이 힘내자! 💪','언제든 편하게 얘기해도 돼 🌱'];
function isFriend(nick){ return friendsList.some(function(f){ return f.nick===nick; }); }
function friendsScreen(){
  if(!friendsList.length) return '<div class="screen"><section class="section"><p class="placeholder-note" style="text-align:center;padding:34px 0">아직 친구가 없어요.<br>고민광장에서 친구를 추가해보세요 🌱</p></section></div>';
  return '<div class="screen"><section class="section"><p class="placeholder-note">친구 '+friendsList.length+'명</p><div class="rows">'+
    friendsList.map(function(f){ return '<button class="list-row" data-action="openFriend" data-value="'+escapeAttr(f.nick)+'"><span class="avatar" style="width:38px;height:38px;border-radius:50%;font-size:15px;flex:none">'+escapeHtml(f.nick.slice(0,1))+'</span><span class="list-row__txt"><span class="list-row__title">'+escapeHtml(f.nick)+'</span><span class="list-row__sub">'+escapeHtml(f.school)+'</span></span>'+icon('chevron',18,2,'var(--ink-faint)')+'</button>'; }).join('')+
  '</div></section></div>';
}
function userProfileData(nick){
  var f = friendsList.filter(function(x){return x.nick===nick;})[0];
  if(f) return f;
  var w = worries.filter(function(x){return x.nick===nick;})[0];
  var hash = String(nick).split('').reduce(function(a,c){return a+c.charCodeAt(0);},0);
  return { nick:nick, school: w?w.school:me.school, warmth: 200+(hash*7)%900 };
}
function friendProfileScreen(){
  var f = userProfileData(state.selFriend);
  if(!f || !f.nick) return '<div class="screen"><section class="section"><p class="placeholder-note" style="padding:16px">친구를 찾을 수 없어요.</p></section></div>';
  var st = friendStatus(f.nick);
  var sentToday = !!(state.warmthSent && state.warmthSent[f.nick]);
  var friendBtn = st==='friend'
    ? '<button class="list-row" data-action="unfriend" data-value="'+escapeAttr(f.nick)+'"><span class="list-row__ic" style="background:#e5533d;color:#fff;font-weight:800">×</span><span class="list-row__txt"><span class="list-row__title">친구 삭제</span></span></button>'
    : st==='pending'
      ? '<button class="list-row" data-action="toggleFriend" data-value="'+escapeAttr(f.nick)+'"><span class="list-row__ic">'+userPlusSVG(true)+'</span><span class="list-row__txt"><span class="list-row__title">요청 취소</span><span class="list-row__sub">상대의 수락을 기다리는 중이에요</span></span></button>'
      : '<button class="list-row" data-action="toggleFriend" data-value="'+escapeAttr(f.nick)+'"><span class="list-row__ic">'+userPlusSVG(false)+'</span><span class="list-row__txt"><span class="list-row__title">친구 추가</span></span></button>';
  var chatRow = st==='friend'
    ? '<button class="list-row" data-action="openChat" data-value="'+escapeAttr(f.nick)+'"><span class="list-row__ic" style="background:var(--accent-plaza);color:#fff">'+icon('chat',18)+'</span><span class="list-row__txt"><span class="list-row__title">1:1 채팅</span><span class="list-row__sub">고민을 털어놓거나 편하게 대화해요</span></span>'+icon('chevron',18,2,'var(--ink-faint)')+'</button>'
    : '<div class="list-row" style="cursor:default;opacity:.5"><span class="list-row__ic">'+icon('chat',18)+'</span><span class="list-row__txt"><span class="list-row__title">1:1 채팅</span><span class="list-row__sub">친구가 되면 대화할 수 있어요</span></span></div>';
  var warmthRow = st!=='friend' ? '' : (sentToday
    ? '<div class="list-row" style="cursor:default;opacity:.5"><span class="list-row__ic" style="background:var(--warm-500);color:#fff">'+icon('thermometer',18)+'</span><span class="list-row__txt"><span class="list-row__title">오늘 온기를 보냈어요</span><span class="list-row__sub">내일 다시 보낼 수 있어요</span></span></div>'
    : '<button class="list-row" data-action="sendWarmth" data-value="'+escapeAttr(f.nick)+'"><span class="list-row__ic" style="background:var(--warm-500);color:#fff">'+icon('thermometer',18)+'</span><span class="list-row__txt"><span class="list-row__title">온기 보내기</span><span class="list-row__sub">따뜻한 마음을 전해요 (+5)</span></span></button>');
  return '<div class="screen"><section class="section"><div class="card" style="text-align:center;padding:24px 16px">'+
      '<div class="avatar" style="width:74px;height:74px;border-radius:50%;font-size:30px;margin:0 auto 12px">'+escapeHtml(f.nick.slice(0,1))+'</div>'+
      '<div style="font-size:19px;font-weight:800">'+escapeHtml(f.nick)+'</div>'+
      '<div class="muted" style="font-size:13px;margin-top:4px">'+escapeHtml(f.school)+'</div>'+
      '<div style="display:inline-flex;gap:6px;align-items:center;margin-top:12px;color:var(--warm-600);font-weight:800;font-size:15px">'+icon('thermometer',16,2.4)+' 온기점수 '+fmt(f.warmth)+'</div>'+
    '</div></section>'+
    '<section class="section"><div class="rows">'+
      chatRow+warmthRow+friendBtn+
    '</div></section></div>';
}
function friendChatScreen(){
  var nick=state.selFriend, msgs=friendChats[nick]||[];
  var list=msgs.length?msgs.map(function(m){ return '<div class="chat-msg '+(m.from==='me'?'me':'them')+'">'+escapeHtml(m.text)+'</div>'; }).join(''):'<p class="placeholder-note" style="text-align:center;padding:24px 0">'+escapeHtml(nick||'')+'님과 첫 대화를 시작해보세요 🌱</p>';
  var emojiRow = state.emojiOpen ? '<div class="emoji-row">'+EMOJIS.map(function(em){ return '<button class="emoji-item" data-action="addEmoji" data-value="'+em+'">'+em+'</button>'; }).join('')+'</div>' : '';
  var dock='<div class="chat-dock">'+emojiRow+'<div class="chat-bar">'+
    '<button class="chat-emoji" data-action="toggleEmoji" aria-label="이모티콘">🙂</button>'+
    '<input class="chat-input" id="fchatInput" value="'+escapeAttr(state.fchatDraft||'')+'" placeholder="메시지를 입력하세요" autocomplete="off">'+
    '<button class="chat-send" data-action="fchatSend" aria-label="전송">'+icon('send',18,2.2,'var(--ink)')+'</button></div></div>';
  return '<div class="screen" style="padding-bottom:86px"><section class="section"><div class="fchat-list">'+list+'</div></section></div>'+dock;
}
var blockedList = [];
function activityScreen(){
  var myW=worries.filter(function(w){return w.mine;});
  var myA=[]; worries.forEach(function(w){ w.answers.forEach(function(a){ if(a.mine) myA.push(a); }); });
  var wHtml=myW.length?myW.map(function(w){return '<div class="card" style="margin-bottom:8px"><div class="worry__meta"><span class="subj-tag">고민</span><span>'+escapeHtml(w.ago)+'</span></div>'+(w.title?'<div class="worry__title">'+escapeHtml(w.title)+'</div>':'')+'<p class="worry__body">'+escapeHtml(w.body)+'</p></div>';}).join(''):'<p class="placeholder-note">작성한 고민이 없어요.</p>';
  var aHtml=myA.length?myA.map(function(a){return '<div class="card" style="margin-bottom:8px"><div class="worry__meta"><span class="subj-tag">답변</span><span>'+escapeHtml(a.ago)+'</span></div><p class="worry__body">'+escapeHtml(a.body)+'</p></div>';}).join(''):'<p class="placeholder-note">작성한 답변이 없어요.</p>';
  return '<div class="screen"><section class="section"><div class="section__head"><h2 class="section__title">내 고민</h2></div>'+wHtml+'</section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">내 답변</h2></div>'+aHtml+'</section></div>';
}

function settingsScreen(){
  var s=state.settings||{};
  function tog(key,label,sub){ return '<div class="list-row" data-action="setToggle" data-value="'+key+'" style="cursor:pointer"><span class="list-row__txt"><span class="list-row__title">'+label+'</span>'+(sub?'<span class="list-row__sub">'+sub+'</span>':'')+'</span><span class="switch'+(s[key]?' is-on':'')+'"><span class="switch__dot"></span></span></div>'; }
  function lk(label,target){ return '<div class="list-row" data-action="open" data-value="'+target+'" style="cursor:pointer"><span class="list-row__txt"><span class="list-row__title">'+label+'</span></span>'+icon('chevron',18,2,'var(--ink-faint)')+'</div>'; }
  return '<div class="screen">'+
    '<section class="section"><div class="section__head"><h2 class="section__title">알림</h2></div><div class="rows">'+tog('push','푸시 알림','새 답변·온기·친구 알림')+tog('sound','소리 및 진동','')+'</div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">화면</h2></div><div class="rows">'+tog('dark','다크 모드','어두운 테마로 전환')+'</div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">계정</h2></div><div class="rows">'+
      lk('내 정보','myInfo')+lk('차단 목록','blocked')+lk('개인정보 처리방침','privacy')+lk('이용약관','terms')+'</div></section>'+
    '<section class="section"><div class="rows"><div class="list-row" style="cursor:default"><span class="list-row__txt"><span class="list-row__title">버전 정보</span></span><span class="muted" style="font-size:13px">v1.0.0</span></div></div></section>'+
    '<section class="section"><button class="btn btn--outline" data-action="askLogout">로그아웃</button>'+
      '<button class="btn" data-action="askWithdraw" style="margin-top:10px;background:none;color:#d9534f;font-weight:800">회원 탈퇴</button></section>'+
  '</div>';
}
function editSchoolAC(q){
  q = (q||'').trim();
  if(!q) return '';
  var items = SCHOOL_DB.filter(function(n){ return n.indexOf(q)>=0; });
  if(items.length===1 && items[0]===q) return '';
  items = items.slice(0,8);
  if(items.length===0) return '<div class="ac-item ac-empty">검색 결과가 없어요</div>';
  return items.map(function(n){ return '<button type="button" class="ac-item" data-action="pickEditSchool" data-value="'+escapeAttr(n)+'">'+escapeHtml(n)+'</button>'; }).join('');
}
function editProfileScreen(){
  var f = state.profileForm || {};
  function err(k){ var t=f.touched&&f.touched[k]; var e=!String(f[k]||'').trim(); return (t&&e)?' is-err':''; }
  function errMsg(k){ var t=f.touched&&f.touched[k]; var e=!String(f[k]||'').trim(); return (t&&e)?'<div class="field-err">* 필수 입력 항목입니다.</div>':''; }
  return '<div class="screen"><section class="section">'+
    '<div style="text-align:center;padding:8px 0 4px"><div class="avatar" style="width:74px;height:74px;border-radius:50%;font-size:30px;margin:0 auto">'+escapeHtml((f.nickname||'?').slice(0,1))+'</div></div>'+
    '<div class="field"><div class="field__label">닉네임</div>'+
      '<input class="field__input'+err('nickname')+'" data-pfield="nickname" id="ep-nickname" value="'+escapeAttr(f.nickname||'')+'" placeholder="닉네임을 입력하세요" autocomplete="off">'+errMsg('nickname')+
    '</div>'+
    '<div class="field" style="position:relative">'+
      '<div class="field__label">학교</div>'+
      '<input class="field__input'+err('school')+'" data-pfield="school" id="ep-school" value="'+escapeAttr(f.school||'')+'" placeholder="학교명을 검색하세요" autocomplete="off">'+
      '<div class="ac-list" id="editSchoolAC"></div>'+errMsg('school')+
    '</div>'+
    '<div class="field"><div class="field__label">학년 · 반</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
        '<input class="field__input'+err('grade')+'" data-pfield="grade" id="ep-grade" value="'+escapeAttr(f.grade||'')+'" placeholder="학년" inputmode="numeric">'+
        '<input class="field__input'+err('classNo')+'" data-pfield="classNo" id="ep-classNo" value="'+escapeAttr(f.classNo||'')+'" placeholder="반" inputmode="numeric">'+
      '</div>'+
      '<div style="display:flex;gap:16px">'+errMsg('grade')+errMsg('classNo')+'</div>'+
    '</div>'+
    '<button class="btn btn--primary" data-action="saveProfile" style="margin-top:14px">저장</button>'+
  '</section></div>';
}
function myInfoScreen(){
  return '<div class="screen"><section class="section"><div class="card" style="text-align:center;padding:24px 16px">'+
    '<div class="avatar" style="width:74px;height:74px;border-radius:50%;font-size:30px;margin:0 auto 12px">'+escapeHtml(me.nickname.slice(0,1))+'</div>'+
    '<div style="font-size:19px;font-weight:800">'+escapeHtml(me.nickname)+'</div>'+
    '<div class="muted" style="font-size:13px;margin-top:4px">'+escapeHtml(me.school)+' '+me.grade+'학년 '+me.classNo+'반</div></div></section>'+
    '<section class="section"><div class="rows">'+
      '<div class="list-row" style="cursor:default"><span class="list-row__txt"><span class="list-row__title">닉네임</span></span><span class="muted" style="font-size:13px">'+escapeHtml(me.nickname)+'</span></div>'+
      '<div class="list-row" style="cursor:default"><span class="list-row__txt"><span class="list-row__title">학교</span></span><span class="muted" style="font-size:13px">'+escapeHtml(me.school)+'</span></div>'+
      '<div class="list-row" style="cursor:default"><span class="list-row__txt"><span class="list-row__title">학년 · 반</span></span><span class="muted" style="font-size:13px">'+me.grade+'학년 '+me.classNo+'반</span></div>'+
      '<div class="list-row" style="cursor:default"><span class="list-row__txt"><span class="list-row__title">역할</span></span><span class="muted" style="font-size:13px">'+escapeHtml(me.role||'학생')+'</span></div>'+
      '<div class="list-row" style="cursor:default"><span class="list-row__txt"><span class="list-row__title">온기점수</span></span><span style="font-weight:800;color:var(--warm-600)">'+fmt(me.warmth)+'</span></div>'+
    '</div></section></div>';
}
function blockedScreen(){
  if(!blockedList.length) return '<div class="screen"><section class="section"><p class="placeholder-note" style="text-align:center;padding:34px 0">차단한 사용자가 없어요.</p></section></div>';
  return '<div class="screen"><section class="section"><div class="rows">'+blockedList.map(function(n){ return '<div class="list-row" style="cursor:default"><span class="list-row__txt"><span class="list-row__title">'+escapeHtml(n)+'</span></span><button class="del-btn" data-action="unblock" data-value="'+escapeAttr(n)+'">차단 해제</button></div>'; }).join('')+'</div></section></div>';
}