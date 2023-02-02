export {
    getFile,
    putFile,
    upload,
    getBlockAttrs,
    setBlockAttrs,
    queryBlock,
    insertBlock,
    appendBlock,
    updateBlock,
    deleteBlock,
    jupyter,
}

import { config } from './config.js';
import { custom } from '../../public/custom.js';
import { getCookie } from './utils.js';

/* 读取文件 */
async function getFile(path, token = config.token) {
    const response = await fetch(
        '/api/file/getFile', {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
            path: path,
        }),
    });
    if (response.ok)
        return response;
    else return null;
}

/* 写入文件 */
async function putFile(path, filedata, isDir = false, modTime = Date.now(), token = config.token) {
    let blob = new Blob([filedata]);
    let file = new File([blob], path.split('/').pop());
    let formdata = new FormData();
    formdata.append("path", path);
    formdata.append("file", file);
    formdata.append("isDir", isDir);
    formdata.append("modTime", modTime);
    const response = await fetch(
        "/api/file/putFile",
        {
            body: formdata,
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
            },
        });
    if (response.ok)
        return await response.json();
    else return null;
}

/* 上传资源文件 */
async function upload(
    blob = null,
    filedata = { data: null, mime: null },
    filename = 'file',
    path = '/assets/',
    token = config.token,
) {
    blob = blob || new Blob([filedata.data], { type: filedata.mime });
    let file = new File([blob], filename, { lastModified: Date.now() });
    let formdata = new FormData();
    formdata.append("assetsDirPath", path);
    formdata.append("file[]", file);
    const response = await fetch(
        "/api/asset/upload",
        {
            body: formdata,
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
            },
        });
    if (response.ok)
        return await response.json();
    else return null;
}

/* siyuan 请求 */
async function siyuanRequest(url, data, token) {
    let response = await fetch(
        url,
        {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(data),
        },
    );
    if (response.ok) response = await response.json();
    else return null;
    if (response.code === 0) return response.data;
    else return null;
}

/* 获取块属性 */
async function getBlockAttrs(id, token = config.token) {
    return siyuanRequest('/api/attr/getBlockAttrs', { id: id }, token);
}

/* 设置块属性 */
async function setBlockAttrs(id, attrs, token = config.token) {
    return siyuanRequest('/api/attr/setBlockAttrs', { id: id, attrs: attrs }, token);
}

/* 查询块 */
async function queryBlock(id, token = config.token) {
    return siyuanRequest(
        '/api/query/sql',
        { stmt: `SELECT * FROM blocks WHERE id = '${id}'` },
        token,
    );
}

/* 插入块 */
async function insertBlock(previousID, data, dataType = 'markdown', token = config.token) {
    return siyuanRequest(
        '/api/block/insertBlock',
        {
            previousID,
            dataType,
            data,
        },
        token,
    );
}

/* 插入后置子块 */
async function appendBlock(parentID, data, dataType = 'markdown', token = config.token) {
    return siyuanRequest(
        '/api/block/appendBlock',
        {
            parentID,
            dataType,
            data,
        },
        token,
    );
}

/* 更新块 */
async function updateBlock(id, data, dataType = 'markdown', token = config.token) {
    return siyuanRequest(
        '/api/block/updateBlock',
        {
            id,
            dataType,
            data,
        },
        token,
    );
}

/* 删除块 */
async function deleteBlock(id, token = config.token) {
    return siyuanRequest(
        '/api/block/deleteBlock',
        {
            id,
        },
        token,
    );
}

const URLs = {
    kernels: `/api/kernels`,
    sessions: `/api/sessions`,
    kernelspecs: `/api/kernelspecs`,
};

/* jupyter 请求 */
async function jupyterRequest(
    url,
    method = 'GET',
    isParser = true,
    data = {},
    header = {
        'Authorization': `token ${custom.jupyter.token}`,
        'Cookie': custom.jupyter.cookies,
        'X-XSRFToken': getCookie('_xsrf', custom.jupyter.cookies),
    },
) {
    let init;
    switch (method) {
        case 'GET':
        case 'HEAD':
            init = {
                method: method,
                headers: header,
                // REF [关于fetch方法设置cookie](https://blog.csdn.net/qq_37822951/article/details/83216205)
                credentials: 'include',
                // mode: 'cors',
            };
            break;
        default:
            init = {
                body: JSON.stringify(data),
                method: method,
                headers: header,
                credentials: 'include',
                // mode: 'cors',
            };
            break;
    }
    return fetch(url, init).then(r => {
        if (r.ok)
            return isParser ? r.json() : r;
        else return null;
    });
}

const jupyter = {
    request: jupyterRequest,
    kernels: {
        /* 获得当前活动内核列表 */
        get: async (url = `${custom.jupyter.server}${URLs.kernels}`) => {
            return jupyterRequest(url);
        },
        interrupt: async (kernel_id, url = `${custom.jupyter.server}${URLs.kernels}`) => {
            return jupyterRequest(`${url}/${kernel_id}/interrupt`, 'POST', false);
        },
        restart: async (kernel_id, url = `${custom.jupyter.server}${URLs.kernels}`) => {
            return jupyterRequest(`${url}/${kernel_id}/restart`, 'POST');
        },
    },
    sessions: {
        /* 获得当前活动会话列表 */
        get: async (url = `${custom.jupyter.server}${URLs.sessions}`) => {
            return jupyterRequest(url);
        },
        /* 新建会话 */
        post: async (
            data = {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                path: "string",
                name: "string",
                type: "string",
                kernel: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    name: "string",
                    last_activity: "string",
                    connections: 0,
                    execution_state: "string"
                }
            },
            url = `${custom.jupyter.server}${URLs.sessions}`,
        ) => {
            return jupyterRequest(url, 'POST', true, data);
        },
        /* 更新会话信息 */
        patch: async (
            session_id,
            data = {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                path: "string",
                name: "string",
                type: "string",
                kernel: {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    name: "string",
                    last_activity: "string",
                    connections: 0,
                    execution_state: "string"
                }
            },
            url = `${custom.jupyter.server}${URLs.sessions}`,
        ) => {
            return jupyterRequest(`${url}/${session_id}`, 'PATCH', true, data);
        },
        /* 删除会话 */
        delete: async (session_id, url = `${custom.jupyter.server}${URLs.sessions}`) => {
            return jupyterRequest(`${url}/${session_id}`, 'DELETE', false);
        },
    },
    kernelspecs: {
        /* 获得当前活动内核列表 */
        get: async (url = `${custom.jupyter.server}${URLs.kernelspecs}`) => {
            return jupyterRequest(url);
        },
    },
}


