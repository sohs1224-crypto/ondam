/* ===== 시작 화면(스플래시) =====
   splash.png 파일을 화면 전체에 띄웁니다.
   splash.png가 저장소에 없으면 기존 LOGO를 대신 보여줍니다. */

function drawSplash(){
  if(typeof state==='undefined'||state.stage!=='splash') return;
  var root=document.getElementById('root');
  if(!root) return;
  root.innerHTML=
    '<div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;'+
    'background:#faf7ec;display:flex;align-items:center;justify-content:center"'+
    (state.splashFade?' class="splash" data-out="1"':' class="splash"')+'>'+
    '<img src="splash.png" alt="" '+
    'onerror="this.src=LOGO;this.style.width=\'140px\';this.style.height=\'140px\'" '+
    'style="max-width:60%;max-height:70vh;width:auto;height:auto;object-fit:contain">'+
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
