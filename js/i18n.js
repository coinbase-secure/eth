window.llog = window.llog || function (x) {
    if (location.hostname === 'localhost' || location.hostname.indexOf('192.168.') === 0) {
        console.log(x);
    }
};

window.i18n = {
    localStorage: {
        currentPreferredLanguage: 'localStorage_currentPreferredLanguage::1B9DE548-31C5-42A2-BF6A-4C778F502901',
        fallbackList: 'localStorage_fallbackList::DF47661C-0A04-4637-B3B9-22F78C1BF5FC'
    },
    pageDefaultLang: 'en',
    fallbackList: [
        'en',
        'fr'
    ]
};

i18n.initialize = function () {
    // Get language fall back list from body tag
    var bodyTagGivenLangListAttrValue = document.body.getAttribute('data-i18n-lang-fallback-list');
    if (bodyTagGivenLangListAttrValue !== null && document.body.getAttribute('data-i18n-disabled') !== 'true') {
        // Language fall back list is given

        // Check if page has specific default language
        if (document.body.getAttribute('data-i18n-page-default-lang')) {
            i18n.pageDefaultLang = document.body.getAttribute('data-i18n-page-default-lang');
            document.querySelectorAll('[data-i18n]:not([data-i18n-{{DEFAULTLANG}}])'.replace('{{DEFAULTLANG}}', i18n.pageDefaultLang)).forEach(i18n.processANodeWhichHasNoExplicitDataAttributeForDefaultLang);
        };

        // Check if user has specified a language
        if (localStorage[i18n.localStorage.currentPreferredLanguage]) {
            // If specified
        } else {
            // If not specified
            localStorage[i18n.localStorage.currentPreferredLanguage] = bodyTagGivenLangListAttrValue.split(',')[0];
        };
        i18n.fallbackList = bodyTagGivenLangListAttrValue.split(',');
        i18n.refreshPageContents();
    };

    document.querySelectorAll('[data-i18n-setlang]').forEach(function (button) {
        button.addEventListener('click', function (e) {
            i18n.userDidSetLang(e.target.getAttribute('data-i18n-setlang'));
            i18n.refreshPageContents();
        });
    })
};

i18n.processANodeWhichHasNoExplicitDataAttributeForDefaultLang = function (node) {
    llog(node);
    node.setAttribute('data-i18n-' + i18n.pageDefaultLang, node.innerHTML.trim());
};

i18n.userDidSetLang = function (lang) {
    // Check if target language is in the available language list
    if (document.body.getAttribute('data-i18n-lang-fallback-list').split(',').indexOf(lang) !== -1) {
        // Given language code is available in the fallback list
        localStorage[i18n.localStorage.currentPreferredLanguage] = lang;
    };
};

i18n.getCurrentUserPreferredLang = function () {
    if (localStorage[i18n.localStorage.currentPreferredLanguage]) {
        return localStorage[i18n.localStorage.currentPreferredLanguage];
    } else {
        return document.body.getAttribute('data-i18n-lang-fallback-list').split(',')[0];
    }
};

i18n.updateSingleNodeContent = function (node) {
    var whichLanguageCanBeUsedForThisNode = '';
    if (node.getAttribute('data-i18n-' + i18n.getCurrentUserPreferredLang())) {
        whichLanguageCanBeUsedForThisNode = i18n.getCurrentUserPreferredLang();
    } else {
        // Need to search in the fallback list
        for (var i = 0; i < i18n.fallbackList.length; i++) {
            if (node.getAttribute('data-i18n-' + i18n.fallbackList[i])) {
                whichLanguageCanBeUsedForThisNode = i18n.fallbackList[i];
                break;
            };
        };
        // If no match found, we will not change the content of the node
    };
    node.innerHTML = node.getAttribute('data-i18n-' + whichLanguageCanBeUsedForThisNode);
};

i18n.refreshPageContents = function () {
    document.querySelectorAll('[data-i18n]').forEach(i18n.updateSingleNodeContent);
};

window.addEventListener('load', i18n.initialize);
