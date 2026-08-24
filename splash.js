/* ===== 시작 화면(스플래시) =====
   온도계 + 말풍선 안에 학교 건물이 들어간 로고를 화면 가운데 놓습니다.
   로고는 SVG 라 어떤 해상도에서도 선명합니다.
   app-4-actions.js 의 render() 가 그린 스플래시를 이 파일이 바꿔치기합니다. */

var SPLASH_BG = '#faf7ec';       /* 시작 화면 배경 (베이지) */
var SPLASH_GREEN = '#a8c199';    /* 로고 초록 */

function splashLogoSVG(){
  return ''+
  '<svg viewBox="0 0 380 790" width="190" height="395" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="온담 로고">'+

    /* 눈금 (오른쪽) */
    '<g fill="'+SPLASH_GREEN+'">'+
      '<rect x="278" y="70"  width="40" height="20" rx="10"/>'+
      '<rect x="278" y="118" width="28" height="20" rx="10"/>'+
      '<rect x="278" y="166" width="40" height="20" rx="10"/>'+
      '<rect x="278" y="214" width="28" height="20" rx="10"/>'+
      '<rect x="278" y="262" width="40" height="20" rx="10"/>'+
      '<rect x="278" y="310" width="28" height="20" rx="10"/>'+
      '<rect x="278" y="358" width="40" height="20" rx="10"/>'+
      '<rect x="278" y="406" width="28" height="20" rx="10"/>'+
    '</g>'+

    /* 온도계 기둥 */
    '<path d="M124 66 a58 58 0 0 1 116 0 V500 H124 Z" fill="'+SPLASH_GREEN+'"/>'+
    '<path d="M156 68 a26 26 0 0 1 52 0 V500 H156 Z" fill="'+SPLASH_BG+'"/>'+
    '<rect x="170" y="118" width="24" height="400" rx="12" fill="'+SPLASH_GREEN+'"/>'+

    /* 말풍선 꼬리 */
    '<path d="M296 610 q48 36 46 88 q-36 -16 -60 -48 Z" fill="'+SPLASH_GREEN+'"/>'+

    /* 둥근 몸통 */
    '<circle cx="182" cy="600" r="178" fill="'+SPLASH_GREEN+'"/>'+
    '<circle cx="182" cy="600" r="148" fill="'+SPLASH_BG+'"/>'+
    '<circle cx="182" cy="600" r="116" fill="'+SPLASH_GREEN+'"/>'+
    '<rect x="170" y="452" width="24" height="120" fill="'+SPLASH_GREEN+'"/>'+

    /* 학교 건물 */
    '<g fill="'+SPLASH_BG+'">'+
      '<rect x="178" y="520" width="7" height="48" rx="3"/>'+
      '<path d="M185 522 h32 l-11 12 l11 12 h-32 Z"/>'+
      '<path d="M138 598 q44 -38 88 0 v8 h-88 Z"/>'+
      '<rect x="138" y="602" width="88" height="50" rx="4"/>'+
      '<rect x="102" y="620" width="42" height="32" rx="4"/>'+
      '<rect x="220" y="620" width="42" height="32" rx="4"/>'+
      '<rect x="102" y="646" width="160" height="14" rx="6"/>'+
    '</g>'+

    /* 시계창 · 출입문 */
    '<g fill="'+SPLASH_GREEN+'">'+
      '<circle cx="182" cy="614" r="9"/>'+
      '<rect x="172" y="640" width="20" height="24" rx="3"/>'+
    '</g>'+

  '</svg>';
}

/* render() 결과에서 스플래시 부분만 교체 */
(function(){
  var origRender = window.render;
  if(typeof origRender !== 'function') return;

  window.render = function(){
    var r = origRender.apply(this, arguments);

    if(state.stage === 'splash'){
      var el = document.querySelector('.splash');
      if(el){
        el.classList.add('splash--logo');
        el.innerHTML = splashLogoSVG();
      }
    }
    return r;
  };
})();
