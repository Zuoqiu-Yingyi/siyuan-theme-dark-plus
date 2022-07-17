/* 不可外部访问的自定义配置 */

export {
    custom,
    saveCustomFile,
    loadCustomFile,
};

import { config } from './config.js';
import { merge } from './utils.js';
import {
    getFile,
    putFile,
} from './api.js';

// 自定义配置
var custom = {
    jupyter: {
        server: '',
        cookies: '',
        token: '',
    },
};

/* 保存用户配置至文件 */
async function saveCustomFile(data = custom, path = config.customJsonFilePath) {
    const response = await putFile(path, JSON.stringify(data, undefined, 4));
    // console.log(response);
    return response;
}

/* 重新加载用户配置文件 */
async function loadCustomFile(path = config.customJsonFilePath) {
    let customjson = await getFile(path);
    if (customjson) customjson = await customjson.json();
    return customjson;
}

try {
    const customjson = await loadCustomFile();
    if (customjson) merge(custom, customjson);
    await saveCustomFile(custom);
} catch (err) {
    console.warn(err);
} finally {
    console.log(custom);
}
