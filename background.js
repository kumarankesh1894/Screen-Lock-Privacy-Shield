// Background script for Screen Lock Chrome Extension
// TODO: Listen for shortcut and trigger content script

chrome.commands.onCommand.addListener((command) => {
  if (command === "lock_screen") {
    // Get the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "lock_screen" }, () => {
          if (chrome.runtime.lastError) {
            // Optionally log or ignore the error
            console.warn(
              "Screen Lock: Could not send message to tab.",
              chrome.runtime.lastError.message
            );
          }
        });
      }
    });
  }
});
