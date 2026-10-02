// ヒーローのスライドショー（Reactが描画した .library-banner に差し込む）
(function () {
  var SCENES = [
    "./art/scene-1.webp",
    "./art/scene-2.webp",
    "./art/scene-3.webp",
    "./art/scene-4.webp",
    "./art/scene-5.webp",
    "./art/scene-6.webp"
  ];
  var INTERVAL = 6500;

  function build(banner) {
    if (banner.dataset.heroReady) return;
    banner.dataset.heroReady = "1";

    var slides = document.createElement("div");
    slides.className = "hero-slides";
    SCENES.forEach(function (src) {
      var s = document.createElement("div");
      s.className = "hero-slide";
      s.style.backgroundImage = "url('" + src + "')";
      slides.appendChild(s);
    });

    var wash = document.createElement("div");
    wash.className = "hero-wash";

    var copy = document.createElement("div");
    copy.className = "hero-copy";
    copy.innerHTML =
      '<p class="hero-eyebrow">SRI LANKA</p>' +
      '<h2 class="hero-title">スリランカ<br>資料一覧</h2>' +
      '<p class="hero-lead">動画・写真・PDF・サイトリンク</p>';

    var dots = document.createElement("div");
    dots.className = "hero-dots";

    banner.appendChild(slides);
    banner.appendChild(wash);
    banner.appendChild(copy);
    banner.appendChild(dots);

    var items = slides.children;
    var cur = 0, timer = null;

    function show(i) {
      for (var k = 0; k < items.length; k++) {
        items[k].classList.toggle("is-on", k === i);
        dots.children[k].classList.toggle("is-on", k === i);
      }
      cur = i;
    }
    function next() { show((cur + 1) % items.length); }
    function start() { stop(); timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    SCENES.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "画像 " + (i + 1));
      b.addEventListener("click", function () { show(i); start(); });
      dots.appendChild(b);
    });

    // 先読みしてから表示
    var first = new Image();
    first.onload = first.onerror = function () { show(0); start(); };
    first.src = SCENES[0];
    SCENES.slice(1).forEach(function (src) { var im = new Image(); im.src = src; });

    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });
  }

  function tryBuild() {
    var banner = document.querySelector(".library-banner");
    if (banner) build(banner);
  }

  var obs = new MutationObserver(tryBuild);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  tryBuild();
})();
