// this is the function that sends a message to the background script for URL detection
function detectMaliciousURL() {
  // this gets the current URL of the tab
  const url = window.location.href;

  // this sends a message to the background script
  chrome.runtime.sendMessage({ action: 'detectMaliciousURL', url }, (response) => {
    if(chrome.runtime.lastError){
      // any error that occurs during message sending is logged here
      console.error('Error sending message:', chrome.runtime.lastError.message);
      // the error is handled appropriately by display an error message to the user
    } else {
      displayMaliciousURLDialog(response.isMalicious);
      // Message sent successfully that handles the response 
    }
     });
}

// Listener for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showMaliciousURLDialog') {
    //this handles the message to display the malicious URl dialog box
    displayMaliciousURLDialog(message.isMalicious);
  }
});

// this Function displays a dialogue box indicating if the URL is malicious or not
function displayMaliciousURLDialog(isMalicious) {
  const dialog = document.createElement('div');
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.padding = '20px';
  dialog.style.borderRadius = '5px';
  dialog.style.color = 'white';
  dialog.style.fontFamily = 'Arial, sans-serif';
  dialog.style.zIndex = '9999';
  dialog.style.fontSize = '16px';

  if (isMalicious === true) {
    dialog.textContent = 'Warning: Malicious URL Detected!';
    dialog.style.backgroundColor = 'red';
    dialog.style.animation = 'shake 0.5s ease-in-out'; // Added a bit of animation for warning
  } else {
    dialog.textContent = 'URL is Safe.';
    dialog.style.backgroundColor = 'blue';
    dialog.style.animation = 'none'; // Disabled animation for non-malicious URLs
  }

  document.body.appendChild(dialog);

  // Removing the dialog after 5 seconds
  setTimeout(() => {
    dialog.parentNode.removeChild(dialog);
  }, 5000);
}

detectMaliciousURL();