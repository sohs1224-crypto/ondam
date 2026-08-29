/* ===== 시작 화면(스플래시) =====
   앱에 이미 들어있는 LOGO 데이터 URL을 사용합니다.
   보내주신 사진과 동일하게 베이지 배경에 로고를 가운데 놓습니다.
   새 이미지 파일 없이 동작하므로 전송 깨짐 문제가 없습니다. */

function drawSplash(){
  if(typeof state==='undefined'||state.stage!=='splash') return;
  if(typeof LOGO==='undefined') return;
  var root=document.getElementById('root');
  if(!root) return;
  root.innerHTML=
    '<div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;'+
    'background:#faf7ec;display:flex;align-items:center;justify-content:center"'+
    (state.splashFade?' class="splash" data-out="1"':' class="splash"')+'>'+
    '<img src="'+LOGO+'" alt="" style="width:140px;height:140px">'+
    '</div>';
}

drawSplash();

(function(){
  var orig=window.render;
  if(typeof orig!=='function') return;
  window.render=function(){
    var r=orig.apply(this,arguments);
    drawSplash();
    return r;
  };
})();
