const languages = {
    "en-US": { // American English
        "search.placeholder": "City...",
        "search.results": "--- Search results ---",
        "search.display_window": "Change city...",
        "options.title": "--- City options ---",
        "options.layer.default": "Choose a layer...",
        "options.save": "Save"
    },
    "de-DE": { // German
        "search.placeholder": "Stadt...",
        "search.results": "--- Suchergebnisse ---",
        "search.display_window": "Stadt ändern...",
        "options.title": "--- Stadtoptionen ---",
        "options.layer.default": "Wähle eine Ebene...",
        "options.save": "Übernehmen"
    }
}

let selectedLanguage = params.language || navigator.language || navigator.userLanguage || 'en-US'

// Fallback for web browsers or operating systems with different language formants.
// NOTE: Depending on the future size of the constant languages an async rewrite or some other solution might be required.
for (let lang in languages) {
    if(lang.toString().includes(selectedLanguage)) selectedLanguage = lang.toString()
}

function tryTranslation(input) {
    return languages[selectedLanguage][input] || languages['en-US'][input] || input
}

for (const node of document.getElementsByClassName('i18n')) {
    node.innerHTML = tryTranslation(node.innerHTML)
}

for (const node of document.getElementsByClassName('i18n_placeholder')) {
    node.placeholder = tryTranslation(node.placeholder)
}