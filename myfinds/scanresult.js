// Handle the response and update the popup UI
if (response.isMalicious !== undefined) {
    // If the response contains isMalicious property, update the result element with the corresponding message
    result.textContent = `is malicious is: ${response.isMalicious}`;
    // You can also access detailed scan results in response.scanResults if needed
} else {
    // If the response does not contain isMalicious property, log an error and update the result element with an error message
    console.error('Invalid response from background script.');
    result.textContent = ' Error: Invalid response from backgroundNot malicious';
}

// Check if there's an error in the response
if (response.error) {
    // If there's an error property in the response, log the error and update the result element with an error message
    console.error('Error from background script:', response.error);
    result.textContent = 'Error: Invalid response from background script';
}
// function to display diaolgue box
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
      dialog.style.animation = 'shake 0.5s ease-in-out'; // Add animation for warning
    } else {
      dialog.textContent = 'URL is Safe.';
      dialog.style.backgroundColor = 'blue';
      dialog.style.animation = 'none'; // Disable animation for non-malicious URLs
    }
  
    document.body.appendChild(dialog);
  
    // Remove the dialog after some time (e.g., 5 seconds)
    setTimeout(() => {
      dialog.parentNode.removeChild(dialog);
    }, 5000);
  }
  
  detectMaliciousURL();


  // the Function to handle URL detection
function detectMaliciousURL2(url, sendResponse) {
  const apiKey = '5jpTHBnMOhIdS9150xId8PluOBSWfXmA';
  const encodedUrl = encodeURIComponent(url);
  const apiUrl = `https://www.ipqualityscore.com/api/json/url/${apiKey}/${encodedUrl}`;

  //logging the URL being checked
  console.log('Checking URL:', url);
  
  // Making a request to the IPQUALITYSCORE API
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('API Response Data:', data);

      if (data && data.success) {
        console.log(data.message);
        // Checking for potential malicious URLs based on the provided factors
        if (data.malware || data.suspicious || data.spamming || data.phishing) {
          sendResponse({ isMalicious: true, message: 'The URL is unsafe' });
          console.log('Warning: URL is suspicious!');
        } else {
          sendResponse({ isMalicious: false, message: 'The URL is safe' });
          console.log(' URL is safe');
        }
      } else {
        console.error('API request was not successful:', data.message);
        sendResponse({ message: 'request not successful' });
      }
    })
    .catch(error => {
      console.error('Error detecting malicious URL:', error);
      sendResponse({ error: error.message });
    });

  return true;
}

// Listening for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.action === 'detectMaliciousURL') {
  // Calling the function to detect malicious URL
  detectMaliciousURL2(request.url, sendResponse);
  // Return true to indicate that the response will be sent asynchronously
  return true;
}
});

//this is error handling for message sending
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (chrome.runtime.lastError) {
  console.error('Error sending message:', chrome.runtime.lastError.message);
  // Handling the error appropriately by display an error message to the user
}
});
