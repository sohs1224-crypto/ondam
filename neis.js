/* ===== 나이스(NEIS) 교육정보 개방 포털 연동 =====
   - 학교 검색: 회원가입에서 실제 학교 목록을 찾아 학교 코드까지 저장
   - 급식 식단: 학교 코드로 월별 급식 메뉴를 불러옴
   공공데이터라 읽기 전용이며, 인증키는 호출 한도만 관리합니다. */

var NEIS_KEY = '6727a3ac4ef3458fbaa76af6bf75ad6c';
var NEIS_BASE = 'https://open.neis.go.kr/hub';

/* 나이스 응답에서 행 목록만 꺼냅니다.
   결과가 없으면 RESULT 객체만 오므로 빈 배열을 돌려줍니다. */
function neisRows(json, serviceName){
  var svc = json && json[serviceName];
  if(!svc || !svc.length) return [];
  var body = svc[1];
  return (body && body.row) ? body.row : [];
}

/* ── 학교 검색 ── */
var schoolSearchCache = {};

function neisSearchSchools(query){
  var q = String(query||'').trim();
  if(q.length < 2) return Promise.resolve([]);
  if(schoolSearchCache[q]) return Promise.resolve(schoolSearchCache[q]);

  var url = NEIS_BASE + '/schoolInfo'
    + '?KEY=' + NEIS_KEY
    + '&Type=json&pIndex=1&pSize=20'
    + '&SCHUL_NM=' + encodeURIComponent(q);

  return fetch(url)
    .then(function(r){ return r.json(); })
    .then(function(j){
      var rows = neisRows(j, 'schoolInfo').map(function(d){
        return {
          name: d.SCHUL_NM,
          atpt: d.ATPT_OFCDC_SC_CODE,
          code: d.SD_SCHUL_CODE,
          kind: d.SCHUL_KND_SC_NM,
          area: d.LCTN_SC_NM
        };
      });
      schoolSearchCache[q] = rows;
      return rows;
    })
    .catch(function(e){
      console.error('[온담] 학교 검색 실패:', e && e.message);
      return [];
    });
}

/* ── 급식 식단 ── */
var mealCache = {};   /* 'YYYYMM' -> { 'YYYYMMDD': [메뉴...] } */

function neisLoadMeals(year, month){
  if(!me.atptCode || !me.schulCode) return Promise.resolve({});
  var ym = String(year) + ('0'+(month+1)).slice(-2);
  if(mealCache[ym]) return Promise.resolve(mealCache[ym]);

  var url = NEIS_BASE + '/mealServiceDietInfo'
    + '?KEY=' + NEIS_KEY
    + '&Type=json&pIndex=1&pSize=100'
    + '&ATPT_OFCDC_SC_CODE=' + encodeURIComponent(me.atptCode)
    + '&SD_SCHUL_CODE=' + encodeURIComponent(me.schulCode)
    + '&MLSV_YMD=' + ym
    + '&MMEAL_SC_CODE=2';   /* 2 = 중식 */

  return fetch(url)
    .then(function(r){ return r.json(); })
    .then(function(j){
      var byDate = {};
      neisRows(j, 'mealServiceDietInfo').forEach(function(d){
        /* 메뉴는 <br/> 로 구분되고 뒤에 알레르기 번호가 붙습니다 */
        var dishes = String(d.DDISH_NM||'')
          .split(/<br\s*\/?>/i)
          .map(function(s){ return s.replace(/[0-9.()]+$/g, '').trim(); })
          .filter(Boolean);
        byDate[d.MLSV_YMD] = dishes;
      });
      mealCache[ym] = byDate;
      return byDate;
    })
    .catch(function(e){
      console.error('[온담] 급식 조회 실패:', e && e.message);
      return {};
    });
}

/* 화면이 부르는 함수 — 캐시에 있으면 바로, 없으면 불러온 뒤 다시 그립니다 */
function mealMenuFor(year, month, day){
  if(!me.atptCode || !me.schulCode) return ['학교 정보를 등록하면', '급식이 표시돼요'];

  var ym = String(year) + ('0'+(month+1)).slice(-2);
  var ymd = ym + ('0'+day).slice(-2);

  if(!mealCache[ym]){
    if(!mealCache['loading_'+ym]){
      mealCache['loading_'+ym] = true;
      neisLoadMeals(year, month).then(function(){ render(); });
    }
    return ['불러오는 중…'];
  }
  return mealCache[ym][ymd] || [];
}

/* ── 로그인 시 학교 코드 채우기 ──
   기존 계정은 코드가 없으므로 학교 이름으로 한 번 찾아 저장합니다. */
function ensureSchoolCode(){
  if(!db || !state.userId) return;
  if(me.atptCode && me.schulCode) return;
  if(!me.school) return;

  neisSearchSchools(me.school).then(function(rows){
    var hit = rows.filter(function(r){ return r.name === me.school; })[0] || rows[0];
    if(!hit) return;
    me.atptCode = hit.atpt;
    me.schulCode = hit.code;
    db.from('profiles')
      .update({ atpt_code: hit.atpt, schul_code: hit.code })
      .eq('id', state.userId)
      .then(function(){ render(); });
  });
}
