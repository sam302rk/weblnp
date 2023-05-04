const languages = {
    "en-US": { // American English
        "search.placeholder": "City...",
        "search.results": "--- Search results ---",
        "search.display_window": "Change city...",
        "options.title": "--- City options ---",
        "options.layer.default": "Choose a layer...",
        "options.save": "Load",
        "error.confirm_upload": "An error occured.\nDo you wish to automatically report that error?\nOnly the error without any additional details will be sent out."
    },
    "de-DE": { // German
        "search.placeholder": "Stadt...",
        "search.results": "--- Suchergebnisse ---",
        "search.display_window": "Stadt ändern...",
        "options.title": "--- Stadtoptionen ---",
        "options.layer.default": "Wähle eine Ebene...",
        "options.save": "Übernehmen",
        "error.confirm_upload": "Ein unerwarteter Fehler ist aufgetreten.\nMöchtest du, dass dieser automatisch gemeldet wird?\nNur der Fehler ohne zusätzliche Informationen wird versendet."
    },
        "ro-RO": { // Romanian
        "search.placeholder": "Oraș...",
        "search.results": "--- Rezultatele căutării ---",
        "search.display_window": "Schimbă orașul...",
        "options.title": "--- Opțiunile orașului ---",
        "options.layer.default": "Alege un strat...",
        "options.save": "Încarcă",
        "error.confirm_upload": "A apărut o eroare.\nVrei să raportezi eroarea automat?\nDoar eroarea fără alte detalii va fii timisă."
    },
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
