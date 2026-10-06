/* ミナカワカーズ v2 */
(function () {
  'use strict';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ヘッダーの影 */
  var hd = $('#hd');
  function onScroll() { if (hd) hd.classList.toggle('is-stuck', window.scrollY > 10); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* モバイルメニュー */
  var burger = $('#burger'), mnav = $('#mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var on = mnav.classList.toggle('on');
      burger.classList.toggle('on', on);
      burger.setAttribute('aria-expanded', on ? 'true' : 'false');
      document.body.style.overflow = on ? 'hidden' : '';
    });
    $$('[data-close]', mnav).forEach(function (a) {
      a.addEventListener('click', function () {
        mnav.classList.remove('on'); burger.classList.remove('on');
        burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
      });
    });
  }

  /* 出現アニメーション（失敗時は必ず表示されるようフォールバック） */
  var rv = $$('[data-rv]');
  if (!('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { el.classList.add('in'); }); }, 4000);
  }

  /* 数字のカウントアップ */
  var nums = $$('[data-cnt]');
  if (nums.length && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io2.unobserve(e.target);
        var el = e.target, to = parseInt(el.getAttribute('data-cnt'), 10) || 0;
        var suffix = el.querySelector('i') ? el.querySelector('i').outerHTML : '';
        var t0 = null, dur = 1100;
        if (to === 0) { el.innerHTML = '0' + suffix; return; }
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          var v = Math.round(to * (1 - Math.pow(1 - p, 3)));
          el.innerHTML = v + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io2.observe(n); });
  }

  /* 実績ギャラリーの絞り込み */
  var gal = $('#gal');
  if (gal) {
    $$('.filters button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.filters button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var f = b.getAttribute('data-f');
        $$('figure', gal).forEach(function (fig) {
          var show = (f === 'all' || fig.getAttribute('data-c') === f);
          fig.hidden = !show;
        });
      });
    });
  }

  /* 西暦 */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* 流入元を記録 */
  var src = document.getElementById('srcField');
  if (src) src.value = (document.referrer || 'direct') + ' | ' + location.pathname;

  /* 追加項目は message にまとめて送る（satei_send.php を変更せずに済ませるため） */
  var form = document.getElementById('sateiForm');
  if (form) {
    form.addEventListener('submit', function () {
      var ta = form.querySelector('textarea[name="message"]');
      if (!ta) return;
      var map = [['maker','メーカー'],['model','車種'],['year','年式'],['mileage','走行距離'],
                 ['shaken','車検'],['repair','状態'],['loan','ローン残債'],['color','カラー']];
      var lines = [];
      map.forEach(function (p) {
        var el = form.querySelector('[name="' + p[0] + '"]');
        if (el && el.value) lines.push(p[1] + '：' + el.value);
      });
      if (!lines.length) return;
      var block = '───── 車両情報 ─────\n' + lines.join('\n');
      ta.value = ta.value ? (ta.value + '\n\n' + block) : block;
    });
  }
})();
