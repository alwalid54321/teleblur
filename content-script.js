// Initialize blur intensity
chrome.storage.sync.get('intensity', ({ intensity = 8 }) => {
  document.documentElement.style.setProperty('--blur-radius', intensity + 'px');
});

// Listen for real-time preference updates
chrome.runtime.onMessage.addListener(msg => {
  if (msg.action === 'prefsUpdated') {
    if (msg.key === 'intensity')
      document.documentElement.style.setProperty('--blur-radius', msg.val + 'px');
    if (msg.key === 'blurEnabled')
      document.documentElement.classList.toggle('no-blur', !msg.val);
  }
  // Handle the toggleAllBlur message if needed (e.g., for shortcut)
  if (msg.action === 'toggleAllBlur') {
     chrome.storage.sync.get('blurEnabled', ({ blurEnabled = true }) => {
        const newState = !blurEnabled;
        chrome.storage.sync.set({ blurEnabled: newState });
        document.documentElement.classList.toggle('no-blur', !newState);
     });
  }
});

// Initial blur state based on storage
chrome.storage.sync.get('blurEnabled', ({ blurEnabled = true }) => {
  if (!blurEnabled) {
    document.documentElement.classList.add('no-blur');
  }
});