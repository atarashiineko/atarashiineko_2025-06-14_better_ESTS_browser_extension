import { WindowManager } from './window.js';
import { AppWindow } from './app-window.js';
import { pf } from './prefix.js';
import './window.css';

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

(async () => {
  const count = await incrementCount();
  injectCounter(count);
  setInterval(async () => {
    const latest = await getCount();
    injectCounter(latest);
  }, 1000);
})();
