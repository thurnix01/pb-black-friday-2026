/*
 * Black Friday 2026 landing page
 * - Doorbuster cards switch between upcoming / live / expired on their own
 * - Top deals widget: rotating featured product + carousel
 * - Daily Brand Deals: today's brand discount cards (brand-sales-data.js)
 * - Doorbuster sign-up: the site's newsletter form (captcha + validation)
 * - Scroll reveal
 *
 * Preview any moment of the sale with ?preview=2026-11-24T09:30
 * (read as Pacific time; the clock keeps running from there).
 */
(function () {
  'use strict';

  var CONFIG = window.BF26_CONFIG || { utcOffset: '-08:00' };
  var DEALS = (window.BF26_DOORBUSTERS || []).filter(function (d) { return d.confirmed; });
  // Where images live when the page runs off the CDN (set in index.html); empty = relative to the page
  var ASSET_BASE = window.BF26_ASSET_BASE || '';
  var DAY_MS = 24 * 60 * 60 * 1000;
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Clock (real time, or a preview time that keeps ticking) ------------ */

  var clockOffset = 0;
  var previewParam = new URLSearchParams(window.location.search).get('preview');
  if (previewParam) {
    var hasZone = /(Z|[+-]\d\d:?\d\d)$/.test(previewParam);
    var previewTime = Date.parse(hasZone ? previewParam : previewParam + CONFIG.utcOffset);
    if (!isNaN(previewTime)) {
      clockOffset = previewTime - Date.now();
      showPreviewBadge(previewParam);
    }
  }

  function now() { return Date.now() + clockOffset; }

  /* --- Helpers ------------------------------------------------------------- */

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function asset(path) {
    return /^(https?:)?\/\//.test(path) ? path : ASSET_BASE + path;
  }

  function money(n) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  function percentOff(was, sale) {
    return Math.round((was - sale) / was * 100);
  }

  // "Wed, Nov 25" straight from the YYYY-MM-DD string, so it never shifts with the viewer's time zone
  function formatDay(ymd) {
    var p = ymd.split('-').map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return DAYS[d.getUTCDay()] + ', ' + MONTHS[p[1] - 1] + ' ' + p[2];
  }

  function formatCountdown(ms) {
    var total = Math.max(0, Math.floor(ms / 1000));
    var d = Math.floor(total / 86400);
    var h = Math.floor(total % 86400 / 3600);
    var m = Math.floor(total % 3600 / 60);
    var s = total % 60;
    var pad = function (x) { return (x < 10 ? '0' : '') + x; };
    return (d ? d + 'd ' : '') + pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  /* --- Doorbuster timing --------------------------------------------------- */

  DEALS.forEach(function (deal) {
    deal.start = Date.parse(deal.date + 'T00:00:00' + CONFIG.utcOffset);
    deal.end = deal.endsAt ? Date.parse(deal.endsAt) : deal.start + DAY_MS;
  });

  function stateOf(deal, t) {
    if (t < deal.start) return 'upcoming';
    if (deal.soldOut || t >= deal.end) return 'expired';
    return 'live';
  }

  /* --- Doorbuster card markup ---------------------------------------------- */

  function mediaHtml(deal) {
    if (deal.image) {
      return '<div class="bf26-deal__media"><img src="' + escapeHtml(asset(deal.image)) + '" alt=""></div>';
    }
    return '';
  }

  function cardHtml(deal, state, isNext, t) {
    if (state === 'upcoming' && isNext && CONFIG.teaseNext !== false) {
      // Next deal teaser: product is revealed, price stays locked until it goes live
      return '<div class="bf26-deal__inner">' +
        '<div class="bf26-deal__card">' +
          (deal.image ? '' : '<p class="bf26-deal__placeholder">' + escapeHtml(deal.brand) + '</p>') +
          '<div class="bf26-deal__info">' +
            '<span class="bf26-deal__soon">Coming soon</span>' +
            '<p class="bf26-deal__name">' + escapeHtml(deal.product) + '</p>' +
            '<p class="bf26-deal__locked">Price drops ' + formatDay(deal.date) + '</p>' +
          '</div>' +
          '<p class="bf26-deal__bar"><span data-unlock>Unlocks in ' + formatCountdown(deal.start - t) + '</span></p>' +
        '</div>' + mediaHtml(deal) +
      '</div>';
    }

    if (state === 'upcoming') {
      // Product and price stay hidden until the deal goes live
      return '<div class="bf26-deal__inner">' +
        '<div class="bf26-deal__card">' +
          '<p class="bf26-deal__day">' + formatDay(deal.date) + '</p>' +
          '<p class="bf26-deal__more">More Deals</p>' +
          '<p class="bf26-deal__bar"><span' + (isNext ? ' data-unlock' : '') + '>' +
            (isNext ? 'Unlocks in ' + formatCountdown(deal.start - t) : 'Coming soon') +
          '</span></p>' +
        '</div>' +
        '<img class="bf26-deal__question" src="' + asset('assets/ui/question-mark.svg') + '" width="113" height="206" alt="">' +
      '</div>';
    }

    var off = percentOff(deal.retail, deal.sale);
    var body =
      '<div class="bf26-deal__card">' +
        (deal.image ? '' : '<p class="bf26-deal__placeholder">' + escapeHtml(deal.brand) + '</p>') +
        '<div class="bf26-deal__info">' +
          '<p class="bf26-deal__name">' + escapeHtml(deal.product) + '</p>' +
          '<p class="bf26-deal__was">Was: ' + money(deal.retail) + '</p>' +
          '<p class="bf26-deal__sale">Sale: ' + money(deal.sale) + '</p>' +
        '</div>' +
        '<p class="bf26-deal__bar"><span>' +
          (state === 'live' ? 'Shop and Save ' + off + '%' : (deal.soldOut ? 'Sold out' : 'Deal ended')) +
        '</span></p>' +
      '</div>' + mediaHtml(deal);

    if (state === 'live') {
      return '<a class="bf26-deal__inner" href="' + escapeHtml(deal.url || '#') + '">' + body + '</a>';
    }
    return '<div class="bf26-deal__inner">' + body +
      '<div class="bf26-deal__stamp"><span>' + (deal.soldOut ? 'Sold out!' : 'Expired!') + '</span></div>' +
    '</div>';
  }

  /* --- Doorbusters --------------------------------------------------------- */

  // Cards line up as: next deal, today's deal, past deals (newest first).
  // Later "coming soon" deals stay hidden until they're next.
  var scroller = document.querySelector('[data-doorbusters]');
  var cards = [];
  var ORDER = { upcoming: 0, live: 1, expired: 2 };
  var MIN_CARDS = 3;

  function nextUpcoming() {
    return cards.filter(function (c) { return c.state === 'upcoming'; })[0];
  }

  function isNext(entry) {
    var next = nextUpcoming();
    return !!next && entry.state === 'upcoming' && entry.deal.start === next.deal.start;
  }

  function rankOf(entry) {
    if (entry.state === 'upcoming' && !isNext(entry)) return 3;
    return ORDER[entry.state];
  }

  function renderCard(entry, t, flip) {
    var el = entry.el;
    var label = entry.state === 'upcoming' ? 'coming soon' : entry.state === 'live' ? 'on sale now' : 'ended';
    var next = isNext(entry);
    el.className = 'bf26-deal is-' + entry.state +
      (next && CONFIG.teaseNext !== false ? ' is-teaser' : '') +
      (rankOf(entry) === 3 ? ' is-hidden' : '');
    el.setAttribute('aria-label', formatDay(entry.deal.date) + ' doorbuster, ' + label);
    el.innerHTML = cardHtml(entry.deal, entry.state, next, t);
    if (flip && !reducedMotion) {
      el.classList.add('is-changing');
      setTimeout(function () { el.classList.remove('is-changing'); }, 900);
    }
  }

  // Put the cards in order; the lead card (today's deal, or the next one before the sale) is the large one on phones
  function arrangeCards() {
    var ordered = cards.slice().sort(function (a, b) {
      return (rankOf(a) - rankOf(b)) ||
        (a.state === 'expired' ? b.deal.start - a.deal.start : a.deal.start - b.deal.start);
    });
    var lead = ordered.filter(function (c) { return c.state === 'live'; })[0] || ordered[0];
    ordered.forEach(function (entry, i) {
      entry.el.classList.toggle('is-lead', entry === lead && rankOf(entry) !== 3);
      entry.el.style.setProperty('--bf-delay', (i * 80) + 'ms');
      scroller.appendChild(entry.el);
    });

    // While later deals are still hidden, "More Deals / Coming Soon" cards fill the row out to three
    Array.prototype.slice.call(scroller.querySelectorAll('.is-placeholder')).forEach(function (el) {
      scroller.removeChild(el);
    });
    var shown = ordered.filter(function (c) { return rankOf(c) !== 3; }).length;
    var waiting = ordered.length - shown;
    for (var p = 0; p < Math.min(waiting, MIN_CARDS - shown); p++) {
      var ph = document.createElement('li');
      ph.className = 'bf26-deal is-placeholder';
      ph.setAttribute('aria-hidden', 'true');
      ph.style.setProperty('--bf-delay', ((shown + p) * 80) + 'ms');
      ph.innerHTML = '<div class="bf26-deal__inner"><div class="bf26-deal__card">' +
        '<p class="bf26-deal__soon-more"><span>More Deals</span>Coming Soon</p>' +
      '</div></div>';
      scroller.appendChild(ph);
    }
  }

  function layoutDoorbusters(t, changedEntries) {
    var animate = changedEntries && !reducedMotion;
    // Remember where each visible card sits, then slide it from there to its new place
    if (animate) {
      cards.forEach(function (entry) {
        entry.from = entry.el.getClientRects().length ? entry.el.getBoundingClientRect() : null;
      });
    }
    cards.forEach(function (entry) {
      renderCard(entry, t, !!changedEntries && changedEntries.indexOf(entry) !== -1);
    });
    arrangeCards();
    if (!animate) return;
    cards.forEach(function (entry) {
      var from = entry.from;
      if (!from || !entry.el.getClientRects().length) return; // newly shown cards fade in with bf26-card-in
      var to = entry.el.getBoundingClientRect();
      var zoom = parseFloat(getComputedStyle(entry.el).zoom) || 1; // translate is in the card's own (zoomed) pixels
      var dx = (from.left - to.left) / zoom;
      var dy = (from.top - to.top) / zoom;
      var scale = from.width / to.width;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(scale - 1) < .01) return;
      entry.el.animate([
        { transformOrigin: '0 0', transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + scale + ')' },
        { transformOrigin: '0 0', transform: 'none' }
      ], { duration: 900, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    });
  }

  function buildDoorbusters() {
    if (!scroller) return;
    var t = now();
    DEALS.forEach(function (deal) {
      cards.push({ deal: deal, el: document.createElement('li'), state: stateOf(deal, t) });
    });
    layoutDoorbusters(t, null);
  }

  function tickDoorbusters(t) {
    var changed = [];
    cards.forEach(function (entry) {
      var state = stateOf(entry.deal, t);
      if (state !== entry.state) {
        entry.state = state;
        changed.push(entry);
      }
    });
    if (changed.length) {
      layoutDoorbusters(t, changed);
      return;
    }
    cards.forEach(function (entry) {
      var unlock = isNext(entry) && entry.el.querySelector('[data-unlock]');
      if (unlock) unlock.textContent = 'Unlocks in ' + formatCountdown(entry.deal.start - t);
    });
  }

  /* --- Countdown line under the title -------------------------------------- */

  // The inner elements are built here because CMS editors strip empty <span>/<b> tags
  var cdLine = document.querySelector('[data-countdown-line]');
  if (cdLine) {
    cdLine.innerHTML =
      '<span class="bf26-countdown__dot" aria-hidden="true"></span>' +
      '<span data-countdown-label></span>' +
      '<b data-countdown-time></b>';
  }
  var cdLabel = cdLine && cdLine.querySelector('[data-countdown-label]');
  var cdTime = cdLine && cdLine.querySelector('[data-countdown-time]');

  function updateCountdownLine(t) {
    if (!cdLine) return;
    var live = cards.filter(function (c) { return c.state === 'live'; })[0];
    var next = nextUpcoming();
    if (live) {
      cdLabel.textContent = (live.deal.label ? live.deal.label + ' deal' : 'Today’s deal') + ' ends in';
      cdTime.textContent = formatCountdown(live.deal.end - t);
    } else if (next) {
      cdLabel.textContent = 'Next doorbuster drops in';
      cdTime.textContent = formatCountdown(next.deal.start - t);
    } else {
      cdLine.hidden = true;
      return;
    }
    cdLine.hidden = false;
  }

  /* --- Top Black Friday Deals ---------------------------------------------- */

  var ROTATE_MS = 6000;

  // The product list is the Bloomreach widget; the large panel cycles through its items
  function initTopDeals() {
    var featured = document.querySelector('[data-top-featured]');
    var widgetSlot = document.querySelector('[data-top-widget]');
    var progressBar = document.querySelector('.bf26-top__progress');
    var prev = document.querySelector('[data-top-prev]');
    var next = document.querySelector('[data-top-next]');
    if (!featured || !widgetSlot) return;

    var list = widgetSlot.querySelector('.scroll-container');
    var items = list ? Array.prototype.slice.call(list.querySelectorAll('.scroll-item')) : [];
    if (!items.length) {
      // Token not rendered (local preview) or the widget returned nothing
      featured.parentNode.classList.add('is-empty');
      widgetSlot.innerHTML = '<p class="bf26-top__empty">Top deals from Bloomreach appear here on performancebike.com.</p>';
      return;
    }

    // Works with both versions of the widget markup (class names with and without the leading underscore)
    function part(item, name) {
      return item.querySelector('.recommended-accessory-marketing-' + name + ', ._recommended-accessory-marketing-' + name);
    }

    // Prices: "Was / Sale" when the widget shows a strikethrough price, otherwise "From"
    function labelPrice(el) {
      if (!el || el.hasAttribute('data-bf26-price')) return;
      var was = el.querySelector('s');
      var rest = el.textContent.replace(was ? was.textContent : '', '');
      var amounts = rest.match(/\$[\d,]+(?:\.\d\d)?/g) || [];
      if (was && amounts.length) {
        // Keep an <s>: the widget's own scripts check for it to decide Add to Cart vs View Item
        el.innerHTML = '<s class="bf26-price__was">Was: ' + escapeHtml(was.textContent.trim()) + '</s>' +
          '<span class="bf26-price__sale">Sale: ' + escapeHtml(amounts[0]) + '</span>';
      } else if (amounts.length) {
        el.innerHTML = '<span class="bf26-price__line"><span class="bf26-price__from">From </span>' +
          '<span class="bf26-price__sale">' + escapeHtml(amounts[0]) + '</span></span>';
      }
      el.setAttribute('data-bf26-price', '');
    }
    items.forEach(function (item) { labelPrice(part(item, 'price')); });

    // Read each product when it's shown: the widget's scripts rename titles and buttons after load
    function productOf(item) {
      var img = item.querySelector('img');
      var title = part(item, 'title');
      var link = title || item.querySelector('a[href]');
      var button = part(item, 'button');
      var price = part(item, 'price');
      var copy = part(item, 'copy');
      return {
        id: copy ? copy.getAttribute('data-id') : '',
        name: title ? title.textContent.trim() : '',
        url: link ? link.href : '#',
        // The widget asks the image CDN for 400px; the large panel needs a sharper copy
        image: img ? img.src.replace(/width=\d+/, 'width=600') : '',
        price: price ? price.innerHTML : '',
        cta: button ? button.textContent.trim() : 'View Item',
        sale: !!item.querySelector('._sale-tag_01, .pb_clearance_tag')
      };
    }
    var active = 0;
    var paused = false;
    var stopped = false; // the pause button; stays until pressed again
    var elapsed = 0;
    var timer = document.createElement('span');
    timer.className = 'bf26-top__timer';

    // The list works as a queue: the featured item is collapsed out of it, and the
    // item it replaces rejoins at the end, so the list steps along one item at a time
    function show(i, advance) {
      var previous = items[active];
      active = (i + items.length) % items.length;
      var p = productOf(items[active]);
      var url = escapeHtml(p.url);
      var addToCart = /add to cart/i.test(p.cta) && p.id && typeof window.AddToCart === 'function';
      featured.innerHTML =
        '<div class="bf26-feature">' +
          '<a class="bf26-feature__media" href="' + url + '">' +
            (p.sale ? '<span class="bf26-feature__tag" aria-hidden="true"></span>' : '') +
            '<img class="bf26-feature__img" src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.name) + '">' +
          '</a>' +
          '<p class="bf26-feature__name"><a href="' + url + '">' + escapeHtml(p.name) + '</a></p>' +
          (p.price ? '<p class="bf26-feature__price">' + p.price + '</p>' : '') +
          '<div class="bf26-feature__actions">' +
            '<a class="bf26-cart" href="' + url + '"><span>' + escapeHtml(addToCart ? p.cta : 'View Item') + '</span></a>' +
            '<button class="bf26-pause" type="button" data-top-pause aria-pressed="' + stopped + '" aria-label="' +
              (stopped ? 'Play rotating deals' : 'Pause rotating deals') + '"></button>' +
          '</div>' +
        '</div>';
      if (addToCart) {
        // Same add-to-cart call as the widget's own button
        featured.querySelector('.bf26-cart').addEventListener('click', function (e) {
          e.preventDefault();
          window.AddToCart(this, +p.id, 0, 1);
        });
      }
      featured.appendChild(timer);
      if (advance && previous !== items[active]) {
        list.appendChild(previous); // still collapsed, so the move is invisible; it then opens at the end
        previous.classList.remove('is-active');
        if (list.scrollLeft > 0) list.scrollTo({ left: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
      }
      items[active].classList.add('is-active');
      elapsed = 0;
    }

    // Rotation clock: the orange line under the panel shows progress to the next item.
    // Hovering the widget or hiding the tab pauses it
    var TICK_MS = 100;
    setInterval(function () {
      if (paused || stopped || document.hidden) return;
      elapsed += TICK_MS;
      if (elapsed >= ROTATE_MS) {
        var upNext = list.querySelector('.scroll-item:not(.is-active)'); // first item still in the list
        if (upNext) show(items.indexOf(upNext), true);
      }
      timer.style.transform = 'scaleX(' + Math.min(1, elapsed / ROTATE_MS) + ')';
    }, TICK_MS);

    var widget = featured.parentNode;
    // Mouse hover only: a tap on a phone fires mouseenter but no mouseleave until you tap elsewhere,
    // which left the rotation paused for good
    widget.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') paused = true; });
    widget.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') paused = false; });

    // Pause / play the rotation (the panel is re-rendered each step, so listen on the panel)
    featured.addEventListener('click', function (e) {
      var button = e.target.closest('[data-top-pause]');
      if (!button) return;
      stopped = !stopped;
      button.setAttribute('aria-pressed', stopped);
      button.setAttribute('aria-label', stopped ? 'Play rotating deals' : 'Pause rotating deals');
      featured.classList.toggle('is-stopped', stopped);
    });


    // Our arrows + progress line drive the widget's list
    var progress = progressBar && progressBar.querySelector('span');
    if (progressBar && !progress) {
      progress = document.createElement('span');
      progressBar.appendChild(progress);
    }
    function step() {
      return (items[0].offsetWidth + 14) * 2;
    }
    function updateProgress() {
      var max = list.scrollWidth - list.clientWidth;
      var visible = list.clientWidth / Math.max(1, list.scrollWidth);
      if (progress) {
        progress.style.width = (visible * 100) + '%';
        progress.style.left = (max > 0 ? (list.scrollLeft / max) * (1 - visible) * 100 : 0) + '%';
      }
      if (prev) prev.disabled = list.scrollLeft <= 4;
      if (next) next.disabled = list.scrollLeft >= max - 4;
    }
    if (prev) prev.addEventListener('click', function () { list.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { list.scrollBy({ left: step(), behavior: 'smooth' }); });
    list.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    window.addEventListener('load', updateProgress); // widget images change the list width once loaded

    // The first featured item starts collapsed without animating
    var started = false;
    function start() {
      if (started) { show(active); return; } // later call: re-read the item the widget just updated
      started = true;
      list.classList.add('bf26-instant');
      show(0);
      setTimeout(function () { list.classList.remove('bf26-instant'); }, 50);
      updateProgress();
    }
    // The widget's scripts shorten titles and swap buttons on DOMContentLoaded. With Cloudflare's Rocket Loader
    // that event can fire after this runs, so start now if the page is ready and refresh when it fires
    document.addEventListener('DOMContentLoaded', start);
    if (document.readyState !== 'loading') start();
  }

  /* --- Daily Brand Deals --------------------------------------------------- */

  var BRAND_LINK = 'https://www.performancebike.com/black-friday/c16804?fb={id}&lg=fb#scroll-to-results';

  // Today's date in Pacific time as YYYY-MM-DD (the sheet's days switch at midnight Pacific)
  function saleDay(t) {
    var m = /([+-])(\d\d):?(\d\d)/.exec(CONFIG.utcOffset || '-08:00');
    var offset = (m[1] === '-' ? -1 : 1) * (m[2] * 60 + +m[3]) * 60000;
    return new Date(t + offset).toISOString().slice(0, 10);
  }

  // "Fizik (20-25% off)" -> { brand: 'Fizik', label: '20-25% off' }; variants like "Shimano FTW" use their parent's card
  function parseBrandTile(text) {
    var m = /^(.*?)\s*(?:\((.*)\))?$/.exec(text);
    var info = (window.BF26_BRANDS || {})[m[1]] || {};
    var label = m[2] && !/^deals$/i.test(m[2]) ? m[2].replace(/^~/, 'Up to ') : '';
    return { brand: info.as || m[1], label: label && info.note ? label + ' ' + info.note : label };
  }

  function brandTilesFor(day) {
    var days = window.BF26_BRAND_DAYS || {};
    var keys = Object.keys(days).sort();
    if (!keys.length) return [];
    // Before the first day / after the last, show the nearest one
    var key = day < keys[0] ? keys[0] : day > keys[keys.length - 1] ? keys[keys.length - 1] : day;
    while (!days[key]) key = keys.filter(function (k) { return k < key; }).pop();
    var dayTiles = days[key].map(parseBrandTile);
    var tiles = [];
    // Everyday brands first; a brand tile for the same brand that day takes its place
    (window.BF26_EVERYDAY_BRANDS || []).forEach(function (every) {
      var matches = dayTiles.filter(function (t) { return t.brand === every.name; });
      if (matches.length) {
        matches.forEach(function (t) { t.used = true; tiles.push(t); });
        return;
      }
      var sale = (every.sales || []).filter(function (w) { return day >= w.from && day <= w.to; })[0];
      tiles.push({ brand: every.name, label: sale ? sale.label : '' });
    });
    dayTiles.forEach(function (t) { if (!t.used) tiles.push(t); });
    return tiles;
  }

  function brandCardHtml(tile) {
    var info = (window.BF26_BRANDS || {})[tile.brand];
    if (!info || !info.logo) return '';
    var label = tile.label || 'Shop deals';
    var size = label.length > 16 ? ' is-longer' : label.length > 10 ? ' is-long' : '';
    return '<li class="bf26-bsale"><a href="' + BRAND_LINK.replace('{id}', info.id) + '">' +
      '<span class="bf26-bsale__logo"><img src="' + escapeHtml(asset(info.logo)) + '" alt="' + escapeHtml(tile.brand) + '" loading="lazy"></span>' +
      '<span class="bf26-bsale__off' + size + '"><span>' + escapeHtml(label) + '</span></span>' +
    '</a></li>';
  }

  function initBrandSales() {
    var grid = document.querySelector('[data-brand-sales]');
    if (grid) grid.innerHTML = brandTilesFor(saleDay(now())).map(brandCardHtml).join('');
  }

  /* --- Doorbuster sign-up ---------------------------------------------------- */

  // The form is in index.html (copied from the site's newsletter pop-up form). Here: render the reCAPTCHA,
  // unlock the button once it's solved, and use the site's validation when it's on the page.
  function initSignup() {
    var form = document.querySelector('[data-signup]');
    if (!form) return;
    var button = form.querySelector('[type=submit]');
    var captcha = form.querySelector('.bf26-recaptcha');
    var captchaId = null;

    window.BF26_solveCaptcha = function (response) {
      form.querySelector('[name=RecaptchaResponse]').value = response;
      button.classList.remove('css-button-disabled');
    };
    window.BF26_renderCaptcha = function () {
      if (captcha && !captcha.hasChildNodes() && window.grecaptcha && grecaptcha.render) {
        captchaId = grecaptcha.render(captcha, {
          sitekey: captcha.getAttribute('data-sitekey'),
          callback: 'BF26_solveCaptcha',
          'expired-callback': function () { button.classList.add('css-button-disabled'); }
        });
      }
    };
    if (window.grecaptcha && grecaptcha.render) {
      window.BF26_renderCaptcha();
    } else {
      var s = document.createElement('script');
      s.src = 'https://www.google.com/recaptcha/api.js?onload=BF26_renderCaptcha&render=explicit';
      s.async = true;
      document.body.appendChild(s);
    }

    var $ = window.jQuery;
    if ($ && $.validator && $.validator.unobtrusive) $.validator.unobtrusive.parse($(form));

    // Sent in the background so the shopper stays on this page; a message confirms it instead of the
    // /newsletter-signup page. If the request can't be made at all, the form submits the normal way.
    var sending = false;
    form.addEventListener('submit', function (e) {
      if (button.classList.contains('css-button-disabled') || sending) { e.preventDefault(); return; } // captcha not done yet
      if ($ && $.fn && $.fn.valid && !$(form).valid()) return; // site validation shows the messages and stops the submit
      if (!window.fetch) return;
      e.preventDefault();
      if (window.trackEvent) window.trackEvent('bf26-doorbuster-signup-submit', 'submit-form');
      sending = true;
      button.classList.add('css-button-disabled');
      fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(form)),
        credentials: 'same-origin'
      }).then(function (res) {
        return res.text().then(function (html) {
          // The site answers with its "Thanks for signing up" page
          if (!res.ok || !/thanks for signing up/i.test(html)) throw new Error('signup ' + res.status);
          form.reset();
          showSignupMessage('Best deals are coming your way!');
        });
      }).catch(function (err) {
        console.error('[bf26] signup failed:', err);
        showSignupMessage('Something went wrong. Please try again.', true);
      }).then(function () {
        sending = false;
        form.querySelector('[name=RecaptchaResponse]').value = '';
        if (captchaId !== null && window.grecaptcha) grecaptcha.reset(captchaId); // each captcha answer works once
      });
    });
  }

  // Message over the page that closes itself after 4 seconds (or on click / Escape)
  function showSignupMessage(text, isError) {
    var old = document.querySelector('.bf26-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'bf26-toast' + (isError ? ' is-error' : '');
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<p class="bf26-toast__box">' + escapeHtml(text) + '</p>';
    document.getElementById('bf26').appendChild(toast);
    function close() {
      document.removeEventListener('keydown', onKey);
      toast.classList.add('is-closing');
      setTimeout(function () { toast.remove(); }, 300);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    toast.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    setTimeout(close, 4000);
  }

  /* --- Scroll reveal ------------------------------------------------------- */

  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    items.forEach(function (el) {
      if (el.tagName === 'LI') {
        var index = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.setProperty('--bf-delay', (index * 80) + 'ms');
      }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* --- Jump links into the results (#scroll-to-results) -------------------- */

  // This page sits above the site's search results, and the brand / category links come back to it with
  // #scroll-to-results. The browser jumps there straight away, but this page then grows (cards built, images
  // and fonts loaded) and pushes the results down, so the jump lands short. Re-align while the page settles,
  // and stop as soon as the shopper scrolls on their own.
  function initAnchorFix() {
    var id = decodeURIComponent(window.location.hash.slice(1));
    var page = document.getElementById('bf26');
    if (!id || !page || !window.ResizeObserver) return;
    var done = false;
    function stop() { done = true; if (observer) observer.disconnect(); }
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (type) {
      window.addEventListener(type, stop, { once: true, passive: true });
    });
    function align() {
      if (done) return;
      var target = document.getElementById(id);
      // Only targets below this page; links within the page itself are left alone
      if (!target || !(page.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
      var top = target.getBoundingClientRect().top + window.pageYOffset - (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
      if (Math.abs(window.pageYOffset - top) > 2) window.scrollTo({ top: top, behavior: 'instant' });
    }
    var observer = new ResizeObserver(align);
    observer.observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
    if (document.readyState === 'complete') {
      setTimeout(stop, 4000);
    } else {
      window.addEventListener('load', function () {
        align();
        setTimeout(stop, 4000); // late changes after this are left alone
      });
    }
    align();
  }

  /* --- Results filter that's always on (jump-off pages) -------------------- */

  // <main id="bf26" data-results-filter="fs2"> ticks that filter (fs2 = On Special) in the results below
  // when the page opens. A filtered address (?fs=2) can't be used instead: the site drops this page's
  // content from it. So the box is ticked here, the site reloads the results itself, and the address
  // stays the plain page URL so a refresh or shared link still shows this page.
  // The site wires up its checkboxes a moment after load, so a click that doesn't send the site's
  // results request is undone and tried again.
  function initResultsFilter() {
    var page = document.getElementById('bf26');
    var value = page && page.getAttribute('data-results-filter');
    if (!value) return;
    var RESULTS_REQUEST = /search-results\/load-page/;
    var tries = 0;
    var sent = false;
    var open = XMLHttpRequest.prototype.open;
    var push = window.history.pushState;
    var url = window.location.href;

    function stop() {
      XMLHttpRequest.prototype.open = open;
      window.history.pushState = push;
    }
    function attempt() {
      var box = document.querySelector('input[type=checkbox][value="' + value + '"]');
      if (box && !box.checked) {
        sent = false;
        box.click();
        setTimeout(function () {
          if (sent) return setTimeout(stop, 4000); // let the site finish updating the address first
          box.checked = false; // not wired up yet: undo and try again
          retry();
        }, 300);
      } else if (!box) {
        retry();
      } else {
        stop(); // already ticked
      }
    }
    function retry() {
      if (++tries < 30) setTimeout(attempt, 300);
      else stop();
    }

    XMLHttpRequest.prototype.open = function (method, address) {
      if (RESULTS_REQUEST.test(address)) sent = true;
      return open.apply(this, arguments);
    };
    window.history.pushState = function (state, title) {
      window.history.replaceState(state, title, url);
    };
    if (document.readyState === 'complete') attempt();
    else window.addEventListener('load', attempt, { once: true });
  }

  /* --- Preview badge ------------------------------------------------------- */

  function showPreviewBadge(value) {
    var badge = document.createElement('div');
    badge.className = 'bf26-preview';
    badge.innerHTML = 'Preview mode: <b>' + escapeHtml(value) + '</b> PT';
    document.body.appendChild(badge);
  }

  /* --- Go ------------------------------------------------------------------ */

  // Each part starts on its own so one failure (e.g. markup changed by the CMS) can't blank the rest of the page
  function safely(fn, arg) {
    try { fn(arg); } catch (err) { console.error('[bf26] ' + (fn.name || 'init') + ' failed:', err); }
  }

  safely(buildDoorbusters);
  safely(updateCountdownLine, now());
  safely(initTopDeals);
  safely(initBrandSales);
  safely(initSignup);
  safely(initReveal);
  safely(initAnchorFix);
  safely(initResultsFilter);

  setInterval(function () {
    var t = now();
    safely(tickDoorbusters, t);
    safely(updateCountdownLine, t);
  }, 1000);
})();
