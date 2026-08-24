/* ===== 시작 화면(스플래시) =====
   온도계 + 말풍선 안에 학교 건물이 들어간 로고를 화면 가운데 놓습니다.
   로고는 SVG 로 그려서 어떤 해상도에서도 선명합니다. */

var SPLASH_BG = '#faf7ec';       /* 시작 화면 배경 (베이지) */
var SPLASH_GREEN = '#a8c199';    /* 로고 초록 */

function splashLogoSVG(){
  return ''+
  '<svg viewBox="0 0 380 815" width="200" height="429" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="온담 로고">'+

    /* 눈금 (오른쪽 8개) */
    '<g fill="'+SPLASH_GREEN+'">'+
      '<rect x="272" y="62"  width="38" height="20" rx="10"/>'+
      '<rect x="272" y="128" width="28" height="20" rx="10"/>'+
      '<rect x="272" y="146" width="38" height="20" rx="10"/>'+
      '<rect x="272" y="212" width="28" height="20" rx="10"/>'+
      '<rect x="272" y="230" width="38" height="20" rx="10"/>'+
      '<rect x="272" y="296" width="28" height="20" rx="10"/>'+
      '<rect x="272" y="314" width="38" height="20" rx="10"/>'+
      '<rect x="272" y="380" width="28" height="20" rx="10"/>'+
      '<rect x="272" y="398" width="38" height="20" rx="10"/>'+
    '</g>'+

    /* 온도계 기둥 바깥선 */
    '<path d="M120 60 a60 60 0 0 1 120 0 V470 H120 Z" fill="'+SPLASH_GREEN+'"/>'+
    /* 기둥 안쪽 (배경색으로 파냄) */
    '<path d="M152 62 a28 28 0 0 1 56 0 V470 H152 Z" fill="'+SPLASH_BG+'"/>'+
    /* 수은 기둥 */
    '<rect x="168" y="112" width="24" height="380" rx="12" fill="'+SPLASH_GREEN+'"/>'+

    /* 말풍선 꼬리 */
    '<path d="M292 596 q46 34 44 84 q-34 -14 -56 -44 Z" fill="'+SPLASH_GREEN+'"/>'+

    /* 둥근 몸통 바깥 링 */
    '<circle cx="180" cy="590" r="180" fill="'+SPLASH_GREEN+'"/>'+
    '<circle cx="180" cy="590" r="150" fill="'+SPLASH_BG+'"/>'+
    '<circle cx="180" cy="590" r="118" fill="'+SPLASH_GREEN+'"/>'+

    /* 수은이 몸통까지 이어지도록 */
    '<rect x="168" y="440" width="24" height="120" fill="'+SPLASH_GREEN+'"/>'+

    /* 학교 건물 (배경색으로 파냄) */
    '<g fill="'+SPLASH_BG+'">'+
      /* 깃대와 깃발 */
      '<rect x="176" y="512" width="6" height="46" rx="3"/>'+
      '<path d="M182 514 h30 l-10 12 l10 12 h-30 Z"/>'+
      /* 지붕 */
      '<path d="M138 588 q42 -34 84 0 Z"/>'+
      '<path d="M136 586 q44 -36 88 0 v10 h-88 Z"/>'+
      /* 본관 */
      '<rect x="136" y="594" width="88" height="52" rx="4"/>'+
      /* 좌우 날개 */
      '<rect x="102" y="612" width="40" height="34" rx="4"/>'+
      '<rect x="218" y="612" width="40" height="34" rx="4"/>'+
      /* 아래 받침 */
      '<rect x="102" y="640" width="156" height="14" rx="6"/>'+
    '</g>'+

    /* 시계창과 출입문 (초록으로 다시 파냄) */
    '<g fill="'+SPLASH_GREEN+'">'+
      '<circle cx="180" cy="606" r="9"/>'+
      '<rect x="170" y="632" width="20" height="24" rx="3"/>'+
    '</g>'+

  '</svg>';
}

/* 시작 화면 전체 */
splashScreen = function(){
  return '<div class="splash splash--logo">'+
    splashLogoSVG()+
  '</div>';
};
