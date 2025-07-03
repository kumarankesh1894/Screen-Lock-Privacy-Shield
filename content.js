// Content script for Screen Lock Chrome Extension

let inactivityTimer = null;
let inactivityTimeoutValue = 0;
let isLocked = false;

// Helper to check for backdrop-filter support
function supportsBackdropFilter() {
  return (
    CSS.supports("backdrop-filter", "blur(4px)") ||
    CSS.supports("-webkit-backdrop-filter", "blur(4px)")
  );
}

// Helper to create the lock overlay
function createLockOverlay() {
  if (document.getElementById("screen-lock-overlay")) return; // Prevent duplicates
  isLocked = true;
  console.log("[ScreenLock] Creating lock overlay...");

  // Get user settings for blur and mode
  chrome.storage.local.get(["screenLockBlur", "screenLockMode"], (settings) => {
    const blurStrength = settings.screenLockBlur
      ? settings.screenLockBlur
      : "12";
    const mode = settings.screenLockMode ? settings.screenLockMode : "dark";

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "screen-lock-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.zIndex = "999999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.transition = "backdrop-filter 0.3s";
    if (supportsBackdropFilter()) {
      overlay.style.backdropFilter = `blur(${blurStrength}px)`;
      overlay.style.background =
        mode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)";
      document.body.style.filter = "";
    } else {
      overlay.style.background =
        mode === "dark" ? "rgba(30,30,30,0.85)" : "rgba(255,255,255,0.85)";
      document.body.style.filter = `blur(${blurStrength}px)`;
    }
    overlay.style.pointerEvents = "auto";

    // Prevent interaction
    overlay.addEventListener("mousedown", (e) => e.stopPropagation(), true);
    overlay.addEventListener("mouseup", (e) => e.stopPropagation(), true);
    overlay.addEventListener("click", (e) => e.stopPropagation(), true);
    overlay.addEventListener("keydown", (e) => e.stopPropagation(), true);
    overlay.addEventListener("keyup", (e) => e.stopPropagation(), true);
    overlay.addEventListener("keypress", (e) => e.stopPropagation(), true);
    overlay.addEventListener("wheel", (e) => e.stopPropagation(), true);

    // Password box container
    const box = document.createElement("div");
    box.style.background =
      mode === "dark" ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.97)";
    box.style.padding = "32px 24px";
    box.style.borderRadius = "16px";
    box.style.boxShadow = "0 4px 32px rgba(0,0,0,0.3)";
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.alignItems = "center";

    // Title
    const title = document.createElement("div");
    title.textContent = "Screen Locked";
    title.style.color = mode === "dark" ? "#fff" : "#222";
    title.style.fontSize = "1.5em";
    title.style.marginBottom = "16px";
    box.appendChild(title);

    // Password input
    const input = document.createElement("input");
    input.type = "password";
    input.placeholder = "Enter password to unlock";
    input.style.fontSize = "1.1em";
    input.style.padding = "8px 12px";
    input.style.borderRadius = "6px";
    input.style.border = "1px solid #888";
    input.style.marginBottom = "12px";
    input.style.width = "220px";
    input.autofocus = true;
    input.style.background = mode === "dark" ? "#23272b" : "#f5f5f5";
    input.style.color = mode === "dark" ? "#fff" : "#222";
    box.appendChild(input);

    // Error message
    const error = document.createElement("div");
    error.style.color = "#ff6b6b";
    error.style.height = "20px";
    error.style.fontSize = "1em";
    error.style.marginBottom = "8px";
    box.appendChild(error);

    // Unlock button
    const btn = document.createElement("button");
    btn.textContent = "Unlock";
    btn.style.fontSize = "1.1em";
    btn.style.padding = "8px 24px";
    btn.style.borderRadius = "6px";
    btn.style.border = "none";
    btn.style.background = "#1976d2";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";
    btn.style.marginTop = "8px";
    btn.style.pointerEvents = "auto";
    box.appendChild(btn);
    console.log("[ScreenLock] Unlock button created", btn);

    // Prevent tabbing out
    input.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        input.focus();
      }
    });

    // Unlock logic
    function tryUnlock() {
      const entered = input.value;
      chrome.storage.local.get(["screenLockPassword"], (result) => {
        const correct = result.screenLockPassword || "";
        console.log("[ScreenLock] Entered:", entered, "Stored:", correct);
        if (entered.trim() === correct.trim() && correct !== "") {
          // Robust overlay removal
          const overlayEl = document.getElementById("screen-lock-overlay");
          if (overlayEl) overlayEl.remove();
          // Fallback: try again after a short delay
          setTimeout(() => {
            const overlayEl2 = document.getElementById("screen-lock-overlay");
            if (overlayEl2) overlayEl2.remove();
          }, 100);
          document.body.style.overflow = "";
          document.body.style.filter = "";
          isLocked = false;
          resetInactivityTimer();
        } else {
          error.textContent = "Incorrect password";
          input.value = "";
          input.focus();
        }
      });
    }

    // Use event delegation for unlock button, in capture phase
    overlay.addEventListener(
      "click",
      (e) => {
        if (e.target === btn) {
          console.log(
            "[ScreenLock] Unlock button clicked (delegated, capture)"
          );
          tryUnlock();
        }
      },
      true
    ); // capture phase
    console.log(
      "[ScreenLock] Unlock button event listener attached (delegated, capture)"
    );

    box.addEventListener("click", (e) => e.stopPropagation());
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden"; // Prevent scrolling
    input.focus();
  });
}

// Inactivity auto-lock logic
function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
  if (inactivityTimeoutValue > 0 && !isLocked) {
    inactivityTimer = setTimeout(() => {
      createLockOverlay();
    }, inactivityTimeoutValue * 1000);
  }
}

function setupInactivityMonitor() {
  // Get the inactivity timeout value from storage
  chrome.storage.local.get(["screenLockInactivity"], (settings) => {
    inactivityTimeoutValue = parseInt(settings.screenLockInactivity || "0", 10);
    if (inactivityTimeoutValue > 0) {
      // Listen for user activity
      ["mousemove", "keydown", "mousedown", "scroll", "touchstart"].forEach(
        (evt) => {
          window.addEventListener(evt, resetInactivityTimer, true);
        }
      );
      resetInactivityTimer();
    }
  });
}

// Listen for messages from background to trigger lock
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === "lock_screen") {
    createLockOverlay();
  }
});

// Optionally, expose a function for testing
window.lockScreen = createLockOverlay;

// Setup inactivity monitor on load
setupInactivityMonitor();
// Also listen for changes to the inactivity timeout setting
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.screenLockInactivity) {
    setupInactivityMonitor();
  }
});

// Listen for a custom event from the page context to trigger the lock overlay (for testing)
window.addEventListener("screenLockTrigger", () => {
  createLockOverlay();
});
