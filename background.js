/**
 * Telegram Web Privacy Blur - Background Service Worker
 * Handles keyboard shortcuts, context menu, and tab management
 */

// Handle keyboard commands
chrome.commands.onCommand.addListener(cmd => {
  if (cmd === 'toggle-blur') {
    chrome.tabs.query({ active: true, url: 'https://web.telegram.org/*' }, tabs => {
      if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleAllBlur' });
    });
  }
});

// Setup context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  // Toggle blur on right-clicked element
  chrome.contextMenus.create({
    id: 'toggle-element-blur',
    title: chrome.i18n.getMessage('ctxToggle'),
    contexts: ['all']
  });
  
  // Quick toggle all blur
  chrome.contextMenus.create({
    id: 'toggle-all-blur',
    title: chrome.i18n.getMessage('ctxToggleAll') || 'Toggle all blur on/off',
    contexts: ['all'],
    documentUrlPatterns: ['https://web.telegram.org/*']
  });
  
  // Open options page
  chrome.contextMenus.create({
    id: 'open-options',
    title: chrome.i18n.getMessage('ctxOpenOptions') || 'Blur settings',
    contexts: ['all'],
    documentUrlPatterns: ['https://web.telegram.org/*']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) return;
  
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
  
  if (info.menuItemId === 'toggle-all-blur') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'toggleAllBlur'
    });
  }
  
  if (info.menuItemId === 'open-options') {
    chrome.runtime.openOptionsPage();
  }
});

// Listen for preference updates from options page
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