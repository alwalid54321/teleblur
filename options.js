/**
 * Telegram Web Privacy Blur - Options Page
 * Handles user preferences
 */

// Default configuration
const defaultConfig = {
  blurAvatars: true,
  blurNames: true,
  blurMsgs: true,
  blurTimestamps: true,
  intensity: 8,
  unlockOnClick: false,
  whitelist: [],
  pin: ''
};

// DOM Elements
const elements = {
  blurAvatars: document.getElementById('blurAvatars'),
  blurNames: document.getElementById('blurNames'),
  blurMsgs: document.getElementById('blurMsgs'),
  blurTimestamps: document.getElementById('blurTimestamps'),
  intensity: document.getElementById('intensity'),
  intVal: document.getElementById('intVal'),
  unlockOnClick: document.getElementById('unlockOnClick'),
  whitelist: document.getElementById('whitelist'),
  pin: document.getElementById('pin'),
  save: document.getElementById('save'),
  reset: document.getElementById('reset')
};

// Get current locale
function getCurrentLocale() {
  return chrome.i18n.getUILanguage() || 'en';
}

// Set page direction based on locale
function setPageDirection() {
  const locale = getCurrentLocale();
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  const isRtl = rtlLocales.some(rtlLocale => locale.startsWith(rtlLocale));
  
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', locale);
}

// Localize UI elements
function localizeUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key) {
      const text = chrome.i18n.getMessage(key);
      if (text) el.textContent = text;
    }
  });
}

// Load saved configuration
function loadSavedConfig() {
  chrome.storage.sync.get(Object.keys(defaultConfig), (savedConfig) => {
    // Apply config with defaults for missing values
    const config = { ...defaultConfig, ...savedConfig };
    
    // Apply to form fields
    elements.blurAvatars.checked = config.blurAvatars;
    elements.blurNames.checked = config.blurNames;
    elements.blurMsgs.checked = config.blurMsgs;
    elements.blurTimestamps.checked = config.blurTimestamps;
    elements.intensity.value = config.intensity;
    elements.intVal.textContent = config.intensity;
    elements.unlockOnClick.checked = config.unlockOnClick;
    elements.pin.value = config.pin || '';
    
    // Handle whitelist (array to string)
    if (Array.isArray(config.whitelist)) {
      elements.whitelist.value = config.whitelist.join('\n');
    } else {
      elements.whitelist.value = '';
    }
  });
}

// Save configuration
function saveConfig() {
  const config = {
    blurAvatars: elements.blurAvatars.checked,
    blurNames: elements.blurNames.checked,
    blurMsgs: elements.blurMsgs.checked,
    blurTimestamps: elements.blurTimestamps.checked,
    intensity: parseInt(elements.intensity.value, 10),
    unlockOnClick: elements.unlockOnClick.checked,
    pin: elements.pin.value.trim(),
    whitelist: elements.whitelist.value
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
  };
  
  // Save to Chrome storage
  chrome.storage.sync.set(config, () => {
    // Notify content scripts of update
    chrome.runtime.sendMessage({
      action: 'prefsUpdated',
      prefs: config
    });
    
    // Visual feedback
    elements.save.textContent = chrome.i18n.getMessage('savedFeedback') || 'Saved!';
    setTimeout(() => {
      elements.save.textContent = chrome.i18n.getMessage('saveButton') || 'Save Settings';
    }, 1500);
  });
}

// Reset to default
function resetConfig() {
  if (confirm(chrome.i18n.getMessage('confirmReset') || 'Reset all settings to default?')) {
    chrome.storage.sync.set(defaultConfig, () => {
      loadSavedConfig();
      chrome.runtime.sendMessage({
        action: 'prefsUpdated',
        prefs: defaultConfig
      });
    });
  }
}

// Update intensity display
function updateIntensityDisplay() {
  elements.intVal.textContent = elements.intensity.value;
}

// Initialize
function initialize() {
  // Set page direction based on locale
  setPageDirection();
  
  // Localize UI
  localizeUI();
  
  // Load saved config
  loadSavedConfig();
  
  // Set up event listeners
  elements.save.addEventListener('click', saveConfig);
  elements.reset.addEventListener('click', resetConfig);
  elements.intensity.addEventListener('input', updateIntensityDisplay);
  
  // Add form validation
  elements.pin.addEventListener('input', (e) => {
    // Allow only digits
    e.target.value = e.target.value.replace(/[^\d]/g, '');
  });
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// localize
document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = chrome.i18n.getMessage(el.dataset.i18n));
const keys = ['blurSidebar','blurHeader','blurMsgs','intensity'];
// init
chrome.storage.sync.get(keys, prefs => {
  keys.forEach(k => {
    const el = document.getElementById(k);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = prefs[k] ?? true;
    if (el.type === 'range') {
      el.value = prefs.intensity ?? 8;
      document.getElementById('intVal').textContent = el.value;
    }
  });
});
// listeners
document.getElementById('blurSidebar').addEventListener('change', e => chrome.storage.sync.set({blurSidebar: e.target.checked}));
document.getElementById('blurHeader').addEventListener('change', e => chrome.storage.sync.set({blurHeader: e.target.checked}));
document.getElementById('blurMsgs').addEventListener('change', e => chrome.storage.sync.set({blurMsgs: e.target.checked}));
document.getElementById('intensity').addEventListener('input', e => {
  const v = Number(e.target.value);
  document.getElementById('intVal').textContent = v;
  chrome.storage.sync.set({intensity: v});
  chrome.runtime.sendMessage({action:'prefsUpdated', key:'intensity', val:v});
}); 