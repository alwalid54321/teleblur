// Keyboard shortcut toggle
chrome.commands.onCommand.addListener(cmd => {
  if (cmd === 'toggle-blur') {
    chrome.tabs.query({ active: true, url: 'https://web.telegram.org/*' }, tabs => {
      if (tabs[0])
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleAllBlur' });
    });
  }
});

// Context-menu toggle
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'toggle-element-blur',
    title: chrome.i18n.getMessage('ctxToggle'),
    contexts: ['all']
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'toggle-element-blur') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (x, y) => {
        const el = document.elementFromPoint(x, y);
        if (el) el.classList.toggle('blur-target');
      },
      args: [info.clientX, info.clientY]
    });
  }
});

// Listen for preference updates from options page and broadcast
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'prefsUpdated') {
    // Broadcast to all matching tabs
    chrome.tabs.query({url: 'https://web.telegram.org/*'}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message);
      });
    });
  }
});