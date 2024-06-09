// chrome.runtime.onInstalled.addListener(() =>{
//     console.log('I just installed my chrome')
// })

// chrome.bookmarks.onCreated.addListener(() => {
//     console.log('I just bookmarked this page')
// })

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
        console.log("content script injected");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['contentScript.js']
      });
    }
  });

