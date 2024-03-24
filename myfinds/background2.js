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
