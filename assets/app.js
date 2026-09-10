/* Boon Events Kenya — shared behaviour. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------- splash ---- */
  var splash = $('.splash');
  if (splash) {
    var hide = function () {
      splash.setAttribute('data-done', 'true');
      window.setTimeout(function () { splash.remove(); }, 700);
    };
    // show it briefly even on a warm cache, so it reads as intentional rather than a flash
    if (document.readyState === 'complete') { window.setTimeout(hide, reduced ? 120 : 620); }
    else { window.addEventListener('load', function () { window.setTimeout(hide, reduced ? 120 : 620); }); }
    window.setTimeout(hide, 3500); // safety net if a stalled asset never fires load
  }

  /* ---------------------------------------------------------- header ---- */
  var hdr = $('.hdr');
  var nav = $('.nav');
  var burger = $('.burger');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
    });
    // close the panel after tapping a link, and on Esc
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        burger.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
        burger.focus();
      }
    });
  }

  if (hdr) {
    var lastY = window.pageYOffset;
    var ticking = false;
    var onScroll = function () {
      var y = window.pageYOffset;
      var menuOpen = burger && burger.getAttribute('aria-expanded') === 'true';
      hdr.classList.toggle('hdr--stuck', y > 8);
      // hide going down, bring it straight back on any upward scroll from anywhere
      if (!menuOpen && y > 260 && y > lastY + 6) { hdr.classList.add('hdr--hidden'); }
      else if (y < lastY - 6 || y < 120) { hdr.classList.remove('hdr--hidden'); }
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
  }

  /* ---------------------------------------------------------- reveal ---- */
  var revealables = $$('.rv');
  if (revealables.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('in'); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ------------------------------------------------------- counters ----- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        var el = en.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dec = (String(target).split('.')[1] || '').length;
        if (reduced) { el.textContent = target.toFixed(dec) + suffix; return; }
        var t0 = null, dur = 1250;
        var tick = function (ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) window.requestAnimationFrame(tick);
        };
        window.requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* -------------------------------------------------------- gallery ----- */
  var gal = $('.gal');
  if (gal) {
    var items = $$('.gal__item', gal);

    /* category filter tabs */
    var filterBtns = $$('.filters button');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        items.forEach(function (it) {
          var show = cat === 'all' || it.getAttribute('data-cat') === cat;
          it.hidden = !show;
        });
        visible = items.filter(function (it) { return !it.hidden; });
      });
    });

    /* fullscreen lightbox */
    var visible = items.slice();
    var lb = $('.lb');
    var lbImg = $('.lb__stage img', lb);
    var lbCap = $('.lb__cap p', lb);
    var lbCount = $('.lb__count', lb);
    var idx = 0;
    var opener = null;

    var render = function () {
      var el = visible[idx];
      if (!el) return;
      var img = $('img', el);
      lbImg.src = el.getAttribute('data-full');
      lbImg.alt = img ? img.alt : '';
      lbCap.textContent = el.getAttribute('data-caption') || '';
      lbCount.textContent = (idx + 1) + ' of ' + visible.length;
      // nudge the pop-in animation to replay on every change
      lbImg.style.animation = 'none';
      void lbImg.offsetWidth;
      lbImg.style.animation = '';
    };
    var open = function (el) {
      visible = items.filter(function (i) { return !i.hidden; });
      idx = visible.indexOf(el);
      if (idx < 0) idx = 0;
      opener = el;
      render();
      lb.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
      $('.lb__close', lb).focus();
    };
    var close = function () {
      lb.setAttribute('data-open', 'false');
      lb.removeAttribute('data-open');
      document.body.style.overflow = '';
      if (opener) opener.focus();
    };
    var move = function (d) {
      idx = (idx + d + visible.length) % visible.length;
      render();
    };

    items.forEach(function (el) {
      el.addEventListener('click', function () { open(el); });
    });
    $('.lb__close', lb).addEventListener('click', close);
    $('.lb__prev', lb).addEventListener('click', function () { move(-1); });
    $('.lb__next', lb).addEventListener('click', function () { move(1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb__stage')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (lb.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === 'ArrowRight') move(1);
    });
    // swipe on touch
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) move(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  /* ---------------------------------------------------------- films ----- */
  var films = $$('.film');
  if (films.length) {
    var players = films.map(function (f) { return $('video', f); });

    // autoplay muted once scrolled into view, pause when it leaves
    if ('IntersectionObserver' in window) {
      var vo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else { v.pause(); }
        });
      }, { threshold: 0.45 });
      players.forEach(function (v) { vo.observe(v); });
    }

    // only one film may have sound at a time
    var soloAudio = function (target) {
      players.forEach(function (v) {
        var on = v === target && v.muted;
        v.muted = !on;
        var wrap = v.closest('.film');
        var btn = $('.film__btn--sound', wrap);
        btn.setAttribute('aria-label', v.muted ? 'Turn sound on for this film' : 'Turn sound off for this film');
        btn.setAttribute('aria-pressed', String(!v.muted));
        $('.i-on', btn).hidden = v.muted;
        $('.i-off', btn).hidden = !v.muted;
      });
    };

    films.forEach(function (f) {
      var v = $('video', f);
      $('.film__btn--sound', f).addEventListener('click', function () { soloAudio(v); });
      $('.film__btn--full', f).addEventListener('click', function () { goFull(v); });
      v.addEventListener('click', function () { goFull(v); });
    });

    function goFull(v) {
      var fn = v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen || v.msRequestFullscreen;
      if (fn) {
        try { fn.call(v); } catch (e) { /* iOS Safari can refuse outside a gesture — harmless */ }
      }
      v.controls = true;
      var drop = function () {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) v.controls = false;
      };
      document.addEventListener('fullscreenchange', drop);
      document.addEventListener('webkitfullscreenchange', drop);
    }
  }

  /* -------------------------------------------------------- year -------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
