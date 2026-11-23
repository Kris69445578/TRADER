/**
 * menu.js — the Menu (home) tab of the shell.
 * The four template tabs are the real Deriv templates, loaded in iframes by shell.js.
 */
var JAHIM_APP_ID = '350K1vjYSPxXbn8jLnfYN';   /* shown in the setup box only — the value baked into the builds is in each template's .env */
var JAHIM_LINKS = {
  signup:    'https://track.deriv.com/_j_K_n50wBctMjdsyM5hasGNd7ZgqdRLk/1/',
  dashboard: 'https://developers.deriv.com/dashboard/',
  deriv:     'https://app.deriv.com/',
  whatsapp:  'https://chat.whatsapp.com/IofZic4i8Uo2Rk4uawPG05'
};

function buildMenuTab() {
  var L = JAHIM_LINKS;
  return `
<div id="menu-tab" class="tab-content active">
  <div class="menu-tab-wrapper">

    <div style="display:flex;justify-content:flex-end;margin-bottom:1.2rem;">
      <div onclick="toggleTheme()" id="menu-theme-track"
        style="display:flex;align-items:center;gap:10px;padding:8px 16px;
        background:var(--bg-card);border:1px solid var(--border);border-radius:30px;
        cursor:pointer;transition:all 0.2s;user-select:none;">
        <span style="font-size:1rem;">🌙</span>
        <div style="position:relative;width:40px;height:22px;background:var(--bg-input);border:1px solid var(--border);border-radius:22px;flex-shrink:0;">
          <div id="menu-theme-thumb" style="position:absolute;top:3px;left:3px;width:14px;height:14px;background:var(--text-muted);border-radius:50%;transition:transform 0.25s ease;"></div>
        </div>
        <span id="menu-theme-label" style="font-family:var(--font-mono);font-size:0.72rem;font-weight:600;color:var(--text-secondary);letter-spacing:0.5px;text-transform:uppercase;min-width:60px;">Light Mode</span>
        <span style="font-size:1rem;">☀️</span>
      </div>
    </div>

    <div class="menu-hero">
      <div class="menu-hero-badge">🚀 JAHIM TRADER · Official Deriv templates</div>
      <h1>Welcome to Your<br>D-Traders Suite</h1>
      <p>The real Deriv templates — Accumulators, Bot, Digits and Rise/Fall — as tabs. Log in inside any tab and the other tabs pick up the same session.</p>
    </div>

    <div class="menu-actions-grid">
      <a class="menu-action-card card-blue" href="${L.signup}" target="_blank" rel="noopener">
        <div class="menu-card-icon">🆓</div><span class="menu-card-label label-blue">New Trader</span>
        <div class="menu-card-title">Don't have a Deriv account?</div>
        <div class="menu-card-desc">Create your free Deriv account in minutes and start trading volatility indices with a demo balance instantly.</div>
        <div class="menu-card-arrow arr-blue">Open Deriv Registration →</div>
      </a>
      <a class="menu-action-card card-green" href="${L.dashboard}" target="_blank" rel="noopener">
        <div class="menu-card-icon">🔑</div><span class="menu-card-label label-green">Developers</span>
        <div class="menu-card-title">Manage your app</div>
        <div class="menu-card-desc">Open the Deriv API dashboard to check your App ID and edit the redirect URL that makes Log in work.</div>
        <div class="menu-card-arrow arr-green">Open API Dashboard →</div>
      </a>
      <a class="menu-action-card card-orange" href="${L.deriv}" target="_blank" rel="noopener">
        <div class="menu-card-icon">💳</div><span class="menu-card-label label-orange">Fund Account</span>
        <div class="menu-card-title">Deposit to start trading</div>
        <div class="menu-card-desc">Fund your Deriv wallet easily via M-Pesa, bank transfer, crypto and many more payment methods — fast &amp; secure.</div>
        <div class="menu-card-arrow arr-orange">Open Deriv →</div>
      </a>
      <a class="menu-action-card card-purple" href="${L.whatsapp}" target="_blank" rel="noopener">
        <div class="menu-card-icon">💬</div><span class="menu-card-label label-purple">Community</span>
        <div class="menu-card-title">Join other traders</div>
        <div class="menu-card-desc">Connect with fellow Deriv traders on WhatsApp — share signals, strategies, and daily market insights with the group.</div>
        <div class="menu-card-arrow arr-purple">Join WhatsApp Group →</div>
      </a>
    </div>

    <div class="menu-info-grid">
      <div class="menu-info-card clickable" onclick="showTab('tab-accumulators')"><div class="menu-info-icon">🔄</div><div class="menu-info-title">Accumulators</div><div class="menu-info-text">Your stake grows by a chosen growth rate for every tick that stays within the barrier range.</div></div>
      <div class="menu-info-card clickable" onclick="showTab('tab-bot')"><div class="menu-info-icon">🤖</div><div class="menu-info-title">Bot</div><div class="menu-info-text">Visual bot builder with Blockly drag-and-drop programming, SmartCharts, and automated strategy execution.</div></div>
      <div class="menu-info-card clickable" onclick="showTab('tab-digits')"><div class="menu-info-icon">🔢</div><div class="menu-info-title">Digits</div><div class="menu-info-text">Matches/Differs, Even/Odd and Over/Under with real-time tick streaming and digit frequency statistics.</div></div>
      <div class="menu-info-card clickable" onclick="showTab('tab-risefall')"><div class="menu-info-icon">📈</div><div class="menu-info-title">Rise / Fall</div><div class="menu-info-text">Predict CALL or PUT with an interactive SmartCharts chart and open/closed position management.</div></div>
      <div class="menu-info-card"><div class="menu-info-icon">🔐</div><div class="menu-info-title">Secure login</div><div class="menu-info-text">OAuth 2.0 with PKCE — your Deriv password never touches this site. One login covers every tab.</div></div>
      <div class="menu-info-card"><div class="menu-info-icon">🌙</div><div class="menu-info-title">Dark &amp; Light Mode</div><div class="menu-info-text">Switch the Menu theme here. Each template also has its own theme control.</div></div>
    </div>

    <div class="menu-tips-section">
      <div class="menu-tips-title">⚡ Quick Trading Tips</div>
      <div class="tips-grid">
        <div class="tip-item"><span class="tip-icon">💡</span><div class="tip-text"><strong>Start with a demo account</strong>Switch to your Demo account inside any template and test every strategy before using real money.</div></div>
        <div class="tip-item"><span class="tip-icon">🛡️</span><div class="tip-text"><strong>Be careful with martingale</strong>Multiplying your stake after losses grows risk fast. Keep the steps low and always set a stop loss in the Bot.</div></div>
        <div class="tip-item"><span class="tip-icon">🎯</span><div class="tip-text"><strong>Set a take profit</strong>Protect gains with a take-profit on Accumulators and a profit target in your bot.</div></div>
        <div class="tip-item"><span class="tip-icon">🔄</span><div class="tip-text"><strong>Accumulators knock out</strong>One tick outside the barrier range ends the contract and loses the stake. Close early to bank profit.</div></div>
        <div class="tip-item"><span class="tip-icon">🔢</span><div class="tip-text"><strong>Digit stats aren't a promise</strong>Each tick is independent. Frequencies show what happened, not what will happen next.</div></div>
        <div class="tip-item"><span class="tip-icon">🤖</span><div class="tip-text"><strong>The Bot keeps running</strong>Switching tabs does not stop a running bot — but closing this page does.</div></div>
      </div>
    </div>

    <div class="menu-setup">
      <div class="menu-tips-title">🔧 Connection setup</div>
      <p class="menu-setup-p">For <b>Log in</b> to work, this exact address must be listed under <b>Redirect URLs</b> on your app at the
        <a href="${L.dashboard}" target="_blank" rel="noopener">Deriv API dashboard</a>
        (no trailing slash — that is how the templates send it). Scopes needed: <b>Trade</b> and <b>Account management</b>.</p>
      <div class="menu-setup-row"><span>App ID</span><code id="setup-appid">—</code><button type="button" onclick="copyText('setup-appid')">Copy</button></div>
      <div class="menu-setup-row"><span>Redirect URL</span><code id="setup-redirect">—</code><button type="button" onclick="copyText('setup-redirect')">Copy</button></div>
    </div>

    <div class="menu-footer-note">
      💵 JAHIM TRADER · Built for Deriv Volatility Index Traders · Trade responsibly — never risk more than you can afford to lose
    </div>

  </div>
</div>`;
}
