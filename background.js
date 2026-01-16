let currentTabId = null;
let startTime = Date.now();
let currentUrl = "";

// Classification Logic (Per requirement in image)
const PRODUCTIVE_SITES = ["github.com", "stackoverflow.com", "linkedin.com", "docs.google.com"];
const UNPRODUCTIVE_SITES = ["facebook.com", "instagram.com", "youtube.com", "twitter.com", "netflix.com"];

function classify(url) {
  if (!url) return "Other";
  if (PRODUCTIVE_SITES.some(site => url.includes(site))) return "Productive";
  if (UNPRODUCTIVE_SITES.some(site => url.includes(site))) return "Unproductive";
  return "Neutral";
}

async function saveData(url, duration) {
  if (!url || duration < 1) return;
  const domain = new URL(url).hostname;
  const category = classify(domain);
  const date = new Date().toLocaleDateString();

  const result = await chrome.storage.local.get(["history"]);
  let history = result.history || [];
  
  history.push({ domain, duration, category, date, timestamp: Date.now() });
  await chrome.storage.local.set({ history });
}

// Track when user switches tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const now = Date.now();
  const duration = (now - startTime) / 1000;
  await saveData(currentUrl, duration);

  const tab = await chrome.tabs.get(activeInfo.tabId);
  currentUrl = tab.url;
  startTime = now;
});

// Track when URL changes in same tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const now = Date.now();
    saveData(currentUrl, (now - startTime) / 1000);
    currentUrl = changeInfo.url;
    startTime = now;
  }
});