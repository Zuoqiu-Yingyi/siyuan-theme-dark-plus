export {
    url,
    config,
    custom,
    saveCustomFile,
}

import {
    getFile,
    putFile,
} from './api.js';
import { merge } from './utils.js';

// url
const url = new URL(window.location.href);

var config = {
    jupyter: {
        path: {
            customJson: '/conf/appearance/themes/Dark+/app/jupyter/custom.json',
        },
        id: {
            server: {
                input: 'jupyterServerInput',
                button: 'jupyterServerButton',
            },
            cookies: {
                input: 'jupyterCookiesInput',
                button: 'jupyterCookiesButton',
            },
            kernelspec: {
            },
            session: {
                create: {
                    select: 'jupyterSessionsCreateKernelSelect',
                    refresh: 'jupyterSessionsCreateRefreshButton',

                    name: 'jupyterSessionsCreateNameInput',
                    path: 'jupyterSessionsCreatePathInput',
                    create: 'jupyterSessionsCreateButton',
                },
                manage: {
                    select: 'jupyterSessionsManageSessionSelect',
                    refresh: 'jupyterSessionsManageRefreshButton',

                    name: 'jupyterSessionsManageNameInput',
                    path: 'jupyterSessionsManagePathInput',
                    update: 'jupyterSessionsManageUpdateButton',

                    state: 'jupyterSessionsManageState',
                    start: 'jupyterSessionsManageStartButton',
                    interrupt: 'jupyterSessionsManageInterruptButton',
                    restart: 'jupyterSessionsManageRestartButton',
                    delete: 'jupyterSessionsManageDeleteButton',
                },
            },
        },
        i18n: {
            'setting-item-name': { zh_CN: '设置项名称', default: 'Setting Name' },
            'setting-item-content': { zh_CN: '设置项内容', default: 'Setting Content' },
            'setting-item-memo': { zh_CN: '设置项备注', default: 'Setting Memo' },
            'session-create': { zh_CN: '新建会话', default: 'Create Session' },
            'session-manage': { zh_CN: '管理会话', default: 'Manage Session' },
            'session-name': { zh_CN: '会话名称', default: 'Session Name' },
            'session-path': { zh_CN: '会话目录', default: 'Session Path' },
            'memo-server': { zh_CN: 'jupyter 服务', default: 'Jupyter Server' },
            'memo-cookie': { zh_CN: 'jupyter 认证', default: 'Jupyter Auth' },

            ok: { zh_CN: '确认', default: 'OK' },
            refresh: { zh_CN: '刷新', default: 'Refresh' },
            create: { zh_CN: '新建', default: 'Create' },
            update: { zh_CN: '更新', default: 'Update' },
            connect: { zh_CN: '链接', default: 'Connect' },
            interrupt: { zh_CN: '中断', default: 'Interrupt' },
            restart: { zh_CN: '重启', default: 'Restart' },
            delete: { zh_CN: '删除', default: 'Delete' },

            incomplete: { zh_CN: '信息不完整！', default: 'Incomplete information!' },
            session: { zh_CN: '会话', default: 'Session' },
            sessions: { zh_CN: '会话组', default: 'Sessions' },
        }
    },
};

// 自定义配置
var custom = {
    jupyter: {
        server: '',
        cookies: '',
    },
};

/* 保存用户配置至文件 */
async function saveCustomFile(data = custom, path = config.jupyter.path.customJson) {
    const response = await putFile(path, JSON.stringify(data, undefined, 4));
    // console.log(response);
    return response;
}

try {
    // 合并配置文件 custom.js
    const customjs = import('/widgets/custom.js');
    if (customjs.config) merge(config, customjs.config);

    // 合并配置文件 custom.json
    let customjson = await getFile(config.jupyter.path.customJson);
    if (customjson) customjson = await customjson.json();
    if (customjson) merge(custom, customjson);
} catch (err) {
    console.warn(err);
} finally {
    console.log(config);
    console.log(custom);
}
