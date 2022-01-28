/** 使用形如 id=<块 ID> 的 URL 参数跳转到指定的块
 *  REF [leolee9086](https://github.com/leolee9086)
 */
function urlParser(url) {
    url = url || '';
    const queryObj = {};
    const reg = /[?&]([^=&#]+)=([^&#]*)/g;
    const queryArr = url.match(reg) || [];
    console.log(queryArr)
    for (const i in queryArr) {
        if (Object.hasOwnProperty.call(queryArr, i)) {
            const query = queryArr[i].split('=');
            const key = query[0].substr(1);
            const value = decodeURIComponent(query[1]);
            queryObj[key] ? queryObj[key] = [].concat(queryObj[key], value) : queryObj[key] = value;
        }
    }
    console.log(queryObj)
    return queryObj;

}
function goto(id) {
    let doc = window.document
    console.log(doc)
    let link = doc.createElement("span")
    link.setAttribute("data-type", "block-ref")
    link.setAttribute("data-id", id)
    let target = doc.querySelector(".protyle-wysiwyg div[data-node-id] div[contenteditable]")
    if (target) {
        target.appendChild(link)
        let event = doc.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
        link.remove()
    }
    else {
        setTimeout(async () => 窗口内打开思源块(id), 100)
    }


}
async function jumpToID() {
    let url参数 = urlParser(window.location.href)
    if (url参数) {
        let id = url参数.id
        if (id) {
            this.goto(id)
        }
    }
}
window.onload = setTimeout(jumpToID(), 0)
