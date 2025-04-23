// Configuration storage
let config = {
  blurAvatars: true,
  blurNames: true, 
  blurMsgs: true,
  blurTimestamps: true,
  intensity: 8,
  unlockOnClick: false,
  whitelist: [],
  pin: ''
};

// Element selectors by category with improved chat name handling
const selectors = {
  avatars: [
    '.avatar', '.Avatar', '.user-avatar', '.chat-avatar', '.dialog-avatar',
    'img[class*="avatar"]', 'img[class*="photo"]', '.ListItem-button .Avatar',
    '.ChatInfo .Avatar', '.Message .Avatar', '.Peer .avatar',
    '.TopBarPeer .avatar', '.chat-picture'
  ],
  names: [
    '.user-name', '.chat-name', '.dialog-name', '.peer-title',
    '.ListItem-button .title', '.ChatInfo-title', '.sender-name',
    '.Chat .header .name', '.TopBarPeer .title', '.PeerTitle',
    '[class*="peer-title"]', '[class*="chat-name"]', '[class*="username"]',
    '[class*="ListItem-title"]', '[class*="dialog-title"]',
    '.Chat .info .name', '.TopBar .name', '.TopBarPeer .name'
  ],
  messages: [
    '.message:not(input)', '.message-content', '.message-text',
    '.message-bubble', '.Message .content-inner', '.Message-body',
    '.Message-wrapper .text', '.MessageList .bubble', '.message-row',
    '.MessageGroup', '.ChatMessages .Message', '.WebPage-description'
  ],
  timestamps: [
    '.timestamp', '.time:not(input)', '.date:not(input)', '.message-date',
    '.Message time', '.Message .time', '.time-absolute',
    '.MessageMeta .date', '.MessageMeta .time', '.Message .date',
    '.status-time', '.Message .status time', '.ChatDate'
  ]
};

// Apply blur to elements with improved hover handling
function applyBlur() {
  if (config.whitelist.includes(window.location.hostname)) return;

  // Clear existing blur classes
  document.querySelectorAll('.blur-target').forEach(el => {
    el.classList.remove('blur-target', 'blur-hover');
    
    // Remove any existing event listeners for click mode
    if (el._blurClickHandler) {
      el.removeEventListener('click', el._blurClickHandler, true);
      delete el._blurClickHandler;
    }
  });
  
  // Apply blur based on configuration
  Object.entries(selectors).forEach(([type, selectorList]) => {
    const shouldBlur = config[`blur${type.charAt(0).toUpperCase() + type.slice(1)}`];
    if (shouldBlur) {
      selectorList.forEach(s => {
        document.querySelectorAll(s).forEach(el => {
          // Skip elements that are inside input fields or buttons
          if (el.closest('input, button, textarea, select')) return;
          
          // Apply blur class
          el.classList.add('blur-target');
          
          // Add hover or click behavior
          if (!config.unlockOnClick) {
            el.classList.add('blur-hover');
          } else {
            // Store reference to handler for later cleanup
            el._blurClickHandler = handleClick.bind(null, el);
            el.addEventListener('click', el._blurClickHandler, true);
          }
        });
      });
    }
  });
}

// Click handler for unlockOnClick mode
function handleClick(el, e) {
  if (config.pin && config.pin.length > 0) {
    const enteredPin = prompt(chrome.i18n.getMessage('enterPin') || 'Enter PIN to reveal:');
    if (enteredPin !== config.pin) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }
  
  // Remove blur from the element
  el.classList.remove('blur-target');
  
  // Remove the click listener
  if (el._blurClickHandler) {
    el.removeEventListener('click', el._blurClickHandler, true);
    delete el._blurClickHandler;
  }
  
  // Prevent default but allow propagation for legitimate UI interactions
  e.stopPropagation();
}

// Load configuration and setup
function initialize() {
  chrome.storage.sync.get(Object.keys(config), (storedConfig) => {
    Object.assign(config, storedConfig);
    document.documentElement.style.setProperty('--blur-radius', config.intensity + 'px');
    applyBlur();
    
    // Watch for DOM changes with improved performance
    const observer = new MutationObserver(mutations => {
      // Check if we need to reapply blur (new nodes added)
      if (mutations.some(m => m.addedNodes.length > 0)) {
        // Use requestAnimationFrame to prevent performance issues
        requestAnimationFrame(applyBlur);
      }
    });
    
    // Observe document body with optimized config
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: false,
      characterData: false
    });
  });
}

// Listen for messages from extension
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'prefsUpdated') {
    Object.assign(config, message.prefs);
    document.documentElement.style.setProperty('--blur-radius', config.intensity + 'px');
    applyBlur();
  }
  
  if (message.action === 'toggleAllBlur') {
    document.documentElement.classList.toggle('no-blur');
  }
  
  if (message.action === 'toggleElementBlur') {
    const {x, y} = message;
    const el = document.elementFromPoint(x, y);
    if (el) el.classList.toggle('blur-target');
  }
});

// Initialize on DOM loaded or now if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// For Telegram SPA navigation
window.addEventListener('popstate', applyBlur);
window.addEventListener('hashchange', applyBlur);

// dynamic blur based on storage
chrome.storage.sync.get('intensity', ({ intensity = 8 }) => {
  document.documentElement.style.setProperty('--blur-radius', intensity + 'px');
});

// no JS needed to apply; CSS selectors handle blur on matched elements

// listen for intensity changes
chrome.runtime.onMessage.addListener(msg => {
  if (msg.action === 'prefsUpdated' && msg.key === 'intensity') {
    document.documentElement.style.setProperty('--blur-radius', msg.val + 'px');
  }
  if (msg.action === 'toggleAllBlur') {
    document.documentElement.classList.toggle('no-blur');
  }
}); 