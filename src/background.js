import Dexie from "dexie";

const db = new Dexie("LoginCounterDB");
db.version(1).stores({ counters: "&key" });

async function getCount() {
  const record = await db.counters.get("loginCount");
  return record ? record.value : 0;
}

async function setCount(val) {
  await db.counters.put({ key: "loginCount", value: val });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getCount") {
    getCount().then((count) => sendResponse({ count }));
    return true;
  } else if (msg.action === "increment") {
    getCount().then((count) => {
      const next = count + 1;
      setCount(next).then(() => sendResponse({ count: next }));
    });
    return true;
  }
});
