/* ===== 부팅 로딩 오버레이 제어 =====
   흰 배경 + 스피너(#ondam-boot, index.html)를 띄워두고,
   앱이 준비되면(스플래시 단계를 벗어나면) 부드럽게 페이드아웃합니다. */

function hideBootOverlay(){
  var ov = document.getElementById('ondam-boot');
  if(!ov || ov.classList.contains('is-out')) return;
  ov.classList.add('is-out');
  setTimeout(function(){ if(ov && ov.parentNode) ov.parentNode.removeChild(ov); }, 500);
}

/* render() 가 끝난 뒤, 스플래시 단계를 벗어났으면 로딩 오버레이를 숨김 */
(function(){
  var orig = window.render;
  if(typeof orig !== 'function') return;
  window.render = function(){
    var r = orig.apply(this, arguments);
    if(typeof state !== 'undefined' && state.stage !== 'splash') hideBootOverlay();
    return r;
  };
})();

/* 안전장치: 혹시 오래 걸려도 8초 뒤엔 로딩 화면을 치움 */
setTimeout(hideBootOverlay, 8000);
