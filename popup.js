// popup.js

document.addEventListener('DOMContentLoaded', function () {
    var toggleButton = document.getElementById('toggleButton');
  
    // Add click event listener to the button
    toggleButton.addEventListener('click', function () {
      chrome.storage.sync.get(['extensionDisabled'], function (result) {
        var extensionDisabled = result.extensionDisabled;
        if (!extensionDisabled) {
          // Disable the extension
          chrome.storage.sync.set({ extensionDisabled: true }, function () {
            toggleButton.textContent = 'Enable Extension';
            toggleButton.classList.remove('disabled');

             // Send message to content script to update the extension state
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message: 'extensionDisabled' });
            });
          });
        } else {
          // Enable the extension
          chrome.storage.sync.set({ extensionDisabled: false }, function () {
            toggleButton.textContent = 'Disable Extension';
            toggleButton.classList.add('disabled');
            // Send message to content script to update the extension state
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message: 'extensionEnabled' });
            });
          });
        }
      });
    });
});
  
// Get the initial state of the extension and update the button
chrome.storage.sync.get(['extensionDisabled'], function (result) {
    var extensionDisabled = result.extensionDisabled;
    if (!extensionDisabled) {
    toggleButton.textContent = 'Disable Extension';
    toggleButton.classList.add('disabled');
    } else {
    toggleButton.textContent = 'Enable Extension';
    toggleButton.classList.remove('disabled');
    }
});
  