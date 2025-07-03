🔒 Screen Lock Privacy Shield
Keep nosy eyes off your screen — instantly.
Screen Lock Privacy Shield is a lightweight Chrome extension that locks your current tab with a blurred overlay and a password box, protecting your private content with a single shortcut.

🚀 Why Use This?
Whether you're working in public, presenting on screen, or just stepping away from your desk — one keystroke is all it takes to hide your screen contents from view and unlock it only when you're ready.

✨ Key Features
🔐 Password-Protected Screen Lock
Blur your current tab and lock it with a password instantly.

⚡ Quick Access Shortcut
Use Ctrl + Shift + L to activate the lock without lifting your mouse.

🎛️ Customizable Settings (via Popup)

Set/change password

Choose between light and dark overlay

Adjust blur strength

Set inactivity timeout (auto-lock)

🌐 Works on All Websites
From Google Docs to YouTube — this overlay works everywhere.

🧠 Persistent & Secure
Settings are saved locally in your browser using Chrome’s secure storage. No cloud. No spying.

🧭 User Flow Overview

![image](https://github.com/user-attachments/assets/3c434111-d207-429d-8fdc-0177da7e153e)


🖼️ Screenshots
Lock Overlay Example	Popup Settings
![image](https://github.com/user-attachments/assets/eb6155b8-f306-420a-aa2f-321376b19fdc)

![image](https://github.com/user-attachments/assets/96890f89-0f02-4c0b-bd81-a9a8b7016de5)

![image](https://github.com/user-attachments/assets/e95b0c51-3e3d-450c-8750-46b0f8c91946)






🔧 How to Test It Locally
Go to chrome://extensions

Enable Developer mode (top right)

Click Load unpacked

Select the chrome extension folder from this repo

The extension will now appear in your toolbar — ready to use!

🧪 Feature Testing Checklist
✅ Set password from popup
✅ Use Ctrl + Shift + L to lock screen
✅ Try unlocking with correct/incorrect passwords
✅ Adjust blur level and verify changes
✅ Change overlay theme (dark/light)
✅ Enable and test inactivity timeout
✅ Visit different websites to confirm compatibility

🔁 Updating the Extension
If you make any changes:

Go to chrome://extensions

Click the Reload 🔄 icon for your extension

Refresh any open tab to re-inject content scripts

📦 Tech Stack
Manifest V3 Chrome Extension

Background Service Worker

Content Script for Overlay

Popup UI with HTML/CSS/JS

chrome.storage.local for secure setting storage

🙋 FAQ
Does this extension send my data anywhere?
Nope. All data stays in your browser.

What if I forget my password?
You'll need to remove and reinstall the extension — it's a privacy shield after all.

Can I use this on Gmail, YouTube, Google Docs, etc.?
Absolutely. It works on any tab.

🧩 Contributing
Want to improve this project or add features? PRs are welcome!
For ideas, bugs, or improvements — open an issue or start a discussion.
