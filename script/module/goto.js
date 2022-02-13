/** 使用形如 id=<块 ID> 的 URL 参数跳转到指定的块
 *  REF [leolee9086](https://github.com/leolee9086)
 */
function urlParser(url) {
    url = url || '';
    const queryObj = {};
    const reg = /[?&]([^=&#]+)=([^&#]*)/g;
    const queryArr = url.match(reg) || [];
    // console.log(queryArr)
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
    // console.log(doc)
    let link = doc.createElement("span")
    link.setAttribute("data-type", "block-ref")
    link.setAttribute("data-id", id)
    let target = doc.querySelector(".protyle-wysiwyg div[data-node-id] div[contenteditable]")
    if (target) {
        target.appendChild(link)
        link.click()
        link.remove()
    }
    else {
        setTimeout(async () => goto(id), 1000)
    }
}
async function jumpToID() {
    let params = urlParser(window.location.href)
    if (params) {
        let id = params.id
        if (id) {
            goto(id)
        }
    }
}
window.onload = setTimeout(jumpToID, 0)
