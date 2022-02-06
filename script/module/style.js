/* 渲染自定义样式 */
function renderCustomStyle(styles) {
    const doc = window.document;
    doc.querySelectorAll(`div[data-node-id][custom-style]`).forEach((item, i, obj) => {
        let attr = item.getAttribute(`custom-style`);
        item.querySelectorAll(`div[contenteditable][spellcheck]`).forEach((item, i, obj) => {
            item.style.cssText = attr;
        });
    });
    for (let i in styles) {
        let style = styles[i];
        doc.querySelectorAll(`div[data-node-id][custom-${style}]`).forEach((item, i, obj) => {
            let attr = item.getAttribute(`custom-${style}`);
            item.querySelectorAll(`div[contenteditable][spellcheck]`).forEach((item, i, obj) => {
                item.style[style] = attr;
            });
        });
    }
}

(function () {
    setInterval(() => {
        renderCustomStyle([
            'font-size',  // 自定义字体大小
            'font-family',  // 自定义字体
            'writing-mode',  // 自定义文字方向
        ])
    }, 2000);
})();
