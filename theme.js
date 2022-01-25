function addScript(url) {
    let script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
}

(function () {

})()
