/**
 * shell.js — JAHIM TRADER shell
 *
 *  • Menu tab + four tabs that host the REAL Deriv templates (t/<name>/) in iframes
 *  • Login happens INSIDE a template (its own button). Deriv's auth page can't be framed, so the
 *    templates were patched to navigate the top window; Deriv then returns to the site root with
 *    ?code=…&state=…  and this shell hands that callback to the template that started the login.
 *  • Session bridge: the Accumulators / Digits / Rise-Fall templates keep their session in
 *    localStorage, the Bot keeps it in sessionStorage with different units. The shell copies one to
 *    the other so a single login serves all four tabs (and a logout clears all of them).
 */
(function () {
  'use strict';

  var TPL = {
    'tab-accumulators': { path: 't/accumulators/', family: 'next' },
    'tab-bot':          { path: 't/bot/',          family: 'bot'  },
    'tab-digits':       { path: 't/digits/',       family: 'next' },
    'tab-risefall':     { path: 't/risefall/',     family: 'next' },
  };
  var TAB_KEY = 'jahim_tab';

  /* storage keys that make up a session in each template family */
  var NEXT_LS = ['auth_info', 'deriv_accounts', 'active_loginid', 'account_type'];
  var BOT_LS  = ['authToken', 'active_loginid', 'account_type', 'accountsList', 'clientAccounts', 'client.country', 'callback_token', 'client_account_details'];
  var BOT_SS  = ['auth_info', 'deriv_accounts'];

  var frames = {};            // tabId -> {wrap, iframe}
  var currentTab = null;

  /* ───────────── helpers ───────────── */
  function toast(msg) {
    var box = document.getElementById('shell-toast');
    if (!box) return;
    var el = document.createElement('div');
    el.className = 'sh-toast';
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 5000);
  }
  window.shellToast = toast;

  function readJSON(store, key) {
    try { var raw = store.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  /* ───────────── theme + misc (unchanged from the old site) ───────────── */
  window.toggleTheme = function () {
    var html = document.documentElement;
    var dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    syncTheme();
    try { localStorage.setItem('jahim_theme', dark ? 'light' : 'dark'); } catch (e) {}
  };
  function syncTheme() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var lbl = document.getElementById('menu-theme-label');
    var thumb = document.getElementById('menu-theme-thumb');
    if (lbl) lbl.textContent = dark ? 'Dark Mode' : 'Light Mode';
    if (thumb) thumb.style.transform = dark ? 'translateX(18px)' : 'translateX(0px)';
  }

  function startEmojiRain() {
    setInterval(function () {
      var m = document.getElementById('menu-tab');
      if (!m || !m.classList.contains('active')) return;
      var e = document.createElement('div');
      e.textContent = '💵';
      e.className = 'falling-emoji';
      e.style.left = Math.random() * 100 + 'vw';
      e.style.animation = 'fall ' + (Math.random() * 5 + 5) + 's linear forwards';
      document.body.appendChild(e);
      setTimeout(function () { e.remove(); }, 10000);
    }, 500);
  }

  window.copyText = function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = el.textContent;
    var p = navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject();
    p.then(function () { toast('Copied'); }, function () { toast('Copy failed — select the text and copy it manually'); });
  };

  /* ───────────── iframe tabs ───────────── */
  function makeFrame(tabId, search) {
    if (frames[tabId]) return frames[tabId];
    var wrap = document.createElement('div');
    wrap.className = 'frame-wrap';
    wrap.id = 'frame-' + tabId;
    var ifr = document.createElement('iframe');
    ifr.title = tabId.replace('tab-', '');
    ifr.setAttribute('allow', 'clipboard-read; clipboard-write; fullscreen; autoplay');
    ifr.src = TPL[tabId].path + (search || '');
    wrap.appendChild(ifr);
    document.getElementById('stage').appendChild(wrap);
    frames[tabId] = { wrap: wrap, iframe: ifr };
    return frames[tabId];
  }

  window.showTab = function (tabId) {
    var isTpl = !!TPL[tabId];
    if (isTpl) { bridgeNow(); makeFrame(tabId); }
    document.querySelectorAll('.menu li a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-tab') === tabId);
    });
    var menu = document.getElementById('menu-tab');
    if (menu) menu.classList.toggle('active', tabId === 'menu-tab');
    Object.keys(frames).forEach(function (id) { frames[id].wrap.classList.toggle('active', id === tabId); });
    currentTab = tabId;
    try { sessionStorage.setItem(TAB_KEY, tabId); } catch (e) {}
  };

  function reloadFrames(family) {
    Object.keys(frames).forEach(function (id) {
      if (!family || TPL[id].family === family) frames[id].iframe.src = TPL[id].path;
    });
  }

  /* ───────────── OAuth callback hand-off ───────────── */
  function handleCallback() {
    var q = new URLSearchParams(location.search);
    if (!q.has('code') && !q.has('error')) return null;
    var tab = null;
    try { tab = sessionStorage.getItem(TAB_KEY); } catch (e) {}
    if (!TPL[tab]) tab = 'tab-risefall';
    var search = location.search;
    history.replaceState({}, document.title, location.pathname);
    makeFrame(tab, search);          // the template completes the code exchange itself
    return tab;
  }

  /* ───────────── session bridge ───────────── */
  function nextAuth() {
    var a = readJSON(localStorage, 'auth_info');
    if (!a || !a.access_token) return null;
    if (a.expires_at && a.expires_at * 1000 <= Date.now()) return null;     // seconds
    return a;
  }
  function botAuth() {
    var a = readJSON(sessionStorage, 'auth_info');
    if (!a || !a.access_token) return null;
    if (a.expires_at && a.expires_at <= Date.now()) return null;            // milliseconds
    return a;
  }

  function bridgeToBot(a) {
    var copy = {};
    Object.keys(a).forEach(function (k) { copy[k] = a[k]; });
    if (a.expires_at) copy.expires_at = a.expires_at * 1000;
    ssSet('auth_info', JSON.stringify(copy));
    var acc = lsGet('deriv_accounts');
    if (acc) ssSet('deriv_accounts', acc);
  }
  function bridgeToNext(a) {
    var copy = {};
    Object.keys(a).forEach(function (k) { copy[k] = a[k]; });
    if (a.expires_at) copy.expires_at = Math.floor(a.expires_at / 1000);
    lsSet('auth_info', JSON.stringify(copy));
    try { var acc = sessionStorage.getItem('deriv_accounts'); if (acc) lsSet('deriv_accounts', acc); } catch (e) {}
  }

  function clearFamily(family) {
    try {
      if (family === 'next') NEXT_LS.forEach(function (k) { localStorage.removeItem(k); });
      else {
        BOT_LS.forEach(function (k) { localStorage.removeItem(k); });
        BOT_SS.forEach(function (k) { sessionStorage.removeItem(k); });
      }
    } catch (e) {}
  }

  var prev = null;      // {n, b} from the previous poll
  function bridgeNow() {
    var n = !!nextAuth(), b = !!botAuth();
    if (!prev) {                                   // first look: just make both sides agree
      if (n && !b) bridgeToBot(nextAuth());
      else if (b && !n) bridgeToNext(botAuth());
    } else if (n !== prev.n && b === prev.b) {     // only the Next-family changed
      if (n) { bridgeToBot(nextAuth()); reloadFrames('bot'); }
      else { clearFamily('bot'); reloadFrames('bot'); }
    } else if (b !== prev.b && n === prev.n) {     // only the Bot changed
      if (b) { bridgeToNext(botAuth()); reloadFrames('next'); }
      else { clearFamily('next'); reloadFrames('next'); }
    }
    n = !!nextAuth(); b = !!botAuth();
    prev = { n: n, b: b };
    paintSession(n || b);
  }

  function paintSession(on) {
    var box = document.getElementById('nav-session');
    var txt = document.getElementById('nav-session-txt');
    var btn = document.getElementById('nav-logout');
    if (box) box.classList.toggle('on', on);
    if (txt) txt.textContent = on ? 'Logged in' : 'Logged out';
    if (btn) btn.hidden = !on;
  }

  window.logoutAll = function () {
    clearFamily('next'); clearFamily('bot');
    try { localStorage.removeItem('auth_info'); sessionStorage.removeItem('auth_info'); } catch (e) {}
    prev = { n: false, b: false };
    paintSession(false);
    reloadFrames();
    toast('Logged out');
  };

  /* ───────────── boot ───────────── */
  function boot() {
    document.getElementById('stage').innerHTML = buildMenuTab();
    try {
      var saved = localStorage.getItem('jahim_theme');
      if (saved === 'dark' || saved === 'light') document.documentElement.setAttribute('data-theme', saved);
    } catch (e) {}
    var a = document.getElementById('setup-appid'), r = document.getElementById('setup-redirect');
    if (a) a.textContent = window.JAHIM_APP_ID;
    if (r) r.textContent = location.origin;
    syncTheme();
    startEmojiRain();

    bridgeNow();
    setInterval(bridgeNow, 1200);

    var cbTab = handleCallback();
    showTab(cbTab || 'menu-tab');

    if (typeof loaderDone === 'function') loaderDone();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
