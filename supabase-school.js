/* ===== 학교생활 · 친구 서버 연동 =====
   기존 화면 코드는 전역 배열(examData, perfPosts, homeworkList, friendsList)을
   그대로 읽습니다. 여기서는 서버 값을 그 배열에 채워 넣고,
   클릭 처리가 끝난 뒤 바뀐 내용을 서버로 보냅니다. */

/* ── 내 반 정보 ── */
function myClass(){
  return {
    school: me.school || '',
    grade: parseInt(me.grade, 10) || 0,
    class_no: parseInt(me.classNo, 10) || 0
  };
}

/* ── 시험범위 ── */
function loadExamRanges(){
  if(!db || !state.userId) return;
  var c = myClass();
  db.from('exam_ranges')
    .select('exam_index, subject, content')
    .eq('school', c.school).eq('grade', c.grade).eq('class_no', c.class_no)
    .then(function(r){
      if(r.error) return;
      examData = [{}, {}, {}, {}];
      (r.data||[]).forEach(function(row){
        if(!examData[row.exam_index]) examData[row.exam_index] = {};
        examData[row.exam_index][row.subject] = row.content;
      });
      render();
    });
}

function saveExamRange(examIndex, subject, content){
  if(!db || !state.userId) return;
  var c = myClass();
  if(!content){
    db.from('exam_ranges').delete()
      .eq('school', c.school).eq('grade', c.grade).eq('class_no', c.class_no)
      .eq('exam_index', examIndex).eq('subject', subject);
    return;
  }
  db.from('exam_ranges').upsert({
    school: c.school, grade: c.grade, class_no: c.class_no,
    exam_index: examIndex, subject: subject,
    content: content, author_id: state.userId, updated_at: new Date().toISOString()
  }, { onConflict: 'school,grade,class_no,exam_index,subject' });
}

/* ── 수행평가 ── */
function loadPerfPosts(){
  if(!db || !state.userId) return;
  var c = myClass();
  db.from('perf_posts')
    .select('*')
    .eq('school', c.school).eq('grade', c.grade).eq('class_no', c.class_no)
    .order('created_at', { ascending:false })
    .then(function(r){
      if(r.error) return;
      perfPosts = (r.data||[]).map(function(d){
        return {
          id: d.id, subject: d.subject, title: d.title, body: d.body || '',
          due: d.due || '', photo: d.photo_url || null, nick: d.nickname,
          mine: d.author_id === state.userId,
          createdAt: new Date(d.created_at).getTime()
        };
      });
      render();
    });
}

function savePerfPost(d){
  if(!db || !state.userId) return;
  var c = myClass();
  db.from('perf_posts').insert({
    school: c.school, grade: c.grade, class_no: c.class_no,
    subject: d.subject, title: d.title, body: d.body || null,
    due: d.due || null, photo_url: d.photo || null,
    nickname: me.nickname, author_id: state.userId
  }).then(function(r){ if(!r.error) loadPerfPosts(); });
}

function deletePerfPost(id){
  if(!db) return;
  db.from('perf_posts').delete().eq('id', id);
}

/* ── 개인 과제 ── */
function loadHomework(){
  if(!db || !state.userId) return;
  db.from('homework')
    .select('*')
    .eq('user_id', state.userId)
    .order('due', { ascending:true })
    .then(function(r){
      if(r.error) return;
      homeworkList = (r.data||[]).map(function(d){
        return { id: d.id, text: d.text, due: d.due || '', done: !!d.done };
      });
      render();
    });
}

function saveHomework(text, due){
  if(!db || !state.userId) return;
  db.from('homework')
    .insert({ user_id: state.userId, text: text, due: due || null })
    .then(function(r){ if(!r.error) loadHomework(); });
}

function toggleHomeworkDb(id, done){
  if(!db) return;
  db.from('homework').update({ done: done }).eq('id', id);
}

function deleteHomeworkDb(id){
  if(!db) return;
  db.from('homework').delete().eq('id', id);
}

/* ── 친구 ── */
function loadFriends(){
  if(!db || !state.userId) return;
  db.from('friendships')
    .select('id, status, requester_id, addressee_id')
    .or('requester_id.eq.'+state.userId+',addressee_id.eq.'+state.userId)
    .then(function(r){
      if(r.error) return;
      var rows = r.data || [];
      var otherIds = rows.map(function(f){
        return f.requester_id === state.userId ? f.addressee_id : f.requester_id;
      });
      if(!otherIds.length){ friendsList = []; friendRequests = []; render(); return; }

      db.from('profiles').select('id, nickname, school, warmth')
        .in('id', otherIds)
        .then(function(pr){
          var byId = {};
          (pr.data||[]).forEach(function(p){ byId[p.id] = p; });

          friendsList = [];
          friendRequests = [];
          rows.forEach(function(f){
            var otherId = f.requester_id === state.userId ? f.addressee_id : f.requester_id;
            var p = byId[otherId];
            if(!p) return;
            var item = { id: f.id, userId: p.id, nick: p.nickname, school: p.school, warmth: p.warmth || 0 };
            if(f.status === 'accepted'){ friendsList.push(item); }
            else if(f.status === 'pending' && f.addressee_id === state.userId){ friendRequests.push(item); }
          });
          render();
        });
    });
}

function acceptFriend(rowId){
  if(!db) return;
  db.from('friendships').update({ status:'accepted' }).eq('id', rowId)
    .then(function(){ loadFriends(); });
}

function removeFriend(rowId){
  if(!db) return;
  db.from('friendships').delete().eq('id', rowId)
    .then(function(){ loadFriends(); });
}

/* ── 로그인 후 한 번에 불러오기 ── */
function loadSchoolData(){
  loadExamRanges();
  loadPerfPosts();
  loadHomework();
  loadFriends();
}
