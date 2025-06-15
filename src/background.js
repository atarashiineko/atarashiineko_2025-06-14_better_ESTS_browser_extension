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

function getTodayKey() {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return `loginCount_${d.getFullYear()}_${pad(d.getMonth() + 1)}_${pad(d.getDate())}`;
}

async function getDailyCount() {
  const record = await db.counters.get(getTodayKey());
  return record ? record.value : 0;
}

async function setDailyCount(val) {
  await db.counters.put({ key: getTodayKey(), value: val });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getCounts") {
    Promise.all([getCount(), getDailyCount()]).then(([count, daily]) => {
      sendResponse({ count, daily });
    });
    return true;
  } else if (msg.action === "getCount") {
    getCount().then((count) => sendResponse({ count }));
    return true;
  } else if (msg.action === "increment") {
    Promise.all([getCount(), getDailyCount()]).then(([count, daily]) => {
      const next = count + 1;
      const nextDaily = daily + 1;
      Promise.all([setCount(next), setDailyCount(nextDaily)]).then(() => {
        sendResponse({ count: next, daily: nextDaily });
      });
    });
    return true;
  }
});
