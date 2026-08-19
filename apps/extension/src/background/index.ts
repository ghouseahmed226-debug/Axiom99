// [Agent-15: Chrome Service Worker Dev]
chrome.runtime.onInstalled.addListener(() => {
  console.log('[NexusWeb Extension] Initialized and active.')
})

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'https://nexusweb.gg' })
})