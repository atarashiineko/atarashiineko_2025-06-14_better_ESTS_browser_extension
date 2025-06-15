import { WindowManager } from './window.js';
import { AppWindow } from './app-window.js';
import { pf } from './prefix.js';
import './window.css';

function looksLikeGuid(id) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

async function getOpenIdConfig(tenant) {
  try {
    const resp = await fetch(`https://login.microsoftonline.com/${tenant}/v2.0/.well-known/openid-configuration`);
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

async function resolveTenantInfo() {
  const seg = location.pathname.split('/')[1] || '';
  const cfg = await getOpenIdConfig(seg);
  let tenantId = seg;
  let domain = looksLikeGuid(seg) ? '' : seg;
  let logoutUrl = '';
  if (cfg) {
    const auth = cfg.authorization_endpoint || '';
    const m = auth.match(/login\.microsoftonline\.com\/([^/]+)/);
    if (m) tenantId = m[1];
    logoutUrl = cfg.end_session_endpoint || '';
    if (looksLikeGuid(seg)) {
      try {
        const hostResp = await fetch(`https://login.microsoftonline.com/${seg}/.well-known/hostnames`);
        if (hostResp.ok) {
          const list = await hostResp.json();
          if (Array.isArray(list) && list.length) domain = list[0];
        }
      } catch {}
    }
  }
  return { tenantId, domain, logoutUrl };
}

function incrementCount() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "increment" }, (resp) => {
      resolve(resp ? resp.count : 0);
    });
  });
}

function getCount() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getCount" }, (resp) => {
      resolve(resp ? resp.count : 0);
    });
  });
}

function injectCounter(count) {
  let counter = document.getElementById(pf("login-count-tracker"));
  if (!counter) {
    counter = document.createElement("div");
    counter.id = pf("login-count-tracker");
    counter.style.position = "fixed";
    counter.style.top = "10px";
    counter.style.right = "10px";
    counter.style.background = "#fff";
    counter.style.border = "1px solid #ccc";
    counter.style.padding = "4px 8px";
    counter.style.display = "flex";
    counter.style.alignItems = "center";
    counter.style.zIndex = 10000;
    counter.style.fontSize = "14px";
    document.body.appendChild(counter);
  }
  let countSpan = document.getElementById(pf("login-count"));
  if (!countSpan) {
    countSpan = document.createElement("span");
    countSpan.id = pf("login-count");
    counter.appendChild(countSpan);
  }
  countSpan.textContent = `Logins: ${count}`;

  let btn = document.getElementById(pf('app-launch-btn'));
  if (!btn) {
    btn = document.createElement('button');
    btn.id = pf('app-launch-btn');
    btn.className = pf('app-button');
    btn.textContent = '🪟';
    btn.title = 'Open application';
    counter.appendChild(btn);
    btn.addEventListener('click', () => {
      const win = new AppWindow({ title: 'My App', width: 500, height: 400 });
      WindowManager.open(win);
    });
  }
}

function injectTenantInfo(info) {
  let box = document.getElementById(pf('tenant-info'));
  if (!box) {
    box = document.createElement('div');
    box.id = pf('tenant-info');
    box.style.position = 'fixed';
    box.style.top = '10px';
    box.style.left = '10px';
    box.style.background = '#fff';
    box.style.border = '1px solid #ccc';
    box.style.padding = '6px 10px';
    box.style.fontSize = '18px';
    box.style.zIndex = 10000;
    box.style.lineHeight = '1.4';
    document.body.appendChild(box);
  }
  box.textContent = '';
  const tLine = document.createElement('div');
  let text = 'Tenant: ';
  if (info.domain) {
    text += `${info.domain} (${info.tenantId})`;
  } else {
    text += info.tenantId;
  }
  tLine.textContent = text;
  if (info.logoutUrl) {
    const link = document.createElement('a');
    link.href = info.logoutUrl;
    link.textContent = 'Logout';
    link.style.marginLeft = '4px';
    tLine.appendChild(document.createTextNode(' '));
    tLine.appendChild(link);
  }
  const refLine = document.createElement('div');
  const ref = document.referrer ? document.referrer : '(none)';
  refLine.textContent = `Referrer URL: ${ref}`;
  box.appendChild(tLine);
  box.appendChild(refLine);
}

(async () => {
  const count = await incrementCount();
  injectCounter(count);
  const info = await resolveTenantInfo();
  injectTenantInfo(info);
  setInterval(async () => {
    const latest = await getCount();
    injectCounter(latest);
  }, 1000);
})();
