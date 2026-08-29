/* ===== 시작 화면(스플래시) =====
   보내주신 원본 이미지를 splash.png 로 저장소에 올렸습니다.
   이 파일은 그 이미지를 로드해 화면 전체에 띄웁니다.
   기존 시작화면(로고+글자)은 이 파일이 완전히 대체합니다.

   주의: app-4-actions.js 는 로드 즉시 render()를 호출해 옛 스플래시를 그립니다.
   이 파일은 그보다 뒤에 로드되므로:
   (1) 로드 즉시 DOM을 교체하고
   (2) 이후 render가 다시 불릴 때도 교체합니다. */

function drawSplash(){
  if(typeof state === 'undefined' || state.stage !== 'splash') return;
  var root = document.getElementById('root');
  if(!root) return;
  root.innerHTML = '<div class="app-root"><div class="app-frame">' +
    '<div class="splash" style="background:#faf7ec;width:100%;height:100%;' +
    'min-height:100vh;display:flex;align-items:center;justify-content:center;padding:0"' +
    (state.splashFade ? ' data-out="1"' : '') + '>' +
    '<img src="splash.png" alt="" style="width:100%;height:100%;' +
    'object-fit:contain;max-height:100vh">' +
    '</div></div></div>';
}

/* (1) 이 파일이 로드되는 즉시 — app-4 가 먼저 그려놓은 옛 화면을 지웁니다 */
drawSplash();

/* (2) 이후 render 가 다시 불릴 때도 스플래시면 교체합니다 */
(function(){
  var origRender = window.render;
  if(typeof origRender !== 'function') return;

  window.render = function(){
    var r = origRender.apply(this, arguments);
    drawSplash();
    return r;
  };
})();
