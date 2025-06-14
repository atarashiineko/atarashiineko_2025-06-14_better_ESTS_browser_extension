function getCount() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getCount" }, (resp) => {
      resolve(resp ? resp.count : 0);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const countElem = document.getElementById("count");
  const count = await getCount();
  countElem.textContent = count;
});
