/* ===== 나이스 연동 화면 연결 =====
   학교 검색을 실제 나이스 데이터로 바꾸고,
   고른 학교의 코드를 프로필에 저장합니다. */

(function(){

  /* ── 학교 자동완성을 나이스 검색으로 교체 ── */
  var acCache = {};      /* 검색어 -> 결과 배열 */
  var acPending = null;  /* 입력 지연 타이머 */

  authSchoolAC = function(q){
    q = String(q||'').trim();
    if(q.length < 2) return '';

    /* 이미 받아둔 결과가 있으면 그대로 그립니다 */
    if(acCache[q]){
      var rows = acCache[q];
      if(rows.length === 1 && rows[0].name === q) return '';
      if(rows.length === 0) return '<div class="ac-item ac-empty">검색 결과가 없어요</div>';
      return rows.slice(0,8).map(function(r){
        var label = r.name + (r.area ? ' · ' + r.area : '');
        return '<button type="button" class="ac-item" data-action="pickNeisSchool" '+
          'data-value="'+escapeAttr(r.name+'|'+r.atpt+'|'+r.code)+'">'+
          escapeHtml(label)+'</button>';
      }).join('');
    }

    /* 없으면 검색을 걸고, 끝나면 목록만 다시 그립니다 */
    clearTimeout(acPending);
    acPending = setTimeout(function(){
      neisSearchSchools(q).then(function(rows){
        acCache[q] = rows;
        var box = document.getElementById('authSchoolAC');
        if(box) box.innerHTML = authSchoolAC(q);
      });
    }, 300);

    return '<div class="ac-item ac-empty">찾는 중…</div>';
  };

  /* ── 학교를 고르면 이름과 코드를 함께 담아둡니다 ── */
  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el) return;
    var action = el.getAttribute('data-action');
    var value  = el.getAttribute('data-value');

    if(action === 'pickNeisSchool'){
      var parts = String(value).split('|');
      var isSignup = (state.authView === 'signup');

      if(isSignup){
        state.form.school = parts[0];
        state.form.atptCode = parts[1];
        state.form.schulCode = parts[2];
        if(!state.form.touched) state.form.touched = {};
        state.form.touched.school = true;
      } else if(state.profileForm){
        state.profileForm.school = parts[0];
        state.profileForm.atptCode = parts[1];
        state.profileForm.schulCode = parts[2];
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
        mealCache = {};   /* 학교가 바뀌면 급식 캐시를 비웁니다 */
        db.from('profiles')
          .update({ atpt_code: pf.atptCode, schul_code: pf.schulCode })
          .eq('id', state.userId);
      }
    }
  });

  /* ── 회원가입 시 학교 코드를 함께 저장 ── */
  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if(!el || el.getAttribute('data-action') !== 'authSignup') return;
    if(!db) return;

    /* 가입 직후 프로필이 만들어지면 코드를 채워 넣습니다 */
    var atpt = state.form.atptCode, code = state.form.schulCode;
    if(!atpt || !code) return;
    setTimeout(function(){
      if(!state.userId) return;
      me.atptCode = atpt; me.schulCode = code;
      db.from('profiles')
        .update({ atpt_code: atpt, schul_code: code })
        .eq('id', state.userId);
    }, 2500);
  });

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
