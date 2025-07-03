// Popup script for Screen Lock Chrome Extension

function attachPopupListeners() {
  const passwordInput = document.getElementById("password");
  const saveBtn = document.getElementById("save");
  const statusDiv = document.getElementById("status");
  const blurSlider = document.getElementById("blurStrength");
  const blurValue = document.getElementById("blurValue");
  const modeToggle = document.getElementById("modeToggle");
  const inactivityTimeout = document.getElementById("inactivityTimeout");

  // Load existing settings
  chrome.storage.local.get(
    [
      "screenLockPassword",
      "screenLockBlur",
      "screenLockMode",
      "screenLockInactivity",
    ],
    (result) => {
      if (result.screenLockPassword) {
        statusDiv.textContent = "Password is set.";
        statusDiv.style.color = "#1976d2";
      } else {
        statusDiv.textContent = "No password set.";
        statusDiv.style.color = "#ff6b6b";
      }
      if (result.screenLockBlur) {
        blurSlider.value = result.screenLockBlur;
        blurValue.textContent = result.screenLockBlur + "px";
      }
      if (result.screenLockMode) {
        modeToggle.value = result.screenLockMode;
      }
      if (result.screenLockInactivity !== undefined) {
        inactivityTimeout.value = result.screenLockInactivity;
      }
    }
  );

  function savePassword() {
    const pwd = passwordInput.value.trim();
    console.log(
      "[ScreenLock][Popup] Attempting to save password (chrome.storage.local):",
      pwd
    );
    if (pwd.length < 3) {
      statusDiv.textContent = "Password must be at least 3 characters.";
      statusDiv.style.color = "#ff6b6b";
      alert("Password must be at least 3 characters.");
      return;
    }
    chrome.storage.local.set({ screenLockPassword: pwd }, () => {
      if (chrome.runtime.lastError) {
        statusDiv.textContent = "Error saving password.";
        statusDiv.style.color = "#ff6b6b";
        alert("Error saving password: " + chrome.runtime.lastError.message);
        console.error(
          "Error saving password:",
          chrome.runtime.lastError.message
        );
      } else {
        statusDiv.textContent = "Password saved!";
        statusDiv.style.color = "#1976d2";
        passwordInput.value = "";
        setTimeout(() => {
          statusDiv.textContent = "Password is set.";
          statusDiv.style.color = "#1976d2";
        }, 1200);
        // Log to confirm save
        chrome.storage.local.get("screenLockPassword", (res) => {
          console.log(
            "[ScreenLock][Popup] Password in chrome.storage.local after save:",
            res.screenLockPassword
          );
        });
      }
    });
  }

  saveBtn.addEventListener("click", savePassword);
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      savePassword();
    }
  });

  // Blur slider live update
  blurSlider.addEventListener("input", () => {
    blurValue.textContent = blurSlider.value + "px";
    chrome.storage.local.set({ screenLockBlur: blurSlider.value });
  });

  // Mode toggle
  modeToggle.addEventListener("change", () => {
    chrome.storage.local.set({ screenLockMode: modeToggle.value });
  });

  // Inactivity timeout
  inactivityTimeout.addEventListener("change", () => {
    chrome.storage.local.set({ screenLockInactivity: inactivityTimeout.value });
  });
}

// Attach listeners on DOMContentLoaded and as a fallback immediately
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attachPopupListeners);
} else {
  attachPopupListeners();
}

console.log("[ScreenLock][Popup] popup.js loaded");
