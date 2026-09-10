/* Boon Events Kenya — booking request flow.
   Front-end only. Nothing is stored or posted anywhere; the final step hands a
   fully written message to WhatsApp so Mercy gets the details on first contact.

   The guest minimums and the 24-hour notice rule below are Mercy's own, taken
   from her "Kindly note" and FAQ highlights. */
(function () {
  'use strict';

  var form = document.getElementById('bk');
  if (!form) return;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var WA_NUMBER = '254111880403';
  var RATE_ADULT = 2500;
  var RATE_CHILD = 1600;

  var steps = $$('.bk__step', form);
  var dots = $$('.bk__dot', form);
  var bar = $('.bk__bar i', form);
  var btnNext = $('.bk__next', form);
  var btnBack = $('.bk__back', form);
  var btnSend = $('.bk__send', form);
  var live = $('.bk__live');

  var cur = 0;
  var last = steps.length - 1;   // the review step

  /* ------------------------------------------------------- field refs --- */
  var fDate = $('#f-date');
  var fAdults = $('#f-adults');
  var fKids = $('#f-kids');
  var fColours = $('#f-colours');
  var fNotes = $('#f-notes');
  var fName = $('#f-name');
  var fPhone = $('#f-phone');
  var fChurch = $('#f-church');
  var churchWrap = $('#church-wrap');

  var minNote = $('#min-note');
  var noticeNote = $('#notice-note');
  var estTotal = $('#est-total');
  var estLine = $('#est-line');
  var bubble = $('#bk-preview');

  /* date floor: today */
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  fDate.min = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  /* ---------------------------------------------------------- helpers --- */
  function val(name) {
    var el = form.elements[name];
    if (!el) return '';
    if (el.length && !el.value && el[0] && el[0].type === 'radio') {
      var picked = $$('input[name="' + name + '"]:checked', form)[0];
      return picked ? picked.value : '';
    }
    return el.value || '';
  }
  function pickedRadio(name) {
    var el = $('input[name="' + name + '"]:checked', form);
    return el ? el.value : '';
  }
  function money(n) { return n.toLocaleString('en-KE'); }

  function parseDate(v) {
    if (!v) return null;
    var p = v.split('-');
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d.getTime()) ? null : d;
  }
  function prettyDate(v) {
    var d = parseDate(v);
    if (!d) return '';
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  /* Mercy's rule: 10 adults minimum on weekends, 15 on weekdays. */
  function minAdults(v) {
    var d = parseDate(v);
    if (!d) return 10;
    var day = d.getDay();
    return (day === 0 || day === 6) ? 10 : 15;
  }

  /* ------------------------------------------------------- estimate ----- */
  function recalc() {
    var a = parseInt(fAdults.value, 10) || 0;
    var k = parseInt(fKids.value, 10) || 0;
    var total = a * RATE_ADULT + k * RATE_CHILD;
    estTotal.textContent = 'KES ' + money(total);

    var bits = [];
    if (a) bits.push(a + ' adult' + (a === 1 ? '' : 's') + ' × 2,500');
    if (k) bits.push(k + ' child' + (k === 1 ? '' : 'ren') + ' × 1,600');
    estLine.textContent = bits.length ? bits.join('  +  ') : 'Add your guest numbers to see an estimate';

    /* minimum-booking guidance, driven by the chosen date */
    var need = minAdults(fDate.value);
    var dayWord = need === 10 ? 'a weekend' : 'a weekday';
    var dayPlural = need === 10 ? 'weekends' : 'weekdays';
    if (fDate.value) {
      if (a && a < need) {
        minNote.hidden = false;
        minNote.className = 'note note--warn';
        minNote.querySelector('span').innerHTML =
          '<b>' + prettyDate(fDate.value).split(',')[0] + ' is ' + dayWord + '.</b> Mercy&rsquo;s minimum booking is ' +
          need + ' adults on ' + dayPlural + ', so you&rsquo;d need at least ' + need + '. You can still send this &mdash; she&rsquo;ll talk it through with you.';
      } else {
        minNote.hidden = false;
        minNote.className = 'note';
        minNote.querySelector('span').innerHTML =
          'That date falls on ' + dayWord + ', where the minimum booking is <b>' + need + ' adults</b>.';
      }
    } else {
      minNote.hidden = true;
    }

    /* 24-hour notice rule */
    var d = parseDate(fDate.value);
    if (d) {
      var diff = (d - today) / 86400000;
      noticeNote.hidden = diff > 1;
    } else {
      noticeNote.hidden = true;
    }

    /* the church-setup extra only makes sense for a wedding reception */
    var occ = pickedRadio('occasion');
    churchWrap.hidden = occ !== 'Wedding reception (AG / civil)';
    if (churchWrap.hidden) fChurch.checked = false;

    buildMessage();
  }

  /* ------------------------------------------------- message builder ---- */
  function messageText() {
    var L = [];
    L.push('Hi Mercy! I\'d like to request a date with Boon Events Kenya.');
    L.push('');
    var occ = pickedRadio('occasion');
    if (occ) L.push('Occasion: ' + occ);
    if (fDate.value) L.push('Preferred date: ' + prettyDate(fDate.value));

    var a = parseInt(fAdults.value, 10) || 0;
    var k = parseInt(fKids.value, 10) || 0;
    if (a || k) {
      var g = [];
      if (a) g.push(a + ' adult' + (a === 1 ? '' : 's'));
      if (k) g.push(k + ' child' + (k === 1 ? '' : 'ren'));
      L.push('Guests: ' + g.join(' and '));
    }

    var setting = pickedRadio('setting');
    if (setting) L.push('Setting: ' + setting);
    if (fColours.value.trim()) L.push('Theme colours: ' + fColours.value.trim());
    if (fChurch.checked) L.push('Also interested in: optional church setup (extra cost)');

    if (a || k) {
      L.push('');
      L.push('My own estimate at your published rates: KES ' + money(a * RATE_ADULT + k * RATE_CHILD));
    }

    if (fNotes.value.trim()) {
      L.push('');
      L.push('Notes: ' + fNotes.value.trim());
    }

    L.push('');
    if (fName.value.trim()) L.push('Name: ' + fName.value.trim());
    if (fPhone.value.trim()) L.push('Phone: ' + fPhone.value.trim());
    L.push('');
    L.push('Could you let me know if the date is still free? Thank you.');
    return L.join('\n');
  }

  function buildMessage() {
    bubble.textContent = messageText();
  }

  /* ------------------------------------------------------ validation ---- */
  function showErr(field, on, msg) {
    var wrap = field.closest('.fld');
    if (!wrap) return;
    var err = $('.fld__err', wrap);
    field.setAttribute('aria-invalid', on ? 'true' : 'false');
    if (err) {
      err.setAttribute('data-show', on ? 'true' : 'false');
      if (on && msg) err.textContent = msg;
    }
  }

  function validate(i) {
    var ok = true;
    if (i === 0) {
      if (!pickedRadio('occasion')) {
        ok = false;
        var g = $('#occ-err');
        g.setAttribute('data-show', 'true');
      }
    }
    if (i === 1) {
      if (!fDate.value) { showErr(fDate, true, 'Please pick a date so Mercy can check the venue.'); ok = false; }
      else { showErr(fDate, false); }
      var a = parseInt(fAdults.value, 10) || 0;
      var k = parseInt(fKids.value, 10) || 0;
      if (a + k < 1) { showErr(fAdults, true, 'Add at least one guest.'); ok = false; }
      else { showErr(fAdults, false); }
    }
    if (i === 4) {
      if (!fName.value.trim()) { showErr(fName, true, 'Mercy will want to know who she’s replying to.'); ok = false; }
      else { showErr(fName, false); }
      var p = fPhone.value.replace(/[^0-9+]/g, '');
      if (p.length < 9) { showErr(fPhone, true, 'Please add a number she can reach you on.'); ok = false; }
      else { showErr(fPhone, false); }
    }
    return ok;
  }

  /* ------------------------------------------------------ navigation ---- */
  function paint(dir) {
    steps.forEach(function (s, i) {
      if (i === cur) { s.setAttribute('data-dir', dir === -1 ? 'back' : 'fwd'); s.setAttribute('data-active', 'true'); }
      else { s.removeAttribute('data-active'); }
    });
    dots.forEach(function (d, i) {
      d.setAttribute('data-state', i === cur ? 'now' : (i < cur ? 'done' : 'todo'));
    });
    bar.style.width = ((cur) / last * 100) + '%';

    btnBack.hidden = cur === 0;
    btnNext.hidden = cur === last;
    btnSend.hidden = cur !== last;
    live.textContent = 'Step ' + (cur + 1) + ' of ' + steps.length + ': ' + dots[cur].textContent.trim();

    if (cur === last) fillSummary();

    // keep the step heading in view without yanking the whole page around
    var box = form.getBoundingClientRect();
    if (box.top < 0 || box.top > window.innerHeight * 0.6) {
      window.scrollTo({ top: window.pageYOffset + box.top - 90, behavior: 'smooth' });
    }
    var focusable = $('[data-active="true"] input, [data-active="true"] textarea, [data-active="true"] button:not(.step-n button)', form);
    if (focusable && cur !== 0) { try { focusable.focus({ preventScroll: true }); } catch (e) { } }
  }

  function go(d) {
    if (d > 0 && !validate(cur)) return;
    var nx = cur + d;
    if (nx < 0 || nx > last) return;
    cur = nx;
    paint(d);
  }

  btnNext.addEventListener('click', function () { go(1); });
  btnBack.addEventListener('click', function () { go(-1); });

  /* let Enter advance instead of submitting the form early */
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (cur === last) btnSend.click(); else go(1);
    }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  /* ---------------------------------------------------------- summary --- */
  function fillSummary() {
    var rows = [
      ['Occasion', pickedRadio('occasion')],
      ['Date', prettyDate(fDate.value)],
      ['Guests', (function () {
        var a = parseInt(fAdults.value, 10) || 0, k = parseInt(fKids.value, 10) || 0, g = [];
        if (a) g.push(a + ' adult' + (a === 1 ? '' : 's'));
        if (k) g.push(k + ' child' + (k === 1 ? '' : 'ren'));
        return g.join(' + ');
      })()],
      ['Setting', pickedRadio('setting')],
      ['Theme colours', fColours.value.trim()],
      ['Church setup', fChurch.checked ? 'Yes, please quote it' : ''],
      ['Your estimate', (function () {
        var a = parseInt(fAdults.value, 10) || 0, k = parseInt(fKids.value, 10) || 0;
        var t = a * RATE_ADULT + k * RATE_CHILD;
        return t ? 'KES ' + money(t) : '';
      })()],
      ['Name', fName.value.trim()],
      ['Phone', fPhone.value.trim()]
    ];
    var ul = $('#bk-summary');
    ul.innerHTML = rows.filter(function (r) { return r[1]; })
      .map(function (r) { return '<li><span>' + r[0] + '</span><b>' + escapeHtml(r[1]) + '</b></li>'; })
      .join('');
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ------------------------------------------------------------- send --- */
  btnSend.addEventListener('click', function () {
    if (!validate(4)) { cur = 4; paint(-1); return; }
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(messageText());
    window.open(url, '_blank', 'noopener');
    $('#bk-sent').hidden = false;
    btnSend.textContent = 'Reopen WhatsApp';
  });

  /* ------------------------------------------------------- steppers ----- */
  $$('.step-n').forEach(function (grp) {
    var input = $('input', grp);
    var minus = $('[data-dir="-1"]', grp);
    var plus = $('[data-dir="1"]', grp);
    var lo = parseInt(input.min, 10) || 0;
    var hi = parseInt(input.max, 10) || 150;
    var sync = function () {
      var v = parseInt(input.value, 10);
      if (isNaN(v)) v = lo;
      v = Math.max(lo, Math.min(hi, v));
      input.value = v;
      minus.disabled = v <= lo;
      plus.disabled = v >= hi;
      recalc();
    };
    minus.addEventListener('click', function () { input.value = (parseInt(input.value, 10) || 0) - 1; sync(); });
    plus.addEventListener('click', function () { input.value = (parseInt(input.value, 10) || 0) + 1; sync(); });
    input.addEventListener('input', recalc);
    input.addEventListener('change', sync);
    sync();
  });

  /* option cards advance the flow on their own — one tap, not two */
  $$('input[name="occasion"]', form).forEach(function (r) {
    r.addEventListener('change', function () {
      $('#occ-err').setAttribute('data-show', 'false');
      recalc();
      window.setTimeout(function () { if (cur === 0) go(1); }, 240);
    });
  });
  $$('input[name="setting"]', form).forEach(function (r) {
    r.addEventListener('change', recalc);
  });

  [fDate, fColours, fNotes, fName, fPhone].forEach(function (el) {
    el.addEventListener('input', recalc);
  });
  fChurch.addEventListener('change', recalc);

  recalc();
  paint(1);
})();
