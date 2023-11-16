const fetchTranslations = async (lang) => {
    try {
        const response = await fetch(`./translations/${lang}.json`);
        const translation = await response.json();
        return translation;
    } catch (error) {
        console.error("Error fetching translations:", error);
        return null;
    }
};

const translate = async (key) => {
    const userLanguage = navigator.language || navigator.userLanguage;
    const translation = (await fetchTranslations(userLanguage === 'it' ? 'it' : 'en')) || translations.en;

    if (typeof translation[key] === 'object') {
        return translation[key];
    }

    return translation[key] || key;
};

export { translate };
