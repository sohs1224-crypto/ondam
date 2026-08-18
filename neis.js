/* ===== 나이스(NEIS) 교육정보 개방 포털 연동 =====
   - 학교 검색   : 회원가입에서 실제 학교를 찾아 학교 코드까지 저장
   - 급식 식단   : 학교 코드로 월별 급식 메뉴
   - 학사일정    : 시험 기간·체육대회 등 공식 일정
   - 시간표      : 학년·반별 요일/교시 과목
   - 학급정보    : 학년별 반 목록
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

function neisFetch(path, params, serviceName){
  var qs = Object.keys(params).map(function(k){
    return k + '=' + encodeURIComponent(params[k]);
  }).join('&');
  var url = NEIS_BASE + '/' + path + '?KEY=' + NEIS_KEY + '&Type=json&' + qs;
  return fetch(url)
    .then(function(r){ return r.json(); })
    .then(function(j){ return neisRows(j, serviceName); })
    .catch(function(e){
      console.error('[온담] 나이스 ' + path + ' 실패:', e && e.message);
      return [];
    });
}

/* 내 학교 코드가 준비됐는지 */
function hasSchoolCode(){ return !!(me.atptCode && me.schulCode); }
function schoolParams(){
  return { ATPT_OFCDC_SC_CODE: me.atptCode, SD_SCHUL_CODE: me.schulCode };
}


/* ── 1. 학교 검색 ── */
var schoolSearchCache = {};

function neisSearchSchools(query){
  var q = String(query||'').trim();
  if(q.length < 2) return Promise.resolve([]);
  if(schoolSearchCache[q]) return Promise.resolve(schoolSearchCache[q]);

  return neisFetch('schoolInfo', { pIndex:1, pSize:20, SCHUL_NM:q }, 'schoolInfo')
    .then(function(rows){
      var out = rows.map(function(d){
        return {
          name: d.SCHUL_NM,
          atpt: d.ATPT_OFCDC_SC_CODE,
          code: d.SD_SCHUL_CODE,
          kind: d.SCHUL_KND_SC_NM,
          area: d.LCTN_SC_NM
        };
      });
      schoolSearchCache[q] = out;
      return out;
    });
}


/* ── 2. 급식 식단 ── */
var mealCache = {};        /* 'YYYYMM' -> { 'YYYYMMDD': [메뉴...] } */
var mealLoading = {};

function neisLoadMeals(year, month){
  if(!hasSchoolCode()) return Promise.resolve({});
  var ym = String(year) + ('0'+(month+1)).slice(-2);
  if(mealCache[ym]) return Promise.resolve(mealCache[ym]);

  var p = schoolParams();
  p.pIndex = 1; p.pSize = 100; p.MLSV_YMD = ym; p.MMEAL_SC_CODE = 2;  /* 2 = 중식 */

  return neisFetch('mealServiceDietInfo', p, 'mealServiceDietInfo').then(function(rows){
    var byDate = {};
    rows.forEach(function(d){
      var dishes = String(d.DDISH_NM||'')
        .split(/<br\s*\/?>/i)
        .map(function(s){ return s.replace(/[0-9.()]+$/g, '').trim(); })
        .filter(Boolean);
      byDate[d.MLSV_YMD] = { dishes: dishes, kcal: d.CAL_INFO || '' };
    });
    mealCache[ym] = byDate;
    return byDate;
  });
}

/* 화면이 부르는 함수 — 없으면 불러온 뒤 다시 그립니다 */
function mealMenuFor(year, month, day){
  if(!hasSchoolCode()) return ['학교 정보를 등록하면', '급식이 표시돼요'];

  var ym = String(year) + ('0'+(month+1)).slice(-2);
  var ymd = ym + ('0'+day).slice(-2);

  if(!mealCache[ym]){
    if(!mealLoading[ym]){
      mealLoading[ym] = true;
      neisLoadMeals(year, month).then(function(){ render(); });
    }
    return ['불러오는 중…'];
  }
  var entry = mealCache[ym][ymd];
  return entry ? entry.dishes : [];
}

/* 칼로리 정보 */
function mealKcalFor(year, month, day){
  var ym = String(year) + ('0'+(month+1)).slice(-2);
  var ymd = ym + ('0'+day).slice(-2);
  var entry = mealCache[ym] && mealCache[ym][ymd];
  return entry ? entry.kcal : '';
}


/* ── 3. 학사일정 ── */
var scheduleCache = {};    /* 'YYYYMM' -> [ {date, title, body} ] */
var scheduleLoading = {};

function neisLoadSchedule(year, month){
  if(!hasSchoolCode()) return Promise.resolve([]);
  var ym = String(year) + ('0'+(month+1)).slice(-2);
  if(scheduleCache[ym]) return Promise.resolve(scheduleCache[ym]);

  var last = new Date(year, month+1, 0).getDate();
  var p = schoolParams();
  p.pIndex = 1; p.pSize = 100;
  p.AA_FROM_YMD = ym + '01';
  p.AA_TO_YMD   = ym + ('0'+last).slice(-2);

  return neisFetch('SchoolSchedule', p, 'SchoolSchedule').then(function(rows){
    var list = rows.map(function(d){
      return {
        date: d.AA_YMD,
        title: d.EVENT_NM || '',
        body: (d.EVENT_CNTNT || '').replace(/<br\s*\/?>/gi, ' ').trim(),
        grade1: d.ONE_GRADE_EVENT_YN === 'Y',
        grade2: d.TW_GRADE_EVENT_YN === 'Y',
        grade3: d.THREE_GRADE_EVENT_YN === 'Y'
      };
    }).filter(function(x){ return x.title; });
    scheduleCache[ym] = list;
    return list;
  });
}

/* 특정 날짜의 학사일정 (YYYY-MM-DD) */
function scheduleFor(isoDate){
  if(!hasSchoolCode()) return [];
  var ymd = String(isoDate).replace(/-/g, '');
  var ym = ymd.slice(0,6);

  if(!scheduleCache[ym]){
    if(!scheduleLoading[ym]){
      scheduleLoading[ym] = true;
      var y = parseInt(ym.slice(0,4),10), m = parseInt(ym.slice(4,6),10)-1;
      neisLoadSchedule(y, m).then(function(){ render(); });
    }
    return [];
  }

  var myGrade = parseInt(me.grade,10) || 1;
  return scheduleCache[ym].filter(function(e){
    if(e.date !== ymd) return false;
    /* 학년별 행사 표시가 모두 N 이면 전교 행사로 봅니다 */
    if(!e.grade1 && !e.grade2 && !e.grade3) return true;
    return (myGrade===1 && e.grade1) || (myGrade===2 && e.grade2) || (myGrade===3 && e.grade3);
  });
}


/* ── 4. 시간표 ── */
var timetableCache = {};   /* 'YYYYMMDD' -> [ {period, subject} ] */
var timetableLoading = {};

/* 학교급에 따라 호출할 서비스가 다릅니다 */
function timetableService(){
  var kind = me.schoolKind || '';
  if(kind.indexOf('초등') >= 0) return 'elsTimetable';
  if(kind.indexOf('중학') >= 0) return 'misTimetable';
  if(kind.indexOf('특수') >= 0) return 'spsTimetable';
  return 'hisTimetable';   /* 기본: 고등학교 */
}

function neisLoadTimetable(isoDate){
  if(!hasSchoolCode()) return Promise.resolve([]);
  var ymd = String(isoDate).replace(/-/g, '');
  if(timetableCache[ymd]) return Promise.resolve(timetableCache[ymd]);

  var svc = timetableService();
  var p = schoolParams();
  p.pIndex = 1; p.pSize = 20;
  p.ALL_TI_YMD = ymd;
  p.GRADE = parseInt(me.grade,10) || 1;
  p.CLASS_NM = parseInt(me.classNo,10) || 1;
  p.AY = ymd.slice(0,4);

  return neisFetch(svc, p, svc).then(function(rows){
    var list = rows.map(function(d){
      return { period: parseInt(d.PERIO,10) || 0, subject: d.ITRT_CNTNT || '' };
    }).filter(function(x){ return x.subject; })
      .sort(function(a,b){ return a.period - b.period; });
    timetableCache[ymd] = list;
    return list;
  });
}

/* 화면이 부르는 함수 */
function timetableFor(isoDate){
  if(!hasSchoolCode()) return [];
  var ymd = String(isoDate).replace(/-/g, '');

  if(!timetableCache[ymd]){
    if(!timetableLoading[ymd]){
      timetableLoading[ymd] = true;
      neisLoadTimetable(isoDate).then(function(){ render(); });
    }
    return [];
  }
  return timetableCache[ymd];
}


/* ── 5. 학급정보 (학년별 반 목록) ── */
var classListCache = null;

function neisLoadClasses(grade){
  if(!hasSchoolCode()) return Promise.resolve([]);
  var g = parseInt(grade,10) || 1;
  if(classListCache && classListCache[g]) return Promise.resolve(classListCache[g]);

  var p = schoolParams();
  p.pIndex = 1; p.pSize = 100;
  p.AY = String(new Date().getFullYear());
  p.GRADE = g;

  return neisFetch('classInfo', p, 'classInfo').then(function(rows){
    var names = [];
    rows.forEach(function(d){
      var n = d.CLASS_NM;
      if(n && names.indexOf(n) < 0) names.push(n);
    });
    names.sort(function(a,b){ return (parseInt(a,10)||0) - (parseInt(b,10)||0); });
    if(!classListCache) classListCache = {};
    classListCache[g] = names;
    return names;
  });
}

/* 특정 학교의 학급 목록 (가입 화면용 — 아직 로그인 전이라 코드를 직접 받습니다) */
function neisClassesOf(atpt, code, grade){
  var p = {
    ATPT_OFCDC_SC_CODE: atpt,
    SD_SCHUL_CODE: code,
    pIndex: 1, pSize: 100,
    AY: String(new Date().getFullYear()),
    GRADE: parseInt(grade,10) || 1
  };
  return neisFetch('classInfo', p, 'classInfo').then(function(rows){
    var names = [];
    rows.forEach(function(d){
      var n = d.CLASS_NM;
      if(n && names.indexOf(n) < 0) names.push(n);
    });
    names.sort(function(a,b){ return (parseInt(a,10)||0) - (parseInt(b,10)||0); });
    return names;
  });
}


/* ── 로그인 시 학교 코드 채우기 ──
   기존 계정은 코드가 없으므로 학교 이름으로 한 번 찾아 저장합니다. */
function ensureSchoolCode(){
  if(!db || !state.userId) return;
  if(hasSchoolCode()) return;
  if(!me.school) return;

  neisSearchSchools(me.school).then(function(rows){
    var hit = rows.filter(function(r){ return r.name === me.school; })[0] || rows[0];
    if(!hit) return;
    me.atptCode = hit.atpt;
    me.schulCode = hit.code;
    me.schoolKind = hit.kind;
    db.from('profiles')
      .update({ atpt_code: hit.atpt, schul_code: hit.code })
      .eq('id', state.userId)
      .then(function(){ render(); });
  });
}
