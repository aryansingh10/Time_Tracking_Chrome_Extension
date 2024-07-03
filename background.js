let activeTabId = null;
let siteData = {};

const updateInterval = 1000; // Update every second

function updateTimeSpent() {
  if (activeTabId !== null) {
    chrome.tabs.get(activeTabId, tab => {
      if (tab && tab.url) {
        const url = new URL(tab.url);
        const hostname = url.hostname;
        const now = new Date().getTime();
        if (!siteData[hostname]) {
          siteData[hostname] = 0;
        }
        siteData[hostname] += updateInterval;
        chrome.storage.local.set({ siteData });
      }
    });
  }
}

chrome.tabs.onActivated.addListener(activeInfo => {
  activeTabId = activeInfo.tabId;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === 'complete') {
    activeTabId = tabId;
  }
});

chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    activeTabId = null;
  } else {
    chrome.tabs.query({ active: true, windowId: windowId }, tabs => {
      if (tabs.length > 0) {
        activeTabId = tabs[0].id;
      }
    });
  }
});

// Periodically update the time spent
setInterval(updateTimeSpent, updateInterval);
