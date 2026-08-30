(function(){

  var acCache = {};
  var refocusSchool = false;

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

  function schoolPicked(){
    return !!(state.form.atptCode && state.form.schulCode);
  }

  function clearSchoolPick(keepText){
    var f = state.form;
    f.atptCode = null; f.schulCode = null; f.schoolKind = '';
    f.classOptions = null; f.classKey = null;
    if(!keepText){ f.school = ''; f.schoolSearched = false; }
  }

  document.addEventListener('mousedown', function(e){
    var t = e.target;
    if(!t || t.id !== 'af-school') return;
    if(!schoolPicked()) return;
    e.preventDefault();
    clearSchoolPick(false);
    acCache = {};
    refocusSchool = true;
    render();
  }, true);

  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el) return;
    var action = el.getAttribute('data-action');
    var value  = el.getAttribute('data-value');

    if(action === 'searchSchool'){
      var input = document.getElementById('af-school');
      var q = input ? input.value.trim() : String(state.form.school||'').trim();
      state.form.school = q;
      clearSchoolPick(true);
      state.form.schoolSearched = true;
      if(q.length < 2){ acCache[q] = []; render(); drawAC(q); return; }
      var box = document.getElementById('authSchoolAC');
      if(box) box.innerHTML = '<div class="ac-item ac-empty">찾는 중…</div>';
      neisSearchSchools(q).then(function(rows){ acCache[q] = rows; render(); drawAC(q); });
      return;
    }

    if(action === 'pickNeisSchool'){
      var parts = String(value).split('|');
      if(state.authView === 'signup'){
        state.form.school = parts[0]; state.form.atptCode = parts[1];
        state.form.schulCode = parts[2]; state.form.schoolKind = parts[3] || '';
        state.form.classKey = null; state.form.classOptions = null;
        if(!state.form.touched) state.form.touched = {};
        state.form.touched.school = true;
        acCache = {};
      } else if(state.profileForm){
        state.profileForm.school = parts[0]; state.profileForm.atptCode = parts[1];
        state.profileForm.schulCode = parts[2]; state.profileForm.schoolKind = parts[3] || '';
      }
      render();
    }

    else if(action === 'saveProfile'){
      if(!db || !state.userId) return;
      var pf = state.profileForm || {};
      if(pf.atptCode && pf.schulCode){
        me.atptCode = pf.atptCode; me.schulCode = pf.schulCode;
        me.schoolKind = pf.schoolKind || me.schoolKind;
        mealCache = {}; scheduleCache = {}; timetableCache = {}; classListCache = null;
        db.from('profiles').update({ atpt_code: pf.atptCode, schul_code: pf.schulCode }).eq('id', state.userId);
      }
    }

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

  /* 다시 그린 뒤 학교칸에 커서 두기 */
  var origRender = window.render;
  if(typeof origRender === 'function'){
    window.render = function(){
      var r = origRender.apply(this, arguments);
      if(refocusSchool){ refocusSchool = false; var input = document.getElementById('af-school'); if(input) input.focus(); }
      return r;
    };
  }

  /* 학급 기록에 공식 학사일정 표시 */
  var origClassRecScreen = window.classRecScreen;
  if(typeof origClassRecScreen === 'function'){
    window.classRecScreen = function(){
      var html = origClassRecScreen();
      var sel = state.recSelDate;
      if(!sel) return html;
      var events = scheduleFor(sel);
      if(!events.length) return html;
      var box = '<div class="section" style="padding-top:0"><div class="section__title" style="font-size:14px">학교 공식 일정</div>'+
        events.map(function(ev){ return '<div class="list-row" style="cursor:default"><span class="list-row__ic">'+icon('calendar',18)+'</span><span class="list-row__txt"><span class="list-row__title">'+escapeHtml(ev.title)+'</span>'+(ev.body?'<span class="list-row__sub">'+escapeHtml(ev.body)+'</span>':'')+'</span></div>'; }).join('')+'</div>';
      return html + box;
    };
  }

  /* 로그인 후 프로필에서 학교 코드 읽어오기 */
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
