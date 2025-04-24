// Localize UI
document.querySelectorAll('[data-i18n]').forEach(el =>
  el.textContent = chrome.i18n.getMessage(el.dataset.i18n)
);

const keys = ['blurEnabled','intensity'];
chrome.storage.sync.get(keys, prefs => {
  document.getElementById('blurEnabled').checked = prefs.blurEnabled ?? true;
  document.getElementById('intensity').value = prefs.intensity ?? 8;
  document.getElementById('intVal').textContent = prefs.intensity ?? 8;
});

// Real-time updates
document.getElementById('blurEnabled').addEventListener('change', e => {
  const val = e.target.checked;
  chrome.storage.sync.set({ blurEnabled: val }, () =>
    chrome.runtime.sendMessage({ action:'prefsUpdated', key:'blurEnabled', val })
  );
});
document.getElementById('intensity').addEventListener('input', e => {
  const val = Number(e.target.value);
  document.getElementById('intVal').textContent = val;
  chrome.storage.sync.set({ intensity: val }, () =>
    chrome.runtime.sendMessage({ action:'prefsUpdated', key:'intensity', val })
  );
});