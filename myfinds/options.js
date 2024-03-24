document.addEventListener('DOMContentLoaded', function () {
    const titleElement = document.getElementById('title');
    const headingElement = document.getElementById('heading');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const languageSelect = document.getElementById('languageSelect');

    // Load localized strings
    chrome.i18n.getAcceptLanguages(languages => {
        const userLanguage = languages[0];
        const messagesFile = `messages_${userLanguage}.json`;
        fetch(messagesFile)
            .then(response => response.json())
            .then(messages => {
                // Set title and text content
                document.title = messages.title;
                titleElement.textContent = messages.title;
                headingElement.textContent = messages.heading;
                saveButton.textContent = messages.saveButton;
                cancelButton.textContent = messages.cancelButton;

                // Set language selection
                if (userLanguage === 'fr') {
                    languageSelect.value = 'fr';
                } else {
                    languageSelect.value = 'en';
                }
            })
            .catch(error => console.error('Error loading localized strings:', error));
    });

    // Save language preference
    languageSelect.addEventListener('change', function () {
        const selectedLanguage = languageSelect.value;
        chrome.storage.sync.set({ language: selectedLanguage }, function () {
            console.log('Language preference saved:', selectedLanguage);
        });
    });

    // Load saved language preference
    chrome.storage.sync.get('language', function (data) {
        if (data.language) {
            languageSelect.value = data.language;
        }
    });
});
