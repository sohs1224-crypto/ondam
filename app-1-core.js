/* ===== Icons (inline SVG, 의존성 없음) ===== */
var ICONS = {
  home:'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  chat:'M7.9 20A9 9 0 1 0 4 16.1L2 22Z',
  game:'M7 8h10a5 5 0 0 1 0 10c-1.5 0-2.3-.8-3-1.5H10c-.7.7-1.5 1.5-3 1.5A5 5 0 0 1 7 8Zm-.5 5H9m-1.25-1.25v2.5M15.5 11h.01M18 13h.01',
  book:'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5ZM4 20.5A2.5 2.5 0 0 0 6.5 23H20',
  user:'M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  heart:'M12 20s-7-4.6-9.3-9C1.3 8 2.5 4.5 6 4.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3.5 0 4.7 3.5 3.3 6.5C19 15.4 12 20 12 20Z',
  bell:'M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM10 20a2 2 0 0 0 4 0',
  plus:'M12 5v14M5 12h14',
  chevron:'m9 6 6 6-6 6',
  back:'M15 6l-6 6 6 6',
  search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.35-4.35',
  thermometer:'M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0Z',
  sword:'M14.5 4H20v5.5L9.5 20 4 20v-5.5L14.5 4ZM13 11l3 3M4 20l3.5-3.5',
  trophy:'M7 4h10v3a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 15h6M8 20h8M12 15v5',
  calendar:'M7 3v3M17 3v3M4 8h16M5 6h14v14H5zM9 12h2M15 12h.01M9 16h2',
  utensils:'M5 3v8a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4v9',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8v4l3 2',
  settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1l-.3-2.5H10.5l-.3 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L4 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 2.5h3.9l.3-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6c.06-.3.1-.66.1-1Z',
  users:'M16 21v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-1a4 4 0 0 0-3-3.9M16 4.1a4 4 0 0 1 0 7.8',
  edit:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z',
  grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  star:'m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.2l5.9-.9L12 3Z',
  check:'M5 12l4 4 10-10',
  send:'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
  flag:'M4 21V4a1 1 0 0 1 1-1h13.2a1 1 0 0 1 .9 1.45L16.5 9l2.6 4.55a1 1 0 0 1-.9 1.45H5v6',
  more:'M5 12h.01M12 12h.01M19 12h.01'
};
function icon(name, size, stroke, color){
  size = size || 22; stroke = stroke || 2; color = color || 'currentColor';
  var d = ICONS[name]; if(!d) return '';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="'+color+
    '" stroke-width="'+stroke+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>';
}
function fmt(n){ return n.toLocaleString(); }
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }
function heartSVG(active){
  var fill=active?'var(--warm-pink)':'none';
  var stroke=active?'#c76b86':'var(--ink-faint)';
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
}
function replySVG(active){
  var fill=active?'var(--warm-pink)':'none';
  var stroke=active?'#c76b86':'var(--ink-faint)';
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>';
}
function userPlusSVG(active){
  var fill=active?'var(--sky-fill)':'none';
  var stroke=active?'#3f7fa6':'var(--ink-faint)';
  return '<svg width="24" height="24" viewBox="0 0 24 24" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="4"/><path d="M2.5 21a6.5 6.5 0 0 1 13 0Z"/><path d="M19 8v6" fill="none"/><path d="M22 11h-6" fill="none"/></svg>';
}
function worryCard(w,flush){
  return '<article class="worry'+(flush?' worry--flush':'')+'" data-action="openWorry" data-value="'+w.id+'" style="cursor:pointer"><div class="worry__meta">'+(w.category?'<span class="subj-tag">'+escapeHtml(w.category)+'</span>':'')+'</div>'+
    (w.title?'<div class="worry__title">'+escapeHtml(w.title)+'</div>':'')+
    '<p class="worry__body worry__body--clamp">'+escapeHtml(w.body)+'</p>'+
    '<div class="worry__foot2">'+
      '<span class="worry__foot-left">'+escapeHtml(w.school)+' · '+escapeHtml(w.ago)+' · 조회 '+fmt(w.views||0)+'</span>'+
      '<span class="worry__foot-right"><span class="fr-item">'+heartSVG(w.liked)+'<span>'+w.warmth+'</span></span><span class="fr-item">'+replySVG(false)+'<span>'+(w.answerCount!=null?w.answerCount:w.answers.length)+'</span></span></span>'+
    '</div></article>';
}
function runSearch(){
  var q = document.getElementById('searchInput');
  state.query = q ? q.value : '';
  render();
}

/* ===== Mock data ===== */
var me = { nickname:'따뜻한고래', school:'온담고등학교', grade:1, classNo:3, warmth:1240, role:'반장' };
var todaySchool = { temp:23.4, startTemp:20, moodTop:'설렘', moodPct:42 };
var dday = [
  {label:'국어 수행평가',d:5},{label:'중간고사',d:12},{label:'영어 말하기평가',d:18},
  {label:'체육대회',d:25},{label:'과학 수행평가',d:33},{label:'축제',d:47},
  {label:'기말고사',d:61},{label:'방학식',d:88}
];
var warmthKings = [
  {name:'별헤는밤',val:3120},{name:'민트초코',val:2980},{name:'조용한숲',val:2740},
  {name:'따뜻한고래',val:2610},{name:'노을바라기',val:2480},{name:'구름산책',val:2350},
  {name:'포근한밤',val:2210},{name:'작은용기',val:2080},{name:'햇살한줌',val:1960},
  {name:'다정한바람',val:1840},{name:'느린걸음',val:1720},{name:'별빛수집가',val:1610},
  {name:'하늘색우산',val:1500},{name:'초록우체통',val:1390},{name:'토닥토닥',val:1280},
  {name:'온기전도사',val:1170},{name:'몽글몽글',val:1060},{name:'새벽감성',val:950},
  {name:'차분한오후',val:860},{name:'고요한물결',val:780}
];
var tempSchools = [
  {name:'온담고등학교',val:23.4},{name:'햇살중학교',val:22.9},{name:'바람고등학교',val:22.1},
  {name:'푸른솔중학교',val:21.7},{name:'다솜고등학교',val:21.3},{name:'한빛중학교',val:20.9},
  {name:'별빛고등학교',val:20.6},{name:'가온중학교',val:20.4},{name:'미리내고등학교',val:20.2},
  {name:'새봄중학교',val:20.1}
];

var ONE_LINERS = [
  '오늘도 서로에게 한 뼘의 온기를 나눠요 🌱','작은 응원 한마디가 누군가의 하루를 바꿔요',
  '완벽하지 않아도 괜찮아요, 오늘의 나로 충분해요','힘든 마음은 혼자 두지 말고 살짝 꺼내 놓아요',
  '누군가의 고민에 귀 기울이는 당신은 이미 따뜻한 사람이에요','오늘 하루도 무사히 지나갈 거예요',
  '작은 친절이 큰 위로가 됩니다','지금 이 순간의 당신을 응원해요',
  '잘하고 있어요, 스스로를 조금 더 믿어봐요','따뜻한 말 한마디, 오늘 누군가에게 건네볼까요?',
  '어제보다 한 걸음, 그걸로 충분해요','마음이 무거운 날엔 잠시 쉬어가도 돼요',
  '당신의 이야기를 들어줄 사람이 여기 있어요','웃는 연습도 마음을 데워줘요',
  '오늘의 작은 성취를 스스로 칭찬해 주세요','서두르지 않아도 괜찮아요, 나의 속도로 가요',
  '고민을 나누면 무게가 절반이 돼요','오늘 누군가에게 먼저 인사를 건네봐요',
  '당신은 생각보다 훨씬 단단한 사람이에요','실수해도 괜찮아요, 그렇게 배우는 거예요',
  '지친 마음엔 깊은 숨 한 번이 약이 돼요','곁에 있어 주는 것만으로도 큰 힘이 돼요',
  '오늘도 나를 아껴주는 하루 되기','작은 용기가 큰 변화를 만들어요',
  '누군가의 하루에 따뜻함 한 스푼 더하기','비교하지 말고, 어제의 나와만 겨뤄요',
  '마음의 온도를 조금만 올려볼까요?','당신의 다정함이 이 공간을 데워요',
  '오늘 하루, 스스로에게 수고했다고 말해줘요','넘어져도 다시 일어나면 그게 성장이에요',
  '좋은 말은 아끼지 말고 나눠요','조금 느려도 방향만 맞으면 돼요',
  '오늘 웃을 일 하나쯤은 꼭 생겨요','마음이 시릴 땐 서로의 온기로 데워요',
  '당신의 존재만으로 충분히 의미 있어요','힘내라는 말 대신, 곁에 있어 줄게요',
  '오늘의 걱정은 오늘만, 내일 걱정은 내일에게','작은 친절이 돌고 돌아 다시 나에게 와요',
  '스스로에게 조금 더 너그러워지기','지금 잘 버티고 있는 당신, 정말 대단해요',
  '누군가의 말에 고개 끄덕여 주는 것도 위로예요','오늘도 좋은 사람들과 온기를 나눠요',
  '마음이 흐린 날에도 해는 뜨고 있어요','완벽보다 꾸준함이 더 멀리 가요',
  '당신의 고민, 결코 사소하지 않아요','따뜻한 하루의 시작은 다정한 한마디부터',
  '오늘 나에게 필요한 건 약간의 쉼일지도 몰라요','서로 기대면 조금 덜 힘들어요',
  '잘 모르겠는 날엔, 그냥 오늘을 살아내면 돼요','당신이 나눈 온기가 어딘가에서 꽃피고 있어요',
  '오늘도 나를 응원하는 사람이 여기 있어요','조급함은 잠시 내려놓아도 괜찮아요',
  '마음의 문을 살짝만 열어도 온기가 들어와요','누군가에게 오늘 하루가 어땠는지 물어봐요',
  '작은 관심이 큰 위로가 됩니다','지금의 노력은 반드시 어딘가에 쌓이고 있어요',
  '스스로를 다그치기보다 토닥여 줘요','오늘 하루도 당신 편이에요',
  '따뜻함은 나눌수록 커져요','한 사람의 다정함이 교실을 바꿔요',
  '걱정이 많은 밤, 당신은 혼자가 아니에요','오늘의 나에게 고생했다고 말해줄까요',
  '마음을 표현하는 것도 용기예요','조금 서툴러도 진심은 전해져요',
  '당신의 하루에 작은 햇살이 들기를','힘든 이야기를 꺼낸 당신, 이미 절반은 이겨낸 거예요',
  '오늘 누군가의 이야기에 온기를 더해봐요','나를 돌보는 것도 중요한 일이에요',
  '서로의 온도를 높여주는 하루','지금 이 자리까지 온 것만으로 충분히 잘했어요',
  '작은 배려가 오늘을 특별하게 만들어요','마음이 지칠 땐 잠깐 멈춰도 돼요',
  '당신의 다정한 답글이 누군가에게 큰 힘이 돼요','오늘도 따뜻한 말로 하루를 채워봐요',
  '완벽하지 않은 하루도 소중해요','누군가를 응원하면 내 마음도 따뜻해져요',
  '지금 느끼는 감정, 모두 괜찮은 거예요','오늘 하루, 나에게 친절하기',
  '조금씩이라도 앞으로 가고 있어요','서로의 이야기에 귀 기울이는 이곳이 참 따뜻해요',
  '힘든 날엔 작은 위로 하나면 충분해요','당신은 누군가에게 큰 힘이 되고 있어요',
  '오늘도 온기를 나눠줘서 고마워요','마음의 짐은 함께 들면 가벼워져요',
  '잠시 쉬는 것도 앞으로 나아가는 방법이에요','오늘 하루의 끝엔 스스로를 안아줘요',
  '작은 다정함이 세상을 바꿔요','지금 당신의 속도가 딱 맞아요',
  '누군가의 하루를 밝히는 한마디, 오늘 남겨봐요','고민을 말하는 순간, 이미 용감한 거예요',
  '서로 응원하며 함께 자라나요','오늘도 나를 믿고 한 걸음 더',
  '따뜻한 마음은 반드시 전해져요','힘든 시간도 결국 지나가요',
  '당신이 있어 이 공간이 더 따뜻해요','오늘 하루도 잘 버텨줘서 고마워요',
  '작은 온기 하나가 큰 변화의 시작이에요','스스로에게 괜찮다고 말해줘요',
  '서로의 온기로 오늘을 데워봐요','내일의 당신은 오늘보다 조금 더 단단해질 거예요'
];
function dailyOneLiner(){
  var d = new Date();
  var dayNum = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  var idx = ((dayNum % ONE_LINERS.length) + ONE_LINERS.length) % ONE_LINERS.length;
  return ONE_LINERS[idx];
}
var worrySorts = ['최신순','인기순','학교별'];
var WORRY_CATS = ['학교생활','공부·진로','친구관계','가족','연애','생활·일상','나 자신','기타'];
var worries = [];
var games = [
  {key:'temp',title:'학교 온도전',sub:'주간 가장 따뜻한 학교',accent:'var(--accent-game)',icon:'thermometer',live:true},
  {key:'monster',title:'몬스터 토벌',sub:'중간·기말고사 몬스터',accent:'var(--warm-500)',icon:'sword',live:false},
  {key:'dex',title:'몬스터 도감',sub:'내가 잡은 몬스터',accent:'var(--accent-my)',icon:'grid',live:false},
  {key:'pvp',title:'PvP 대결',sub:'친구와 몬스터 대결',accent:'var(--accent-plaza)',icon:'trophy',live:false}
];
var schoolLife = [
  {title:'오늘 급식',sub:'흑미밥 · 미역국 · 제육볶음 · 배추김치',icon:'utensils',accent:'var(--accent-school)'},
  {title:'시험범위',sub:'중간고사 · 과목별 정리',icon:'book',accent:'var(--accent-home)'},
  {title:'수행평가 일정',sub:'이번 주 2건 예정',icon:'calendar',accent:'var(--accent-plaza)'},
  {title:'과제 체크리스트',sub:'개인 과제 관리',icon:'check',accent:'var(--warm-500)'},
  {title:'시간표',sub:'오늘 1교시 국어 · 6교시',icon:'clock',accent:'var(--accent-game)'},
  {title:'학생 공동 기록',sub:'반별 기록 · 공유 & 수정',icon:'edit',accent:'var(--accent-my)'}
];
var myMenu = [
  {title:'내 온기점수',sub:'1,240 · 이번 달 +180',icon:'heart',accent:'var(--warm-500)'},
  {title:'내 순위',sub:'온기왕 7위 · 온도전 3위',icon:'trophy',accent:'var(--accent-my)'},
  {title:'내 몬스터 도감',sub:'수집한 몬스터 확인',icon:'grid',accent:'var(--accent-game)'},
  {title:'획득 무기',sub:'몬스터 처치 보상',icon:'sword',accent:'var(--accent-plaza)'},
  {title:'친구 목록',sub:'친구 12명',icon:'users',accent:'var(--accent-home)'},
  {title:'활동 기록',sub:'내 고민 · 답변 내역',icon:'clock',accent:'var(--accent-school)'},
  {title:'마음 상담 안내',sub:'힘들 때 도움 받는 법',icon:'heart',accent:'#e77a94'},
  {title:'설정 / 로그아웃',sub:'',icon:'settings',accent:'var(--ink-soft)'}
];

var TABS = [
  {key:'home',label:'홈',icon:'home',accent:'var(--accent-home)',title:'온담',warmthOnBar:true},
  {key:'plaza',label:'고민광장',icon:'chat',accent:'var(--accent-plaza)',title:'고민광장'},
  {key:'game',label:'미니게임',icon:'game',accent:'var(--accent-game)',title:'미니게임'},
  {key:'school',label:'학교생활',icon:'book',accent:'var(--accent-school)',title:'학교생활'},
  {key:'my',label:'마이페이지',icon:'user',accent:'var(--accent-my)',title:'마이페이지'}
];

/* ===== State ===== */
var state = { stage:'splash', tab:'home', sort:'최신순', sub:null, query:'', school:null, worryId:null, answerSort:'최신순', authView:'login', loginForm:{ school:'', grade:'', classNo:'', id:'', pw:'', touched:{} }, signupForm:{ school:'', grade:'', classNo:'', id:'', pw:'', email:'', touched:{}, idChecked:false, idAvailable:null }, findForm:{ fpId:'', findEmail:'', fpMsg:'', findIdMsg:'', touched:{} }, draftWorry:'', draftTitle:'', draftAnswer:'', modWorry:null, modAnswer:null, pendingDelete:null, splashFade:false, notifUnread:6, moodPhase:'choose', selectedMood:null, emojiOpen:false, bounceMood:false, mealMonthOffset:0, examSel:0, examEdit:null, examDraft:'', perfSort:'최신순', perfSubj:null, perfDraft:{subject:null,title:'',due:'',body:'',photo:null}, perfErr:null, recMonthOffset:0, recSelDate:null, recForm:null, recErr:null, friendSet:{}, selFriend:null, fchatDraft:'', settings:{push:true,sound:true,dark:false}, notifiedPerfIds:{}, worryCat:null, draftCategory:null, worryCatErr:null, moreMenuOpen:false, hiddenWorryIds:{} };
Object.defineProperty(state, 'form', {
  configurable:true,
  get:function(){
    if(this.authView==='signup') return this.signupForm;
    if(this.authView==='findpw' || this.authView==='findid') return this.findForm;
    return this.loginForm;
  },
  set:function(v){
    if(this.authView==='signup') this.signupForm=v;
    else if(this.authView==='findpw' || this.authView==='findid') this.findForm=v;
    else this.loginForm=v;
  }
});

/* ===== Screen renderers (HTML string 반환) ===== */
function homeScreen(){
  var fill = Math.min(100, ((todaySchool.temp-20)/10)*100 + 40);
  var ddayTiles = dday.slice(0,3).map(function(it){
    return '<div class="tile" style="min-height:84px;align-items:center;text-align:center;justify-content:center;gap:4px">'+
      '<div style="font-size:22px;font-weight:800;color:var(--warm-600)">D-'+it.d+'</div>'+
      '<div class="tile__sub">'+it.label+'</div></div>';
  }).join('');
  var kings = warmthKings.slice(0,3).map(function(p,i){
    return '<div class="rank-row"><span class="rank-num'+(i===0?' is-top':'')+'">'+(i+1)+'</span>'+
      '<span class="rank-name">'+p.name+'</span>'+
      '<span class="rank-val">'+icon('thermometer',13,2.4)+' '+fmt(p.val)+'</span></div>';
  }).join('');
  var schools = tempSchools.slice(0,3).map(function(s,i){
    return '<div class="rank-row"><span class="rank-num'+(i===0?' is-top':'')+'">'+(i+1)+'</span>'+
      '<span class="rank-name">'+s.name+'</span><span class="rank-val">'+s.val+'°C</span></div>';
  }).join('');
  var moodSlot;
  if(state.moodPhase==='done'){
    var HARD_MOODS = ['불안','슬픔'];
    var counselLink = HARD_MOODS.indexOf(state.selectedMood)>=0
      ? '<button class="mood-stat-link" data-action="open" data-value="counsel" style="display:block;margin-top:6px;font-size:13px">힘들 때 도움받는 법 보기 →</button>'
      : '';
    moodSlot = '<button class="mood-stat-link" data-action="gotoMoodStats">오늘 우리학교 전체 기분 통계 보러가기</button>'+counselLink;
  } else if(state.moodPhase==='phrase' || state.moodPhase==='phraseOut'){
    moodSlot = '<div class="mood-phrase'+(state.moodPhase==='phraseOut'?' is-out':'')+'">'+escapeHtml(MOOD_PHRASES[state.selectedMood]||'')+'</div>';
  } else {
    moodSlot = '<div class="mood-pick"><div class="mood-q">오늘 기분은 어때요?</div><div class="mood-btns">'+
      MOODS.map(function(m){ return '<button class="mood-btn" data-action="pickMood" data-value="'+m+'">'+m+'</button>'; }).join('')+'</div></div>';
  }
  return '<div class="screen">'+
    '<section class="section"><div class="temp-hero">'+
      '<div class="temp-hero__label">오늘의 학교 온도 · '+escapeHtml(me.school)+'</div>'+
      '<div class="temp-hero__value">'+todaySchool.temp+'<span>°C</span></div>'+
      '<div class="temp-hero__meta">시작 '+todaySchool.startTemp+'°C · 오늘의 기분 「'+todaySchool.moodTop+'」 '+todaySchool.moodPct+'%</div>'+
      moodSlot+
    '</div><p class="placeholder-note">🌱 오늘의 한마디 — '+dailyOneLiner()+'</p></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">시험 D-Day</h2><button class="section__more" data-action="open" data-value="dday">전체 보기 →</button></div>'+
      '<div class="tiles" style="grid-template-columns:1fr 1fr 1fr">'+ddayTiles+'</div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">이번 달 우리학교 온기왕 TOP3</h2><button class="section__more" data-action="open" data-value="warmthTop">TOP20 →</button></div>'+
      '<div class="card">'+kings+'</div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">학교 온도전 순위 TOP3</h2><button class="section__more" data-action="open" data-value="tempTop">TOP10 →</button></div>'+
      '<div class="card">'+schools+'</div></section>'+
    '<section class="section"><div class="ad">광고 배너 영역 (협찬) · AD</div></section>'+
  '</div>';
}

var SCHOOLS = tempSchools.map(function(s){ return s.name; });
function plazaList(){
  var arr = worries.slice().filter(function(w){ return !state.hiddenWorryIds[w.id]; });
  if(state.worryCat){ arr = arr.filter(function(w){ return w.category===state.worryCat; }); }
  if(state.sort==='학교별'){
    if(state.school && state.school!=='전체 학교'){ arr = arr.filter(function(w){ return w.school===state.school; }); }
    arr.sort(function(a,b){ return b.createdAt - a.createdAt; });
  } else if(state.sort==='인기순'){
    arr.sort(function(a,b){ return (b.warmth - a.warmth) || (b.createdAt - a.createdAt); });
  } else {
    arr.sort(function(a,b){ return b.createdAt - a.createdAt; });
  }
  return arr;
}
function plazaScreen(){
  var segs = worrySorts.map(function(s){
    return '<button class="seg'+(state.sort===s?' is-active':'')+'" data-action="sort" data-value="'+s+'">'+s+'</button>';
  }).join('');
  var schoolBar = '';
  if(state.sort==='학교별'){
    var label = (!state.school || state.school==='전체 학교') ? '전체 학교' : state.school;
    schoolBar = '<div style="padding:0 16px 8px"><button class="chip" data-action="open" data-value="schoolPick">'+icon('book',13)+' '+escapeHtml(label)+' · 변경</button></div>';
  }
  var catBar = '<div class="subj-wrap subj-wrap--scroll" style="margin:0 0 8px;padding:0 16px">'+WORRY_CATS.map(function(c){
    return '<button class="subj-chip'+(state.worryCat===c?' is-on':'')+'" data-action="worryCatFilter" data-value="'+c+'">'+c+'</button>';
  }).join('')+'</div>';
  var list = plazaList();
  var listHtml;
  if(state.plazaLoading){ listHtml = '<p class="placeholder-note" style="padding:24px 16px;text-align:center">불러오는 중…</p>'; }
  else if(state.plazaError){ listHtml = '<p class="placeholder-note" style="padding:24px 16px;text-align:center;color:#d9534f">고민을 불러오지 못했어요.<br>'+escapeHtml(state.plazaError)+'</p>'; }
  else { listHtml = list.length ? list.map(function(w){ return worryCard(w,true); }).join('') : '<p class="placeholder-note" style="padding:24px 16px;text-align:center">아직 이 학교의 고민이 없어요.</p>'; }
  return '<div class="screen screen--flush">'+
    '<div style="display:flex;align-items:center;padding-bottom:8px">'+
      '<div class="segmented" style="flex:1;padding-bottom:0">'+segs+'</div>'+
      '<button class="iconbtn" data-action="open" data-value="search" aria-label="고민 검색" style="margin-right:10px;flex:none">'+icon('search',20)+'</button>'+
    '</div>'+
    schoolBar+catBar+
    '<div style="padding:8px 0 0">'+listHtml+'</div>'+
    '<button class="fab" data-action="open" data-value="write" aria-label="고민 작성">'+icon('plus',26,2.4)+'</button></div>';
}

function minigameScreen(){
  var tiles = games.map(function(g){
    var badge = g.live
      ? '<span class="chip" style="margin-top:8px;background:#eaf3d6;color:var(--accent-game)">진행 중</span>'
      : '<span class="chip" style="margin-top:8px">추후 추가 예정</span>';
    return '<button class="tile">'+
      '<div class="tile__icon" style="background:'+g.accent+';color:#fff">'+icon(g.icon,22)+'</div>'+
      '<div><div class="tile__title">'+g.title+'</div><div class="tile__sub">'+g.sub+'</div>'+badge+'</div></button>';
  }).join('');
  return '<div class="screen"><section class="section">'+
    '<div class="temp-hero" style="background:#d2ddb5;box-shadow:0 8px 24px rgba(160,178,120,.32)">'+
      '<div class="temp-hero__label">학교 vs 학교 · 반 vs 반</div>'+
      '<div style="font-size:22px;font-weight:800;margin-top:6px;color:#a0a68c">함께 겨루는 미니게임</div>'+
      '<div class="temp-hero__meta">온기점수가 높을수록 더 강해져요. 몬스터를 처치하고 학교를 데워보세요.</div></div></section>'+
    '<section class="section"><div class="tiles">'+tiles+'</div>'+
    '<p class="placeholder-note">※ 몬스터 처치 보상은 무기만 지급됩니다. 타자 입력으로 공격해요.</p></section></div>';
}

function schoolScreen(){
  var rows = schoolLife.map(function(it){
    var ROUTE={'오늘 급식':'meal','시험범위':'examScope','수행평가 일정':'perf','과제 체크리스트':'homework','시간표':'timetable','학생 공동 기록':'classRec'};
    var act = ROUTE[it.title] ? ' data-action="open" data-value="'+ROUTE[it.title]+'"' : '';
    return '<button class="list-row"'+act+'><span class="list-row__ic" style="background:'+it.accent+';color:#fff">'+icon(it.icon,18)+'</span>'+
      '<span class="list-row__txt"><span class="list-row__title">'+it.title+'</span></span>'+
      icon('chevron',18,2,'var(--ink-faint)')+'</button>';
  }).join('');
  var moodBars = [42,28,16,9,5].map(function(v,i){
    return '<div style="flex:1;height:'+(v*1.6)+'px;border-radius:8px;background:var(--grad-warm);opacity:'+(1-i*0.16)+'"></div>';
  }).join('');
  var moodLabels = ['설렘','평온','지침','불안','슬픔'].map(function(t){
    return '<span style="flex:1;text-align:center">'+t+'</span>';
  }).join('');
  var rateBtns = ['맛있어요','보통이에요','아쉬워요'].map(function(t){
    return '<span class="seg" style="font-size:12px">'+t+'</span>';
  }).join('');
  return '<div class="screen">'+
    '<section class="section"><div class="temp-hero card--tap" data-action="open" data-value="meal" style="cursor:pointer">'+
      '<div class="meal-hero-label">'+escapeHtml(me.school)+'</div>'+
      '<div class="meal-hero-title">오늘의 급식</div>'+
      '<div class="meal-hero-menu">흑미밥 · 미역국 · 제육볶음 · 배추김치 · 요구르트</div>'+
    '</div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">학교생활</h2></div><div class="rows">'+rows+'</div></section>'+
    '<section class="section"><div class="section__head"><h2 class="section__title">학교 전체 기분 통계</h2></div>'+
      '<div class="card'+(state.bounceMood?' mood-stat-card':'')+'" id="moodStatCard"><div class="muted" style="font-size:13px">오늘의 기분 분포</div>'+
      '<div style="display:flex;gap:6px;margin-top:12px;align-items:flex-end;height:72px">'+moodBars+'</div>'+
      '<div style="display:flex;gap:6px;margin-top:6px;font-size:11px;color:var(--ink-faint)">'+moodLabels+'</div></div></section></div>';
}

function mypageScreen(){
  var bars = [18,22,20,28,26,34,30,40].map(function(v){
    return '<div style="flex:1;height:'+v+'px;border-radius:4px;background:var(--warm-300)"></div>';
  }).join('');
  var rows = myMenu.map(function(it){
    var MYROUTE={'내 온기점수':'myWarmth','내 순위':'myRank','내 몬스터 도감':'monster','획득 무기':'weapon','친구 목록':'friends','활동 기록':'activity','마음 상담 안내':'counsel'};
    var myact = it.title==='설정 / 로그아웃' ? ' data-action="open" data-value="settings"' : (MYROUTE[it.title]?' data-action="open" data-value="'+MYROUTE[it.title]+'"':'');
    return '<button class="list-row"'+myact+'><span class="list-row__ic" style="background:'+it.accent+';color:#fff">'+icon(it.icon,18)+'</span>'+
      '<span class="list-row__txt"><span class="list-row__title">'+it.title+'</span></span>'+
      icon('chevron',18,2,'var(--ink-faint)')+'</button>';
  }).join('');
  return '<div class="screen">'+
    '<section class="section"><div class="profile" data-action="open" data-value="editProfile" style="cursor:pointer"><div class="avatar">'+me.nickname.slice(0,1)+'</div>'+
      '<div style="flex:1"><div style="font-weight:800;font-size:17px">'+me.nickname+'</div>'+
      '<div class="muted" style="font-size:13px">'+me.school+' · '+me.grade+'학년 '+me.classNo+'반</div>'+
      '<span class="warmth" style="margin-top:8px">'+icon('thermometer',14,2.4)+' 온기 '+fmt(me.warmth)+'</span></div>'+
      icon('chevron',18,2,'var(--ink-faint)')+'</div></section>'+
    '<section class="section"><div class="card">'+
      '<div style="display:flex;justify-content:space-between;align-items:center">'+
        '<div><div class="muted" style="font-size:12px">내 온기점수</div>'+
        '<div style="font-size:26px;font-weight:800;color:var(--warm-600)">'+fmt(me.warmth)+'</div></div>'+
        '<div style="text-align:right"><div class="faint" style="font-size:12px">이번 달</div>'+
        '<div style="font-weight:800;color:var(--accent-game)">+180</div></div></div>'+
      '<div style="display:flex;gap:4px;margin-top:14px;align-items:flex-end;height:48px">'+bars+'</div></div></section>'+
    '<section class="section"><div class="rows">'+rows+'</div></section></div>';
}

var SCREENS = { home:homeScreen, plaza:plazaScreen, game:minigameScreen, school:schoolScreen, my:mypageScreen };

/* ===== Detail(sub) screens ===== */
function detailTop(title){
  return '<header class="topbar"><button class="iconbtn" data-action="back" aria-label="뒤로">'+icon('back',22)+'</button>'+
    '<div class="topbar__title">'+title+'</div></header>';
}
function ddayScreen(){
  var rows = dday.map(function(it){
    return '<div class="list-row"><span class="list-row__ic" style="background:var(--accent-plaza);color:#fff">'+icon('calendar',18)+'</span>'+
      '<span class="list-row__txt"><span class="list-row__title">'+it.label+'</span></span>'+
      '<span style="font-weight:800;font-size:15px;color:var(--warm-600)">D-'+it.d+'</span></div>';
  }).join('');
  return '<div class="screen"><section class="section"><div class="rows">'+rows+'</div>'+
    '<p class="placeholder-note">가까운 일정 순으로 정렬됩니다.</p></section></div>';
}
function rankList(items, valFn){
  return items.map(function(it,i){
    return '<div class="rank-row"><span class="rank-num'+(i<3?' is-top':'')+'">'+(i+1)+'</span>'+
      '<span class="rank-name">'+it.name+'</span><span class="rank-val">'+valFn(it)+'</span></div>';
  }).join('');
}
function warmthTopScreen(){
  return '<div class="screen"><section class="section"><div class="card">'+
    rankList(warmthKings, function(p){ return icon('thermometer',13,2.4)+' '+fmt(p.val); })+'</div></section></div>';
}
function tempTopScreen(){
  return '<div class="screen"><section class="section"><div class="card">'+
    rankList(tempSchools, function(s){ return s.val+'°C'; })+'</div></section></div>';
}
/* ===== AI 욕설 필터 (mock) ===== */
var BAD_WORDS = ['시발','씨발','ㅅㅂ','시바','병신','ㅂㅅ','개새끼','새끼','개소리','존나','ㅈㄴ','지랄','닥쳐','꺼져','미친','미쳤','죽어','죽을래','바보','멍청이','등신','한심','재수없','짜증나'];
var SOFT_MAP = {'존나':'정말','ㅈㄴ':'정말','미친':'너무','미쳤':'너무했','짜증나':'속상해','재수없':'속상해'};
function containsBad(t){ t=String(t||''); return BAD_WORDS.some(function(w){ return t.indexOf(w)>=0; }); }
function cleanText(t){
  var s=String(t||'');
  BAD_WORDS.forEach(function(w){ var rep=(SOFT_MAP[w]!==undefined?SOFT_MAP[w]:''); s=s.split(w).join(rep); });
  s=s.replace(/\s{2,}/g,' ').trim();
  return s;
}
function softenSuggestions(t){
  var c=cleanText(t);
  if(!c) c='마음이 조금 힘든 것 같아요.';
  var v1=c;
  var v2='조금 속상한 일이 있었나 봐요. '+c;
  var v3=c.replace(/[.!?…\s]+$/,'')+' … 이런 마음이 드네요.';
  return [v1,v2,v3];
}
function modPanel(kind){
  var sugg = kind==='worry'?state.modWorry:state.modAnswer;
  if(!sugg) return '';
  var act = kind==='worry'?'applyWorrySuggest':'applyAnswerSuggest';
  var btns = sugg.map(function(s,i){ return '<button class="mod-sugg" data-action="'+act+'" data-value="'+i+'">'+escapeHtml(s)+'</button>'; }).join('');
  return '<div class="mod-box"><div class="mod-title">⚠️ 부적절한 표현이 감지됐어요</div>'+
    '<div class="mod-desc">AI가 순화한 문장이에요. 하나를 선택하거나 직접 수정한 뒤 다시 등록해 주세요.</div>'+
    '<div class="mod-list">'+btns+'</div></div>';
}
/* ===== 비밀번호 정책 ===== */
function pwValid(pw){ pw=String(pw||''); return pw.length>=8 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw); }
function authInvalidSignup(){
  var f=state.form;
  var miss = reqFields().some(function(k){ return !String(f[k]||'').trim(); });
  return miss || !(f.idChecked && f.idAvailable) || !pwValid(f.pw) || !emailValid(f.email);
}
function updatePwHint(){
  var el=document.getElementById('pwHint'); if(!el) return;
  var pw=state.form.pw||'';
  el.style.color = (pw && !pwValid(pw)) ? '#d9534f' : 'var(--ink-faint)';
}
function updateEmailHint(){
  var el=document.getElementById('emailHint'); if(!el) return;
  var em=state.form.email||'';
  el.style.color = (em && !emailValid(em)) ? '#d9534f' : 'var(--ink-faint)';
}
function writeScreen(){
  var dc = state.draftCategory;
  var catChips = '<div class="subj-wrap" style="margin-top:12px">'+WORRY_CATS.map(function(c){
    return '<button class="subj-chip'+(dc===c?' is-on':'')+'" data-action="pickWorryCat" data-value="'+c+'">'+c+'</button>';
  }).join('')+'</div>';
  return '<div class="screen"><section class="section">'+
    '<div class="card" style="background:var(--surface-alt)"><div class="muted" style="font-size:13px">닉네임은 익명으로 표시돼요. 편하게 적어보세요 🌱</div></div>'+
    '<input class="field__input" id="worryTitleInput" value="'+escapeAttr(state.draftTitle||'')+'" placeholder="제목을 입력하세요." style="margin-top:12px" autocomplete="off">'+
    '<textarea id="worryInput" class="textarea" placeholder="어떤 고민이든 편하게 적어보세요. 따뜻한 답변이 기다리고 있어요.">'+escapeHtml(state.draftWorry||'')+'</textarea>'+
    '<div class="field__label" style="margin-top:14px">카테고리 · 1개 필수 선택</div>'+catChips+
    (state.worryCatErr?'<div class="field-err" style="display:block">'+escapeHtml(state.worryCatErr)+'</div>':'')+
    '<button class="btn btn--primary" data-action="submitWorry" style="margin-top:12px">고민 등록</button>'+
    modPanel('worry')+
    '</section></div>';
}
function searchScreen(){
  var q = (state.query||'').trim();
  var results = q ? worries.filter(function(w){ return !state.hiddenWorryIds[w.id] && (w.body.indexOf(q)>=0 || w.nick.indexOf(q)>=0 || w.school.indexOf(q)>=0); }) : [];
  var body;
  if(!q){ body = '<p class="placeholder-note" style="padding:0 16px">검색어를 입력하면 고민을 찾아드려요.</p>'; }
  else if(results.length===0){ body = '<p class="placeholder-note" style="padding:0 16px">‘'+escapeHtml(q)+'’에 대한 검색 결과가 없어요.</p>'; }
  else { body = '<p class="placeholder-note" style="padding:0 16px 4px">검색 결과 '+results.length+'건</p><div style="padding:0 16px">'+results.map(worryCard).join('')+'</div>'; }
  return '<div class="screen screen--flush">'+
    '<div style="padding:16px 16px 0">'+
      '<input id="searchInput" class="field__input" placeholder="고민 내용을 검색해보세요" value="'+escapeAttr(q)+'" onkeydown="if(event.key===\'Enter\')runSearch()">'+
      '<button class="btn btn--primary" onclick="runSearch()" style="margin-top:12px">검색</button></div>'+
    '<div style="margin-top:14px">'+body+'</div></div>';
}
var friendRequests = [];
function friendStatus(nick){
  if(isFriend(nick)) return 'friend';
  if(friendRequests.some(function(r){return r.nick===nick;})) return 'pending';
  return 'none';
}
var notifs = [
  {icon:'chat',accent:'var(--accent-plaza)',title:'내 고민에 새 답변이 3개 달렸어요',time:'방금 전'},
  {icon:'heart',accent:'var(--warm-500)',title:'내 답변이 좋은 평가를 받아 온기 +12',time:'12분 전'},
  {icon:'heart',accent:'var(--accent-my)',title:'누군가 내 고민에 공감했어요',time:'1시간 전'},
  {icon:'thermometer',accent:'var(--accent-game)',title:'우리 학교가 온도전 3위에 올랐어요',time:'3시간 전'},
  {icon:'trophy',accent:'var(--accent-my)',title:'이번 달 온기왕 7위를 기록 중이에요',time:'오늘'},
  {icon:'bell',accent:'var(--accent-home)',title:'이번 주 가장 따뜻한 학교 발표가 곧 시작돼요',time:'어제'}
];
function notifScreen(){
  var rows = notifs.map(function(n){
    var actions = n.kind==='friendReq' ? '<div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn--primary" data-action="acceptFriendReq" data-value="'+escapeAttr(n.nick)+'" style="flex:1;padding:8px">수락</button><button class="btn btn--outline" data-action="declineFriendReq" data-value="'+escapeAttr(n.nick)+'" style="flex:1;padding:8px">거절</button></div>' : '';
    return '<div class="list-row" style="cursor:default;flex-direction:column;align-items:stretch"><span class="list-row__txt"><span class="list-row__title">'+escapeHtml(n.title)+'</span><span class="list-row__sub">'+n.time+'</span></span>'+actions+'</div>';
  }).join('');
  return '<div class="screen"><section class="section"><div class="rows">'+rows+'</div></section></div>';
}
function schoolRows(query){
  var q = (query||'').trim();
  var items = SCHOOLS.filter(function(n){ return !q || n.indexOf(q)>=0; });
  if(items.length===0) return '<p class="placeholder-note" style="padding:12px 16px">검색 결과가 없어요.</p>';
  return items.map(function(n){
    var sel = (state.school===n);
    return '<button class="list-row" data-action="pickSchool" data-value="'+escapeAttr(n)+'">'+
      '<span class="list-row__txt"><span class="list-row__title">'+escapeHtml(n)+'</span></span>'+
      (sel?icon('check',18,2,'var(--warm-600)'):'')+'</button>';
  }).join('');
}
function schoolPickScreen(){
  var mine = '<button class="list-row" data-action="pickSchool" data-value="'+escapeAttr(me.school)+'">'+
    '<span class="list-row__txt"><span class="list-row__title">⭐ 우리 학교</span><span class="list-row__sub">'+escapeHtml(me.school)+'</span></span>'+
    (state.school===me.school?icon('check',18,2,'var(--warm-600)'):'')+'</button>';
  var all = '<button class="list-row" data-action="pickSchool" data-value="전체 학교">'+
    '<span class="list-row__txt"><span class="list-row__title">전체 학교</span><span class="list-row__sub">모든 학교의 고민 보기</span></span>'+
    ((state.school==='전체 학교' || (!state.school && state.sort==='학교별'))?icon('check',18,2,'var(--warm-600)'):'')+'</button>';
  return '<div class="screen"><section class="section"><div class="rows">'+mine+all+'</div>'+
    '<div style="margin-top:12px"><input id="schoolSearchInput" class="field__input" placeholder="학교 이름을 검색하세요" autocomplete="off"></div>'+
    '<div class="rows" id="schoolList" style="margin-top:12px">'+schoolRows('')+'</div>'+
    '</section></div>';
}
function thumbIcon(active){
  var fill = active ? 'var(--like-fill)' : 'none';
  var stroke = active ? '#a6842a' : 'var(--ink-faint)';
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
}
function nickSpan(nick, mine){
  if(mine) return '<span class="worry__nick">'+escapeHtml(nick)+'</span>';
  return '<span class="worry__nick worry__nick--link" data-action="openFriend" data-value="'+escapeAttr(nick)+'">'+escapeHtml(nick)+'</span>';
}
function worryDetailScreen(){
  var w = worries.filter(function(x){ return String(x.id)===String(state.worryId); })[0];
  if(!w) return '<div class="screen"><p class="placeholder-note" style="padding:16px">고민을 찾을 수 없어요.</p></div>';
  var sorted = w.answers.slice();
  if(state.answerSort==='인기순'){ sorted.sort(function(a,b){ return (b.likes-a.likes)||(b.createdAt-a.createdAt); }); }
  else { sorted.sort(function(a,b){ return b.createdAt-a.createdAt; }); }
  if(w.bestAnswerId){
    var bi = sorted.findIndex(function(a){ return String(a.id)===String(w.bestAnswerId); });
    if(bi>0){ var bItem = sorted.splice(bi,1)[0]; sorted.unshift(bItem); }
  }
  var answersHtml = sorted.length
    ? sorted.map(function(a){
        var del = a.mine ? '<button class="del-btn" data-action="askDeleteAnswer" data-value="'+w.id+':'+a.id+'" style="margin-right:auto">삭제</button>' : '';
        var isBest = String(w.bestAnswerId)===String(a.id);
        var bestBadge = isBest ? '<span class="best-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.2l5.9-.9L12 3Z"/></svg> 베스트 답변</span>' : '';
        var bestBtn = w.mine ? '<button class="best-btn'+(isBest?' is-on':'')+'" data-action="pickBest" data-value="'+w.id+'~'+a.id+'" aria-label="베스트 답변 채택"><svg width="17" height="17" viewBox="0 0 24 24" fill="'+(isBest?'var(--warm-500)':'none')+'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.2l5.9-.9L12 3Z"/></svg></button>' : '';
        return '<div class="answer'+(isBest?' is-best':'')+'">'+bestBadge+'<div class="worry__meta">'+nickSpan(a.nick, !!a.mine)+
          '<span>·</span><span>'+escapeHtml(a.school)+'</span><span>·</span><span>'+escapeHtml(a.ago)+'</span></div>'+
          '<p class="answer__body">'+escapeHtml(a.body)+'</p>'+
          '<div class="answer__foot">'+del+bestBtn+ratePair('rateAnswer', w.id+'~'+a.id, a.liked, a.disliked)+'</div></div>';
      }).join('')
    : (db && !w.answersLoaded
        ? '<p class="placeholder-note" style="padding:4px 2px">답변을 불러오는 중…</p>'
        : '<p class="placeholder-note" style="padding:4px 2px">아직 답변이 없어요. 첫 번째 따뜻한 답변을 남겨보세요.</p>');
  var sortToggle = '<div style="display:flex;gap:6px">'+['최신순','인기순'].map(function(s){
    return '<button class="seg'+(state.answerSort===s?' is-active':'')+'" style="padding:5px 12px;font-size:12px" data-action="answerSort" data-value="'+s+'">'+s+'</button>';
  }).join('')+'</div>';
  var worryDel = w.mine ? '<button class="del-btn" data-action="askDeleteWorry" data-value="'+w.id+'" style="margin-left:auto">삭제</button>' : '';
  var worryMore = (!w.mine) ? '<div class="more-menu-wrap" style="margin-left:auto">'+
      '<button class="more-btn" data-action="toggleMoreMenu" aria-label="더보기">'+icon('more',20,3)+'</button>'+
      (state.moreMenuOpen ? '<div class="more-menu">'+
        '<button data-action="askReportWorry" data-value="'+w.id+'">신고</button>'+
        '<button data-action="askHideWorry" data-value="'+w.id+'">글 숨기기</button>'+
      '</div>' : '')+
    '</div>' : '';
  var titleHtml = w.title ? '<div class="worry__title" style="font-size:17px;margin:2px 0">'+escapeHtml(w.title)+'</div>' : '';
  var catHtml = w.category ? '<span class="subj-tag">'+escapeHtml(w.category)+'</span>' : '';
  var modHtml = state.modAnswer ? '<div style="padding:10px 12px 0">'+modPanel('answer')+'</div>' : '';
  var emojiRow = state.emojiOpen ? '<div class="emoji-row">'+EMOJIS.map(function(em){ return '<button class="emoji-item" data-action="addEmoji" data-value="'+em+'">'+em+'</button>'; }).join('')+'</div>' : '';
  var dock = '<div class="chat-dock">'+modHtml+emojiRow+
    '<div class="chat-bar">'+
      '<button class="chat-emoji" data-action="toggleEmoji" aria-label="이모티콘">🙂</button>'+
      '<input class="chat-input" id="answerInput" value="'+escapeAttr(state.draftAnswer||'')+'" placeholder="답변을 입력하세요" autocomplete="off">'+
      '<button class="chat-send" data-action="submitAnswer" data-value="'+w.id+'" aria-label="전송">'+icon('send',18,2.2,'var(--ink)')+'</button>'+
    '</div></div>';
  return '<div class="screen" style="padding-bottom:98px">'+
    '<section class="section"><div class="card">'+
      '<div class="worry__meta">'+catHtml+'</div>'+
      titleHtml+
      '<div class="worry__meta" style="margin-top:4px">'+nickSpan(w.nick, !!w.mine)+
        '<span>·</span><span>'+escapeHtml(w.school)+'</span><span>·</span><span>'+escapeHtml(w.ago)+'</span><span>·</span><span>조회 '+fmt(w.views||0)+'</span></div>'+
      '<p class="worry__body" style="margin-top:8px;font-size:14px;line-height:1.6">'+escapeHtml(w.body)+'</p>'+
      '<div style="display:flex;gap:0;margin-top:14px;align-items:center">'+
        '<button class="pf-btn" data-action="cardWarm" data-value="'+w.id+'" aria-label="온기">'+heartSVG(w.liked)+'<span>'+w.warmth+'</span></button>'+
        '<button class="pf-btn" data-action="cardReply" data-value="'+w.id+'" aria-label="답변">'+replySVG(false)+'<span>'+w.answers.length+'</span></button>'+
        (w.mine?worryDel:worryMore)+
      '</div></div></section>'+
    '<section class="section"><div class="section__head" style="align-items:center"><h2 class="section__title">답변 '+w.answers.length+'</h2>'+sortToggle+'</div>'+
      '<div>'+answersHtml+'</div></section>'+
  '</div>'+dock;
}