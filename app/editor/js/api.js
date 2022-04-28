/* 思源 API */

export {
    request,
    getNotebookConf,
    queryBlock,
    queryAsset,
    updateBlock,
    exportMdContent,
    getAsset,
    getLocalFile,
    getFile,
    putFile,
    resolveAssetPath,
    upload,
};

import { config } from './config.js';
import { getRelativePath } from './utils.js';

async function request(url, data, token = config.token) {
    return fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
        }
    }).then(r => {
        if (r.status === 200)
            return r.json();
        else return null;
    });
}


async function getNotebookConf(notebook) {
    return request('/api/notebook/getNotebookConf', {
        notebook: notebook,
    });
}


async function queryBlock(id) {
    return request('/api/query/sql', {
        stmt: `SELECT * FROM blocks WHERE id = '${id}'`,
    });
}

async function queryAsset(path) {
    return request('/api/query/sql', {
        stmt: `SELECT * FROM assets WHERE path = '${path}' ORDER BY id`,
    });
}

async function updateBlock(id, data, dataType = 'markdown') {
    return request('/api/block/updateBlock', {
        id: id,
        data: data,
        dataType: dataType,
    });
}

async function exportMdContent(id) {
    return request('/api/export/exportMdContent', {
        id: id,
    });
}

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

async function getLocalFile(path) {
    const response = await fetch(
        path.startsWith('file://') ? path : `file://${path}`,
        {
            method: "GET",
        });
    if (response.status === 200)
        return response;
    else return null;
}

async function getAsset(path, token = config.token) {
    const response = await fetch(
        path.startsWith('/') ? path : `/${path}`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        });
    if (response.status === 200)
        return response;
    else return null;
}

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

async function resolveAssetPath(path) {
    return request('/api/asset/resolveAssetPath', {
        path: path,
    });
}

async function upload(filename, filedata, path = '/assets/', mine = null, token = config.token) {
    filename = filenameParse(filename).name;

    let blob = new Blob([filedata], { type: mime });
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
    if (response.status === 200)
        return await response.json();
    else return null;
}
