/* FRAME · MISSION CONTROL — shared behaviors */
(function () {
  'use strict';

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

  // ── request access modal ──
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/aday@castellomgmt.com';
  document.body.insertAdjacentHTML('beforeend',
    '<div class="access-modal" id="accessModal" role="dialog" aria-modal="true" aria-labelledby="accessTitle">' +
      '<div class="access-panel hud">' +
        '<div class="access-head">' +
          '<div class="access-title" id="accessTitle">Request access</div>' +
          '<button class="access-close" type="button" aria-label="Close">ESC ✕</button>' +
        '</div>' +
        '<div class="access-sub">INVITATION ONLY · WHITE-GLOVE ONBOARDING<br />REPLIES WITHIN ONE BUSINESS DAY</div>' +
        '<form id="accessForm" novalidate>' +
          '<input type="text" name="_honey" id="af-hp" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;width:0;opacity:0;" />' +
          '<div class="access-field"><label for="af-name">NAME</label>' +
            '<input id="af-name" name="name" type="text" autocomplete="name" required /></div>' +
          '<div class="access-field"><label for="af-contact">CONTACT — EMAIL OR PHONE</label>' +
            '<input id="af-contact" name="contact" type="text" autocomplete="email" required /></div>' +
          '<div class="access-field"><label for="af-message">HOW DO YOU PLAN TO USE FRAME?</label>' +
            '<textarea id="af-message" name="message" required></textarea></div>' +
          '<button class="btn-launch access-submit" type="submit">TRANSMIT REQUEST →</button>' +
          '<div class="access-status" id="accessStatus"></div>' +
        '</form>' +
      '</div>' +
    '</div>');

  var modal = document.getElementById('accessModal');
  var form = document.getElementById('accessForm');
  var status = document.getElementById('accessStatus');
  var submitBtn = form.querySelector('.access-submit');

  var openedAt = 0;
  function openModal(e) {
    if (e) e.preventDefault();
    openedAt = Date.now();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { document.getElementById('af-name').focus(); }, 320);
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-access]').forEach(function (el) {
    el.addEventListener('click', openModal);
  });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  modal.querySelector('.access-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  function showSuccess() {
    form.querySelectorAll('.access-field, .access-submit').forEach(function (el) { el.style.display = 'none'; });
    status.className = 'access-status ok';
    status.textContent = 'REQUEST RECEIVED. WE REPLY WITHIN ONE BUSINESS DAY.';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('af-name').value.trim();
    var contact = document.getElementById('af-contact').value.trim();
    var message = document.getElementById('af-message').value.trim();
    status.className = 'access-status';
    // spam gates: honeypot filled or submitted inhumanly fast → pretend success, send nothing
    if (document.getElementById('af-hp').value || Date.now() - openedAt < 3000) {
      showSuccess();
      return;
    }
    if (!name || !contact || !message) {
      status.className = 'access-status err';
      status.textContent = 'ALL FIELDS REQUIRED.';
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'TRANSMITTING…';
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: name,
        contact: contact,
        message: message,
        _subject: 'Frame — Access Request from ' + name
      })
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function () {
      showSuccess();
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'TRANSMIT REQUEST →';
      status.className = 'access-status err';
      status.innerHTML = 'TRANSMISSION FAILED. EMAIL US DIRECTLY: <a href="mailto:aday@castellomgmt.com">ADAY@CASTELLOMGMT.COM</a>';
    });
  });
})();
