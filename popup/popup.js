function getCounts() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getCounts" }, (resp) => {
      if (resp) {
        resolve(resp);
      } else {
        resolve({ count: 0, daily: 0 });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const countElem = document.getElementById("count");
  const dailyElem = document.getElementById("daily-count");
  const counts = await getCounts();
  countElem.textContent = counts.count;
  dailyElem.textContent = counts.daily;
});
