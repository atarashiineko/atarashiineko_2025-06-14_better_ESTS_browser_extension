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
}

(async () => {
  const count = await incrementCount();
  injectCounter(count);
})();
