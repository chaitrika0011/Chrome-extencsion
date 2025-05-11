let startTime;
let currentUrl;

const productiveWebsites = [
  'github.com',
  'stackoverflow.com',
  'leetcode.com',
  'freecodecamp.org'
];

const unproductiveWebsites = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'youtube.com'
];

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    handleTabChange(changeInfo.url);
  }
});

function handleTabChange(newUrl) {
  const endTime = new Date();
  if (startTime && currentUrl) {
    const timeSpent = endTime - startTime;
    saveTimeData(currentUrl, timeSpent);
  }
  
  startTime = new Date();
  currentUrl = newUrl;
}

function saveTimeData(url, timeSpent) {
  const domain = new URL(url).hostname;
  const date = new Date().toISOString().split('T')[0];
  
  chrome.storage.local.get(['timeData'], (result) => {
    const timeData = result.timeData || {};
    if (!timeData[date]) {
      timeData[date] = {};
    }
    if (!timeData[date][domain]) {
      timeData[date][domain] = 0;
    }
    timeData[date][domain] += timeSpent;
    
    chrome.storage.local.set({ timeData });
  });
}