/* 思源 API 调用
   REF [cc-baselib/siYuanApi.js at main · leolee9086/cc-baselib](https://github.com/leolee9086/cc-baselib/blob/main/src/siYuanApi.js)
 */

import { config } from './../module/config.js';

export {
    向思源请求数据 as request,
    交互业务 as transactions,
    以sql向思源请求块数据 as sql,
    获取思源块链接锚文本 as getAnchor,

    新建思源笔记本 as createNotebook,
    删除思源笔记本 as removeNotebook,
    保存思源笔记本配置 as setNotebookConf,
    向思源请求笔记本列表 as lsNotebooks,
    获取思源笔记本配置 as getNotebookConf,
    打开思源笔记本 as openNotebook,
    关闭思源笔记本 as closeNotebook,
    重命名思源笔记本 as renameNotebook,

    通过markdown创建文档 as createDocWithMd,
    删除思源文档 as removeDoc,
    重命名思源文档 as renameDoc,
    移动思源文档 as moveDoc,
    以id获取文档内容 as getDoc,
    以id获取文档聚焦内容 as getFocusedDoc,
    以id获取文档块markdown as exportMdContent,
    以id获取文档大纲 as getDocOutline,

    以id获取思源块属性 as getBlockAttrs,
    设置思源块属性 as setBlockAttrs,

    根据思源路径获取人类可读路径 as getHPathByPath,
    根据块ID查询文档人类可读完整路径 as getHPathByID,
    列出指定路径下文档 as listDocsByPath,
    以id获取反向链接 as getBacklink,
    以sql获取嵌入块内容 as searchEmbedBlock,
    获取标签列表 as getTag,
    导出模板 as docSaveAsTemplate,
    渲染模板 as render,

    以id获取局部图谱 as getLocalGraph,
    获取全局图谱 as getGraph,

    以关键词搜索文档 as searchDocs,
    以关键词搜索块 as searchBlock,
    以关键词搜索模板 as searchTemplate,

    插入块 as insertBlock,
    插入前置子块 as prependBlock,
    插入后置子块 as appendBlock,
    删除块 as deleteBlock,
    更新块 as updateBlock,
    以id获取思源块信息 as getBlockByID,
    获取块kramdown源码 as getBlockKramdown,
    获取块面包屑 as getBlockBreadcrumb,

    获取系统字体列表 as getSysFonts,
    获取文件 as getFile,
    写入文件 as putFile,

    推送消息 as pushMsg,
    推送报错消息 as pushErrMsg,
};

async function 向思源请求数据(url, data) {
    let resData = null
    await fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            Authorization: `Token ${config.token}`,
        }
    }).then(function (response) { resData = response.json() })
    return resData
}

async function 解析响应体(response) {
    let r = await response
    // console.log(r)
    return r.code === 0 ? r.data : null
}

async function 交互业务(protyle, transactions = []) {
    const url = '/api/transactions'
    const ws_url = new URL(protyle.ws.ws.url);
    const data = {
        app: ws_url.searchParams.get('app'),
        session: ws_url.searchParams.get('id'),
        transactions: transactions,
    };
    return 解析响应体(向思源请求数据(url, data))
}

async function 以sql向思源请求块数据(sql) {
    let sqldata = {
        stmt: sql,
    }
    let url = '/api/query/sql'
    return 解析响应体(向思源请求数据(url, sqldata))
}

async function 向思源请求笔记本列表() {
    let sqldata = { stmt: sql语句 }
    let url = '/api/notebook/lsNotebooks'
    return 解析响应体(向思源请求数据(url, sqldata))
}

async function 获取思源块链接锚文本(链接源文本) {
    链接源文本 = 链接源文本.replace("((", "").replace("))", "")
    let sql = `select * from blocks where id = '${链接源文本}'`
    let 临时块属性 = await 以sql向思源请求块数据(sql)
    //  console.log ("临时块属性",临时块属性)
    let anchor = ""
    if (临时块属性) {
        try {
            if (临时块属性[0][
                name]) {
                anchor = 临时块属性[0][
                    name]
            }
            else if (临时块属性[0]["content"]) { anchor = 临时块属性[0]["content"] }
            else { anchor = 链接源文本 }
        }
        catch (e) { anchor = "解析错误" }
    }
    //   console.log("锚文本",anchor)
    return anchor
}

async function 打开思源笔记本(笔记本id) {
    let data = {
        notebook: 笔记本id,
    }
    let url = '/api/notebook/openNotebook'
    return 解析响应体(向思源请求数据(url, data))
    //返回空数据
}

async function 关闭思源笔记本(笔记本id) {
    let data = {
        notebook: 笔记本id,
    }
    let url = '/api/notebook/closeNotebook'
    return 解析响应体(向思源请求数据(url, data))
    //返回空数据
}

async function 重命名思源笔记本(笔记本id, 笔记本的新名称) {
    let data = {
        notebook: 笔记本id,
        name: 笔记本的新名称,
    }
    let url = '/api/notebook/renameNotebook'
    return 解析响应体(向思源请求数据(url, data))
    //返回空数据
}

async function 新建思源笔记本(笔记本名称) {
    let data = {
        name: 笔记本名称,
    }
    let url = '/api/notebook/createNotebook'
    return 解析响应体(向思源请求数据(url, data))
    //返回空数据
}

async function 删除思源笔记本(笔记本id) {
    let data = { notebook: 笔记本id }
    let url = '/api/notebook/removeNotebook'
    return 解析响应体(向思源请求数据(url, data))
    //返回空数据
}

async function 获取思源笔记本配置(笔记本id) {
    let data = { notebook: 笔记本id }
    let url = '/api/notebook/getNotebookConf'
    return 解析响应体(向思源请求数据(url, data))
    //返回笔记本配置
}

async function 保存思源笔记本配置(笔记本id) {
    let data = { notebook: 笔记本id }
    let url = '/api/notebook/setNotebookConf'
    return 解析响应体(向思源请求数据(url, data))
    //返回笔记本配置
}

async function 重命名思源文档(笔记本id, 文档路径, 文档新标题) {
    let data = {
        notebook: 笔记本id,
        path: 文档路径,
        title: 文档新标题,
    }
    let url = '/api/filetree/renameDoc'
    return 解析响应体(向思源请求数据(url, data))
    //返回空数据
}

async function 删除思源文档(笔记本id, 文档路径) {
    let data = {
        notebook: 笔记本id,
        path: 文档路径,
    }
    let url = '/api/filetree/removeDoc'
    return 解析响应体(向思源请求数据(url, data))
    //返回空数据
}

async function 移动思源文档(源笔记本ID, 源路径, 目标笔记本ID, 目标路径) {
    let data = {
        fromNotebook: 源笔记本ID,
        fromPath: 源路径,
        toNotebook: 目标笔记本ID,
        toPath: 目标路径,
    }
    let url = '/api/filetree/moveDoc'
    return 解析响应体(向思源请求数据(url, data))
    //返回空数据
}

async function 根据思源路径获取人类可读路径(笔记本ID, 路径) {
    let data = {
        Notebook: 笔记本ID,
        Path: 路径,
    }
    let url = '/api/filetree/getHPathByPath'
    return 解析响应体(向思源请求数据(url, data))
    //返回路径
}

async function 根据块ID查询文档人类可读完整路径(ID) {
    let data = {
        id: ID,
    }
    let url = '/api/filetree/getHPathByID'
    return 解析响应体(向思源请求数据(url, data))
}

//暂缺上传文件

async function 以id获取思源块属性(内容块id) {
    let data = {
        id: 内容块id,
    }
    let url = '/api/attr/getBlockAttrs'
    return 解析响应体(向思源请求数据(url, data))
}

async function 以id获取思源块信息(内容块id) {
    let sql = `select * from blocks where id ='${内容块id}'`
    let data = await 以sql向思源请求块数据(sql)
    return data[0]
}

async function 获取块kramdown源码(内容块id) {
    const data = {
        id: 内容块id,
    }
    const url = '/api/block/getBlockKramdown'
    return 解析响应体(向思源请求数据(url, data))
}

async function 获取块面包屑(ID) {
    const data = {
        id: ID,
    }
    const url = '/api/block/getBlockBreadcrumb'
    return 解析响应体(向思源请求数据(url, data))
}

async function 设置思源块属性(内容块id, 属性对象) {
    let url = '/api/attr/setBlockAttrs'
    return 解析响应体(向思源请求数据(url, {
        id: 内容块id,
        attrs: 属性对象,
    }))
}

async function 以id获取文档块markdown(文档id) {
    let data = {
        id: 文档id,
    }
    let url = '/api/export/exportMdContent'
    return 解析响应体(向思源请求数据(url, data))
    //文档hepath与Markdown 内容
}

async function 以id获取文档大纲(文档id) {
    let data = {
        id: 文档id,
    }
    let url = '/api/outline/getDocOutline'
    return 解析响应体(向思源请求数据(url, data))
}

async function 列出指定路径下文档(路径) {
    let data = {
        path: 路径,
    }
    let url = '/api/filetree/listDocsByPath'
    return 解析响应体(向思源请求数据(url, data))
    //文档hepath与Markdown 内容
}

function html转义(原始字符串) {
    var 临时元素 = document.createElement("div");
    临时元素.innerHTML = 原始字符串;
    var output = 临时元素.innerText || 临时元素.textContent;
    临时元素 = null;
    // console.log(output)
    return output;
}

async function 以id获取反向链接(id) {
    let data = {
        id: id,
        beforeLen: 10,
        k: "",
        mk: ""
    }
    let url = '/api/ref/getBacklink'
    return 解析响应体(向思源请求数据(url, data))
}

async function 以sql获取嵌入块内容(外部id数组, sql) {
    let data = {
        stmt: sql,
        excludeIDs: 外部id数组,
    }
    let url = '/api/search/searchEmbedBlock'
    return 解析响应体(向思源请求数据(url, data))

}
async function 以id获取文档内容(id) {
    let data = {
        id: id,
        k: "",
        mode: 2,
        size: 36,
    }
    let url = '/api/filetree/getDoc'
    return 解析响应体(向思源请求数据(url, data))
}
async function 以id获取文档聚焦内容(id) {
    let data = {
        id: id,
        k: "",
        mode: 0,
        size: 36,
    }
    let url = '/api/filetree/getDoc'
    return 解析响应体(向思源请求数据(url, data))
}
async function 获取标签列表() {
    let data = {}
    let url = '/api/tag/getTag'
    return 解析响应体(向思源请求数据(url, data))
}
async function 以id获取局部图谱(k, id, conf, reqId) {
    let data = {
        id: id,
        k: k,
        conf: conf,
        reqId: reqId,
    }
    let url = '/api/graph/getLocalGraph'
    return 解析响应体(向思源请求数据(url, data))
}
async function 获取全局图谱(k, conf, reqId) {
    let data = {
        k: k,
        conf: conf,
        reqId: reqId,
    }
    let url = '/api/graph/getGraph'
    return 解析响应体(向思源请求数据(url, data))
}

async function 以关键词搜索文档(k) {
    let data = {
        k: k,
    }
    let url = '/api/filetree/searchDocs'
    return 解析响应体(向思源请求数据(url, data))
}
async function 以关键词搜索块(query) {
    let data = {
        "query": query,
    }
    let url = '/api/search/searchBlock'
    return 解析响应体(向思源请求数据(url, data))
}
async function 以关键词搜索模板(k) {
    let data = {
        k: k,
    }
    let url = '/api/search/searchTemplate'
    return 解析响应体(向思源请求数据(url, data))
}

async function 通过markdown创建文档(notebook, path, markdown) {
    let data = {
        notebook: notebook,
        path: path,
        markdown: markdown,
    }
    let url = '/api/filetree/createDocWithMd'
    return 解析响应体(向思源请求数据(url, data))
}

async function 导出模板(id, overwrite = false) {
    let url = '/api/template/docSaveAsTemplate'
    let data = {
        id: id,
        overwrite: overwrite,
    }
    return 解析响应体(向思源请求数据(url, data))
}

async function 渲染模板(data) {
    let url = '/api/template/render'
    return 解析响应体(向思源请求数据(url, data))
}

async function 插入块(previousID, dataType, data) {
    let url = '/api/block/insertBlock'
    return 解析响应体(向思源请求数据(
        url = url,
        data = {
            previousID: previousID,
            dataType: dataType,
            data: data,
        },
    ))
}

async function 插入前置子块(parentID, dataType, data) {
    let url = '/api/block/prependBlock'
    return 解析响应体(向思源请求数据(
        url = url,
        data = {
            parentID: parentID,
            dataType: dataType,
            data: data,
        },
    ))
}
async function 插入后置子块(parentID, dataType, data) {
    let url = '/api/block/appendBlock'
    return 解析响应体(向思源请求数据(
        url = url,
        data = {
            parentID: parentID,
            dataType: dataType,
            data: data,
        },
    ))
}

async function 更新块(id, dataType, data) {
    let url = '/api/block/updateBlock'
    return 解析响应体(向思源请求数据(
        url = url,
        data = {
            id: id,
            dataType: dataType,
            data: data,
        },
    ))
}

async function 删除块(id) {
    let url = '/api/block/deleteBlock'
    return 解析响应体(向思源请求数据(
        url = url,
        data = {
            id: id,
        },
    ))
}

async function 获取系统字体列表() {
    let url = '/api/system/getSysFonts'
    return 解析响应体(向思源请求数据(url))
}

async function 获取文件(path) {
    const response = await fetch(
        '/api/file/getFile', {
        method: "POST",
        headers: {
            Authorization: `Token ${config.token}`,
        },
        body: JSON.stringify({
            path: path,
        }),
    });
    if (response.status === 200)
        return response;
    else return null;
}

async function 写入文件(path, filedata, isDir = false, modTime = Date.now()) {
    let blob = new Blob([filedata]);
    let file = new File([blob], path.split('/').pop());
    let formdata = new FormData();
    formdata.append("path", path);
    formdata.append("file", file);
    formdata.append("isDir", isDir);
    formdata.append("modTime", modTime);
    const response = await fetch(
        "/api/file/putFile", {
        body: formdata,
        method: "POST",
        headers: {
            Authorization: `Token ${config.token}`,
        },
    });
    if (response.status === 200)
        return await response.json();
    else return null;
}

const language = window.theme.languageMode;

async function 推送消息(message = null, text = null, timeout = 7000) {
    const url = '/api/notification/pushMsg'
    const data = {
        msg: message ? message[language] || message.other : text,
        timeout: timeout,
    }
    return 解析响应体(向思源请求数据(url, data))
}

async function 推送报错消息(message = null, text = null, timeout = 7000) {
    const url = '/api/notification/pushErrMsg'
    const data = {
        msg: message ? message[language] || message.other : text,
        timeout: timeout,
    }
    return 解析响应体(向思源请求数据(url, data))
}
