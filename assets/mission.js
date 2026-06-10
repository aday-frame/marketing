/* FRAME · MISSION CONTROL — shared behaviors */
(function () {
  'use strict';

  // live UTC clock
  var clock = document.getElementById('clock');
  if (clock) {
    var tick = function () {
      var d = new Date();
      var p = function (n) { return String(n).padStart(2, '0'); };
      clock.textContent = p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()) + ':' + p(d.getUTCSeconds()) + ' UTC';
    };
    tick();
    setInterval(tick, 1000);
  }

  // scroll progress
  var progress = document.getElementById('progress');
  if (progress) {
    addEventListener('scroll', function () {
      var h = document.documentElement;
      progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    }, { passive: true });
  }

  // ticker loop
  var ticker = document.getElementById('ticker');
  if (ticker) ticker.innerHTML += ticker.innerHTML;

  // mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var mm = document.getElementById('mobileMenu');
  if (menuBtn && mm) {
    menuBtn.addEventListener('click', function () {
      mm.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });
    mm.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mm.classList.remove('open');
        menuBtn.classList.remove('open');
      });
    });
  }

  // count-up
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var decimals = (el.dataset.count.split('.')[1] || '').length;
    if (reduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // scroll reveal + count-up trigger
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
})();
