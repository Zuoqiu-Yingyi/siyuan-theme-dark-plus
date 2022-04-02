function loadScript(url, type = 'module') {
    let script = document.createElement('script');
    script.setAttribute('type', type);
    script.setAttribute('src', url);
    document.head.appendChild(script);
}

function loadStyle(url, id) {
    let style = document.createElement('link');
    style.setAttribute('id', id);
    style.setAttribute('type', 'text/css');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', url);
    document.head.appendChild(style);
}

function themeMode() {
    let style = document.getElementById('themeDefaultStyle');
    let url = new URL(style.getAttribute('href'));
    switch (url.pathname) {
        case '/appearance/themes/daylight/theme.css':
            return 'light';

        case '/appearance/themes/midnight/theme.css':
            return 'dark';
        default:
            return null;
    }
}

const ID_CUSTOM_STYLE = 'customStyle';

function changeThemeMode() {
    let href = null;
    switch (themeMode()) {
        case 'light':
            href = `/appearance/themes/Dark+/style/color/light.css`;
            break;
        case 'dark':
            href = `/appearance/themes/Dark+/style/color/dark.css`;
            break;
        default:
    }
    let style = document.getElementById(ID_CUSTOM_STYLE);
    if (style) {
        style.setAttribute('href', href);
    }
    else {
        loadStyle(href, ID_CUSTOM_STYLE);
    }
}

(() => {
    changeThemeMode();

    loadScript("/widgets/custom.js");

    loadScript("/appearance/themes/Dark+/script/module/blockattrs.js");
    loadScript("/appearance/themes/Dark+/script/module/doc.js");
    loadScript("/appearance/themes/Dark+/script/module/goto.js");
    loadScript("/appearance/themes/Dark+/script/module/invert.js");
    loadScript("/appearance/themes/Dark+/script/module/reload.js");
    loadScript("/appearance/themes/Dark+/script/module/style.js");
    loadScript("/appearance/themes/Dark+/script/module/timestamp.js");
    loadScript("/appearance/themes/Dark+/script/module/typewriter.js");

    loadScript("/appearance/themes/Dark+/app/comment/index.js");
    // loadScript("/appearance/themes/Dark+/script/test/listener.js");
})();
