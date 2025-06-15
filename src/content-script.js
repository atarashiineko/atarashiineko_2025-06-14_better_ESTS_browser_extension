import { WindowManager } from './window.js';
import { AppWindow } from './app-window.js';
import './window.css';

function incrementCount() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "increment" }, (resp) => {
      resolve(resp ? resp.count : 0);
    });
  });
}

function injectCounter(count) {
  let counter = document.getElementById("login-count-tracker");
  if (!counter) {
    counter = document.createElement("div");
    counter.id = "login-count-tracker";
    counter.style.position = "fixed";
    counter.style.top = "10px";
    counter.style.right = "10px";
    counter.style.background = "#fff";
    counter.style.border = "1px solid #ccc";
    counter.style.padding = "4px 8px";
    counter.style.zIndex = 10000;
    counter.style.fontSize = "14px";
    document.body.appendChild(counter);
  }
  counter.textContent = `Logins: ${count}`;

  let btn = document.getElementById('app-launch-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'app-launch-btn';
    btn.className = 'app-button';
    btn.textContent = '\uD83D\uDD5F';
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
})();
