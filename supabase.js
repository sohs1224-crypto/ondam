/* ===== Supabase 연결 ===== */
var SUPABASE_URL = 'https://ajorqphnhhnydhewapqa.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb3JxcGhuaGhueWRoZXdhcHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2OTg4NjksImV4cCI6MjEwMjI3NDg2OX0.ifxj5blUgcgD1pt7oSOhb6_1fyAi8OubIElsOVDDS0c';

var SUPA_LIB_OK = !!(window.supabase && window.supabase.createClient);
var db = null;
try {
  if(SUPA_LIB_OK) db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch(e){
  console.error('[온담] Supabase 클라이언트 생성 실패:', e);
}

if(!SUPA_LIB_OK){
  console.error('[온담] Supabase 라이브러리를 불러오지 못했습니다. CDN 차단 여부를 확인하세요.');
}

/* 아이디 -> Supabase 내부 이메일
   Supabase 는 이메일에 영문/숫자만 허용하므로 아이디도 같은 규칙을 씁니다. */
function idToEmail(id){ return String(id||'').trim().toLowerCase() + '@ondam.app'; }

/* 아이디에 쓸 수 없는 문자가 있는지 */
function idIsAscii(id){ return /^[a-z0-9._-]+$/i.test(String(id||'').trim()); }

/* 서버 오류를 사람이 읽을 수 있는 문장으로 */
function authMsg(err){
  var m = String(err && err.message || err || '');
  console.error('[온담] 인증 오류 원문:', err);
  if(/Invalid login credentials/i.test(m)) return '아이디 또는 비밀번호가 올바르지 않아요.';
  if(/already registered|already been registered/i.test(m)) return '이미 사용 중인 아이디예요.';
  if(/Email not confirmed/i.test(m)) return '이메일 확인이 켜져 있어요. Supabase 설정에서 Confirm email을 꺼주세요.';
  if(/Password should be/i.test(m)) return '비밀번호는 8자 이상이어야 해요.';
  if(/invalid format|Unable to validate email/i.test(m)) return '아이디는 영문과 숫자만 사용할 수 있어요.';
  if(/rate limit|too many/i.test(m)) return '요청이 너무 잦아요. 잠시 후 다시 시도해 주세요.';
  if(/Failed to fetch|NetworkError|Load failed/i.test(m)){
    return '서버에 연결하지 못했어요. (' + m + ')';
  }
  return m || '알 수 없는 오류가 발생했어요.';
}

/* 연결 상태 자가 진단 — 콘솔에 결과를 남깁니다 */
function supaSelfTest(){
  if(!db){ console.error('[온담] 진단: db 객체가 없습니다.'); return; }
  fetch(SUPABASE_URL + '/auth/v1/health', { headers: { apikey: SUPABASE_ANON_KEY } })
    .then(function(r){ console.log('[온담] 진단: 서버 응답 상태', r.status); })
    .catch(function(e){ console.error('[온담] 진단: 서버 연결 실패 —', e && e.message); });
}
if(db) supaSelfTest();

/* ===== 고민광장 서버 연동 ===== */
function timeAgo(iso){
  var t = new Date(iso).getTime();
  var s = Math.floor((Date.now()-t)/1000);
  if(s < 60) return '방금 전';
  if(s < 3600) return Math.floor(s/60)+'분 전';
  if(s < 86400) return Math.floor(s/3600)+'시간 전';
  if(s < 604800) return Math.floor(s/86400)+'일 전';
  var d = new Date(t);
  return (d.getMonth()+1)+'월 '+d.getDate()+'일';
}

function mapWorry(d){
  return {
    id: d.id,
    nick: d.nickname,
    school: d.school,
    category: d.category,
    title: d.title || '',
    body: d.body,
    views: d.views || 0,
    warmth: d.warmth || 0,
    liked: !!d.liked,
    mine: !!d.is_mine,
    createdAt: new Date(d.created_at).getTime(),
    ago: timeAgo(d.created_at),
    answerCount: d.answer_count || 0,
    answers: [],
    answersLoaded: false,
    bestAnswerId: null,
    reportCount: 0
  };
}

function mapAnswer(d){
  return {
    id: d.id,
    nick: d.nickname,
    school: d.school,
    body: d.body,
    likes: d.likes || 0,
    liked: !!d.liked,
    disliked: false,
    mine: !!d.is_mine,
    isBest: !!d.is_best,
    createdAt: new Date(d.created_at).getTime(),
    ago: timeAgo(d.created_at)
  };
}

/* 고민 목록 불러오기 */
function loadWorries(){
  if(!db) return;
  state.plazaLoading = true;
  db.from('worries_public')
    .select('*')
    .order('created_at', { ascending:false })
    .limit(200)
    .then(function(r){
      state.plazaLoading = false;
      if(r.error){ state.plazaError = r.error.message; render(); return; }
      state.plazaError = null;
      worries = (r.data||[]).map(mapWorry);
      render();
    });
}

/* 특정 고민의 답변 불러오기 */
function loadAnswers(worryId){
  if(!db) return;
  db.from('answers_public')
    .select('*')
    .eq('worry_id', worryId)
    .then(function(r){
      var w = worries.filter(function(x){ return String(x.id)===String(worryId); })[0];
      if(!w) return;
      if(r.error){ w.answersLoaded = true; render(); return; }
      w.answers = (r.data||[]).map(mapAnswer);
      w.answerCount = w.answers.length;
      var best = w.answers.filter(function(a){ return a.isBest; })[0];
      w.bestAnswerId = best ? best.id : null;
      w.answersLoaded = true;
      render();
    });
}
