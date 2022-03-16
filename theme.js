function loadScript(url) {
    let script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('src', url);
    document.head.appendChild(script);
}

function loadStyle(url) { 
    let style = document.createElement('link');
    style.setAttribute('type', 'text/css');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', url);
    document.head.appendChild(style);
}

(() => {
    loadScript("/widgets/custom.js");

    loadScript("/appearance/themes/Dark+/script/module/blockattrs.js");
    loadScript("/appearance/themes/Dark+/script/module/doc.js");
    loadScript("/appearance/themes/Dark+/script/module/goto.js");
    loadScript("/appearance/themes/Dark+/script/module/reload.js");
    loadScript("/appearance/themes/Dark+/script/module/style.js");
    loadScript("/appearance/themes/Dark+/script/module/timestamp.js");
    loadScript("/appearance/themes/Dark+/script/module/typewriter.js");
    
    loadScript("/appearance/themes/Dark+/app/comment/index.js");
    // loadScript("/appearance/themes/Dark+/script/test/listener.js");
})();
