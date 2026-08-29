/* ===== 시작 화면(스플래시) =====
   보내주신 원본 이미지를 사용합니다.
   용량을 최소화(780자)해서 전송 깨짐을 방지했습니다.
   스플래시는 1~2초만 보이므로 이 해상도로 충분합니다. */

var SPLASH_IMG='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAB4AEQDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAIDBAUBBv/EACUQAAMAAgECBgMBAAAAAAAAAAABAgMREgQhIjEzQVFhE3Gyof/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwD7wAGFAAAAAAAAAAAAAAAAAAAAAAAAAAAKuopxhpy9MtKeq9B/tAquW8OTXN0nLb2/dGiW3KbWm/bezDh9Sv6s3Y9cJ021r38yRIkACqAAAAABT1XoP9ouM/UVzl44Tqvf4QSs+Hvkr+rN074rl56MOJPd1rlKqk9d/M24+P41w1x120SETABVAAAAAEMtcMVUvNI5fWW5awp6lJN/bZ1blXDl+60Y3hi8yeVeOVpzvW/holSsHjwXNS3Na35aOp09bvt2Vyr18MrzY4zR44eNpvTb/wBLenUvJTlrUpTK+hEkaAAVoAAAAACNxNrVSmSAFU4MUvanv99yw9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9k=';

function drawSplash(){
  if(typeof state==='undefined'||state.stage!=='splash') return;
  var root=document.getElementById('root');
  if(!root) return;
  root.innerHTML=
    '<div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;'+
    'background:#faf7ec;display:flex;align-items:center;justify-content:center"'+
    (state.splashFade?' class="splash" data-out="1"':' class="splash"')+'>'+
    '<img src="'+SPLASH_IMG+'" alt="" style="max-width:50%;max-height:60vh;width:auto;height:auto">'+
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
