export {
    getFile,
    putFile,
    getBlockAttrs,
    setBlockAttrs,
    jupyter,
}

import {
    config,
    custom,
} from './config.js';
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
    if (response.status === 200)
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
    if (response.status === 200)
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
    if (response.status === 200) response = await response.json();
    else return null;
    if (response.code === 0) return response.data;
    else return null;
}

/* 获取块属性 */
async function getBlockAttrs(id, token = config.token) {
    return siyuanRequest('/api/attr/getBlockAttrs', {id: id}, token);
}

/* 设置块属性 */
async function setBlockAttrs(id, attrs, token = config.token) {
    return siyuanRequest('/api/attr/setBlockAttrs', {id: id, attrs: attrs}, token);
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
        Cookie: custom.jupyter.cookies,
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
            };
            break;
        default:
            init = {
                body: JSON.stringify(data),
                method: method,
                headers: header,
            };
            break;
    }
    return fetch(url, init).then(r => {
        if (r.status >= 200 && r.status < 300)
            return isParser ? r.json() : r;
        else return null;
    });
}

const jupyter = {
    kernels: {
        /* 获得当前活动内核列表 */
        get: (url = `${custom.jupyter.server}${URLs.kernels}`) => {
            return jupyterRequest(url);
        },
        interrupt: (kernel_id, url = `${custom.jupyter.server}${URLs.kernels}`) => {
            return jupyterRequest(`${url}/${kernel_id}/interrupt`, 'POST', false);
        },
        restart: (kernel_id, url = `${custom.jupyter.server}${URLs.kernels}`) => {
            return jupyterRequest(`${url}/${kernel_id}/restart`, 'POST');
        },
    },
    sessions: {
        /* 获得当前活动会话列表 */
        get: (url = `${custom.jupyter.server}${URLs.sessions}`) => {
            return jupyterRequest(url);
        },
        /* 新建会话 */
        post: (
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
        patch: (
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
        delete: (session_id, url = `${custom.jupyter.server}${URLs.sessions}`) => {
            return jupyterRequest(`${url}/${session_id}`, 'DELETE', false);
        },
    },
    kernelspecs: {
        /* 获得当前活动内核列表 */
        get: (url = `${custom.jupyter.server}${URLs.kernelspecs}`) => {
            return jupyterRequest(url);
        },
    },
}


