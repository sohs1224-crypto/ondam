/* ===== 나이스 연동 화면 연결 =====
   - 학교는 검색 버튼을 눌러 목록에서 골라야만 인정
   - 반 선택을 학급정보 목록으로 교체
   - 학급 기록에 공식 학사일정을 함께 표시 */

(function(){

  var acCache = {};

  /* ── 검색 결과 목록 그리기 ── */
  authSchoolAC = function(q){
    q = String(q||'').trim();
    if(!q || !acCache[q]) return '';
    var rows = acCache[q];
    if(rows.length === 0) return '<div class="ac-item ac-empty">검색 결과가 없어요</div>';
    return rows.slice(0,10).map(function(r){
      var label = r.name + (r.area ? ' · ' + r.area : '');
      return '<button type="button" class="ac-item" data-action="pickNeisSchool" '+
        'data-value="'+escapeAttr([r.name, r.atpt, r.code, r.kind||''].join('|'))+'">'+
        escapeHtml(label)+'</button>';
    }).join('');
  };

  function drawAC(q){
    var box = document.getElementById('authSchoolAC');
    if(box) box.innerHTML = authSchoolAC(q);
  }

  /* ── 반 목록 불러오기 ── */
  function refreshClassOptions(){
    var f = state.form;
    if(!f.atptCode || !f.schulCode || !f.grade) return;
    var key = f.atptCode + f.schulCode + f.grade;
    if(f.classKey === key) return;
    f.classKey = key;
    f.classOptions = null;
    neisClassesOf(f.atptCode, f.schulCode, f.grade).then(function(names){
      f.classOptions = names;
      render();
    });
  }

  /* ── 클릭 처리 ── */
  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el) return;
    var action = el.getAttribute('data-action');
    var value  = el.getAttribute('data-value');

    /* 검색 버튼 */
    if(action === 'searchSchool'){
      var input = document.getElementById('af-school');
      var q = input ? input.value.trim() : '';
      state.form.school = q;
      state.form.schoolSearched = true;
      /* 검색을 다시 하면 이전 선택은 무효 */
      state.form.atptCode = null;
      state.form.schulCode = null;
      state.form.classOptions = null;
      state.form.classKey = null;

      if(q.length < 2){
        acCache[q] = [];
        render(); drawAC(q);
        return;
      }
      var box = document.getElementById('authSchoolAC');
      if(box) box.innerHTML = '<div class="ac-item ac-empty">찾는 중…</div>';
      neisSearchSchools(q).then(function(rows){
        acCache[q] = rows;
        render();
        drawAC(q);
      });
      return;
    }

    /* 학교 선택 */
    if(action === 'pickNeisSchool'){
      var parts = String(value).split('|');
      if(state.authView === 'signup'){
        state.form.school = parts[0];
        state.form.atptCode = parts[1];
        state.form.schulCode = parts[2];
        state.form.schoolKind = parts[3] || '';
        state.form.classKey = null;
        state.form.classOptions = null;
        if(!state.form.touched) state.form.touched = {};
        state.form.touched.school = true;
        refreshClassOptions();
      } else if(state.profileForm){
        state.profileForm.school = parts[0];
        state.profileForm.atptCode = parts[1];
        state.profileForm.schulCode = parts[2];
        state.profileForm.schoolKind = parts[3] || '';
      }
      render();
      drawAC('');
    }

    /* 반 선택 */
    else if(action === 'pickClassNo'){
      if(state.authView === 'signup'){
        state.form.classNo = value;
        if(!state.form.touched) state.form.touched = {};
        state.form.touched.classNo = true;
      } else if(state.profileForm){
        state.profileForm.classNo = value;
      }
      render();
    }

    /* 프로필 저장 시 학교 코드도 함께 */
    else if(action === 'saveProfile'){
      if(!db || !state.userId) return;
      var pf = state.profileForm || {};
      if(pf.atptCode && pf.schulCode){
        me.atptCode = pf.atptCode;
        me.schulCode = pf.schulCode;
        me.schoolKind = pf.schoolKind || me.schoolKind;
        mealCache = {}; scheduleCache = {}; timetableCache = {}; classListCache = null;
        db.from('profiles')
          .update({ atpt_code: pf.atptCode, schul_code: pf.schulCode })
          .eq('id', state.userId);
      }
    }

    /* 가입 직후 학교 코드 저장 */
    else if(action === 'authSignup'){
      if(!db) return;
      var atpt = state.form.atptCode, code = state.form.schulCode, kind = state.form.schoolKind;
      if(!atpt || !code) return;
      setTimeout(function(){
        if(!state.userId) return;
        me.atptCode = atpt; me.schulCode = code; me.schoolKind = kind;
        db.from('profiles').update({ atpt_code: atpt, schul_code: code }).eq('id', state.userId);
      }, 2500);
    }
  });

  /* ── 학교명을 직접 고치면 선택을 무효로 ── */
  document.addEventListener('input', function(e){
    var t = e.target;
    if(!t) return;
    if(t.id === 'af-school'){
      if(state.form.atptCode || state.form.schulCode){
        state.form.atptCode = null;
        state.form.schulCode = null;
        state.form.classOptions = null;
        state.form.classKey = null;
        render();
      }
    }
    if(t.id === 'af-grade') setTimeout(refreshClassOptions, 100);
  });

  /* ── 회원가입 화면의 반 입력 아래에 목록 버튼 붙이기 ── */
  var origSignupScreen = window.signupScreen;
  if(typeof origSignupScreen === 'function'){
    window.signupScreen = function(){
      var html = origSignupScreen();
      var f = state.form;
      if(!f.classOptions || !f.classOptions.length) return html;
      var chips = f.classOptions.map(function(n){
        var on = String(f.classNo) === String(n);
        return '<button type="button" class="subj-chip'+(on?' is-on':'')+'" '+
          'data-action="pickClassNo" data-value="'+escapeAttr(n)+'">'+escapeHtml(n)+'반</button>';
      }).join('');
      return html.replace(
        '<div style="display:flex;gap:16px">',
        '<div class="subj-wrap subj-wrap--scroll" style="margin-top:8px">'+chips+'</div>'+
        '<div style="display:flex;gap:16px">'
      );
    };
  }

  /* ── 학급 기록에 공식 학사일정 표시 ── */
  var origClassRecScreen = window.classRecScreen;
  if(typeof origClassRecScreen === 'function'){
    window.classRecScreen = function(){
      var html = origClassRecScreen();
      var sel = state.recSelDate;
      if(!sel) return html;
      var events = scheduleFor(sel);
      if(!events.length) return html;
      var box = '<div class="section" style="padding-top:0">'+
        '<div class="section__title" style="font-size:14px">학교 공식 일정</div>'+
        events.map(function(ev){
          return '<div class="list-row" style="cursor:default">'+
            '<span class="list-row__ic">'+icon('calendar',18)+'</span>'+
            '<span class="list-row__txt">'+
              '<span class="list-row__title">'+escapeHtml(ev.title)+'</span>'+
              (ev.body ? '<span class="list-row__sub">'+escapeHtml(ev.body)+'</span>' : '')+
            '</span></div>';
        }).join('')+
      '</div>';
      return html + box;
    };
  }

  /* ── 로그인 후 프로필에서 학교 코드 읽어오기 ── */
  var origLoad = window.loadMyProfile;
  if(typeof origLoad === 'function'){
    window.loadMyProfile = function(){
      return origLoad.apply(this, arguments).then(function(ok){
        if(!ok) return ok;
        if(db && state.userId){
          db.from('profiles').select('atpt_code, schul_code, role').eq('id', state.userId).single()
            .then(function(r){
              if(r.error || !r.data) return;
              me.atptCode = r.data.atpt_code || null;
              me.schulCode = r.data.schul_code || null;
              if(r.data.role) me.role = r.data.role;
              if(!me.atptCode || !me.schulCode) ensureSchoolCode();
              render();
            });
        }
        return ok;
      });
    };
  }

})();
