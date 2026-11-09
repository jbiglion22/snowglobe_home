/* 첫 화면에 내리는 눈 (움직임 줄이기 설정이면 멈춘 눈만 그림) */
(function () {
  var canvas = document.getElementById('snow');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var flakes = [], w = 0, h = 0, dpr = 1, gust = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(160, w * h / 9000));
    flakes = [];
    for (var i = 0; i < count; i++) flakes.push(make(true));
  }
  function make(anywhere) {
    var r = Math.random() * 2.4 + 0.8;
    return {
      x: Math.random() * w, y: anywhere ? Math.random() * h : -10,
      r: r, vy: r * 0.35 + 0.25, phase: Math.random() * Math.PI * 2,
      a: Math.random() * 0.5 + 0.45
    };
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      ctx.globalAlpha = f.a;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function step() {
    gust *= 0.96;
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.phase += 0.01;
      f.y += f.vy * (1 + gust * 3);
      f.x += Math.sin(f.phase) * 0.3 + gust * f.r;
      if (f.y > h + 10 || f.x > w + 10 || f.x < -10) flakes[i] = make(false);
    }
    draw();
    requestAnimationFrame(step);
  }
  // 첫 화면을 누르면 앱처럼 눈보라
  canvas.parentElement.addEventListener('pointerdown', function () { gust = 1.6; });

  window.addEventListener('resize', resize);
  resize();
  if (reduce) draw(); else requestAnimationFrame(step);
})();
