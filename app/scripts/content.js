// content.js

function getBrowserAPI() {
    if (typeof browser !== 'undefined') {
        return browser;
    } else if (typeof chrome !== 'undefined') {
        return chrome;
    }
    throw new Error('No suitable API namespace found');
}

const API = getBrowserAPI();

var extensionDisabled = false;
API.storage.sync.get(['extensionDisabled'], function (result) {
    extensionDisabled= result.extensionDisabled;
});

// Function to be executed when an ad appears
function handleAd() {
    if (extensionDisabled) {
        return;
    }

    // Set the video time to the end by simulating seeking
    const videoPlayer = document.querySelector('video.html5-main-video');
    const adDurationObject = document.querySelector('.ytp-ad-duration-remaining .ytp-ad-text');
    if (!adDurationObject) {
        return;
    }
    const adDuration = adDurationObject.textContent;
    const adDurationInSeconds = convertAdDurationToSeconds(adDuration);

    videoPlayer.currentTime = adDurationInSeconds;
    const skipButton = document.querySelector('.ytp-ad-skip-button-container button'); //.ytp-ad-skip-button-modern
    if (skipButton) {
        skipButton.click();
        console.log('YouTube Ad Skipper: Ad skipped');
    }
}

// Function to convert ad duration to seconds
function convertAdDurationToSeconds(duration) {
    const parts = duration.split(':');
    let seconds = 0;
    for (let i = 0; i < parts.length; i++) {
        seconds = seconds * 60 + parseInt(parts[i], 10);
    }
    return seconds;
}

// Function to check for ads periodically
function checkForAds() {
    if (extensionDisabled) {
        return;
    }

    const adPlayer = document.querySelector('.video-ads.ytp-ad-module');
    if (adPlayer) {
        handleAd();
    }
}

// Listen for messages from the popup script
API.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'extensionEnabled') {
      // Enable/disable the extension based on the message
      extensionDisabled = false;
      sendResponse({ success: true });
    }
    if (request.message === 'extensionDisabled') {
        // Enable/disable the extension based on the message
        extensionDisabled = true;
        sendResponse({ success: true });
    }

  });
  

// Check for ads when the page is loaded or navigated
window.addEventListener('load', checkForAds);
window.addEventListener('spfdone', checkForAds); // For YouTube's SPFx (Single Page Framework)

// Check for ads periodically
setInterval(checkForAds, 250);
