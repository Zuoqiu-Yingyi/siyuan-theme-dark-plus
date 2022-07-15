export { 
    getFile,
    putFile,
}

import { config } from './config.js';

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
