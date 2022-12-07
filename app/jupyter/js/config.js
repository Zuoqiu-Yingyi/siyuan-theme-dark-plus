export {
    url,
    config,
    i18n,
    loadCustomJs,
}

import { merge } from './utils.js';

// url
const url = new URL(location.href);

var config = {
    jupyter: {
        path: {
            global: '/appearance/themes/Dark+/app/jupyter/settings-global.html',
            document: '/appearance/themes/Dark+/app/jupyter/settings-document.html',
        },
        regs: {
            // mark: /((?=[\x21-\x7e]+)[^A-Za-z0-9])/g, // 匹配英文符号
            mark: /([\<\>\{\}\[\]\(\)\`\~\#\$\^\*\_\=\|\:\\])/g, // 匹配需转义的英文符号
            ANSIesc: /\x1b[^a-zA-Z]*[a-zA-Z]/g, // ANSI 转义序列
            richtext: /\x1b\\?\[((?:\d*)(?:\\?;\d+)*)m([^\x1b]*)/g, // 控制台富文本控制字符
            escaped: { // 英文符号转义后的正则
                // mark: /(?:\\((?=[\x21-\x7e])[^A-Za-z0-9]))/g, // 匹配转义的英文符号
                mark: /(?:\\([\<\>\{\}\[\]\(\)\`\~\#\$\^\*\_\=\|\:\\]))/g, // 匹配转义的英文符号
                richtext: /\x1b\\\[((?:\d*)(?:\\?;\d+)*)m([^\x1b]*)/g, // 控制台富文本控制字符(被转义)
            },
        },
        import: { // 导入相关配置
            fold: {
                headling: true, // 若标题折叠, 导入后也折叠
                source: true, // 若内容折叠, 导入后也折叠
                output: true, // 若输出折叠, 导入后也折叠
                attrs: { // 折叠属性
                    fold: '1',
                },
            },
            params: { // 解析参数
                escaped: true, // 是否转义
                cntrl: true, // 是否解析控制字符
            },
        },
        output: {
            init: [ // 输出块初始化内容
                '{{{row',
                '---',
                '',
                '}}}',
            ].join('\n'),
            attrs: { // 输出块属性
                'custom-render': 'scroll', // 是否默认添加块纵向滚动条(`scroll`: 添加, ``: 不添加)
                'fold': '', // 是否默认折叠块(`1`: 折叠, ``: 不折叠)
            },
            image: {
                title: {
                    max: 128, // 图片标题最大长度
                },
            },
            ZWS: '\u200B', // 零宽空格
        },
        style: {
            success: 'color: var(--b3-card-success-color); background-color: var(--b3-card-success-background);',
            info: 'color: var(--b3-card-info-color); background-color: var(--b3-card-info-background);',
            warning: 'color: var(--b3-card-warning-color); background-color: var(--b3-card-warning-background);',
            error: 'color: var(--b3-card-error-color); background-color: var(--b3-card-error-background);',
        },
        attrs: {
            kernel: {
                id: 'custom-jupyter-kernel-id', // 内核 ID
                name: 'custom-jupyter-kernel-name', // 内核名称
                display_name: 'custom-jupyter-kernel-display-name', // 内核友好名称
                language: 'custom-jupyter-kernel-language', // 内核语言
            },
            session: {
                id: 'custom-jupyter-session-id', // 会话 ID
                name: 'custom-jupyter-session-name', // 会话名称
                path: 'custom-jupyter-session-path', // 会话路径
            },
            other: {
                prompt: `custom-prompt`, // 提示文本
            },
            code: {
                type: {
                    key: 'custom-jupyter-type',
                    value: 'code',
                },
                time: 'custom-jupyter-time',
                output: 'custom-jupyter-output',
                index: 'custom-jupyter-index',
            },
            output: {
                type: {
                    key: 'custom-jupyter-type',
                    value: 'output',
                },
                code: 'custom-jupyter-code',
                index: 'custom-jupyter-index',
            }
        },
        id: {
            server: {
                input: 'jupyterServerInput',
                button: 'jupyterServerButton',
                test: 'jupyterServerTest',
            },
            cookies: {
                input: 'jupyterCookiesInput',
                button: 'jupyterCookiesButton',
            },
            token: {
                input: 'jupyterTokenInput',
                button: 'jupyterTokenButton',
            },
            kernelspec: {
            },
            session: {
                create: {
                    select: 'jupyterSessionsCreateKernelSelect',
                    refresh: 'jupyterSessionsCreateRefreshButton',

                    image: 'jupyterSessionsCreateImage',
                    language: 'jupyterSessionsCreateLanguage',

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
                    image: 'jupyterSessionsManageImage',
                    kernel: 'jupyterSessionsManageKernel',
                    start: 'jupyterSessionsManageStartButton',
                    interrupt: 'jupyterSessionsManageInterruptButton',
                    restart: 'jupyterSessionsManageRestartButton',
                    close: 'jupyterSessionsManageCloseButton',
                },
            },
            siyuan: {
                style: {
                    id: 'app-jupyter-style',
                    href: '/appearance/themes/Dark+/app/jupyter/css/jupyter.css',
                },
            }
        },
        i18n: {
            'setting-item-name': {
                zh_CN: '设置项名称',
                zh_CHT: '設置項名稱',
                default: 'Setting Name'
            },
            'setting-item-content': {
                zh_CN: '设置项内容',
                zh_CHT: '設置項內容',
                default: 'Setting Content'
            },
            'setting-item-memo': {
                zh_CN: '设置项备注',
                zh_CHT: '設置項備註',
                default: 'Setting Memo'
            },
            'session-create': {
                zh_CN: '新建会话',
                zh_CHT: '新建會話',
                default: 'Create Session'
            },
            'session-manage': {
                zh_CN: '管理会话',
                zh_CHT: '管理會話',
                default: 'Manage Session'
            },
            'session-name': {
                zh_CN: '会话名称',
                zh_CHT: '會話名稱',
                default: 'Session Name'
            },
            'session-path': {
                zh_CN: '会话目录',
                zh_CHT: '會話目錄',
                default: 'Session Path'
            },
            'memo-server': {
                zh_CN: 'Jupyter 服务',
                zh_CHT: 'Jupyter 服務',
                default: 'Jupyter Server'
            },
            'memo-cookie': {
                zh_CN: 'Jupyter 认证 Cookies',
                zh_CHT: 'Jupyter 認證 Cookies',
                default: 'Jupyter Auth Cookies'
            },
            'memo-token': {
                zh_CN: 'Jupyter 认证令牌',
                zh_CHT: 'Jupyter 認證令牌',
                default: 'Jupyter Auth Token'
            },
            'jupyter-server-auth-faild': {
                zh_CN: 'Jupyter 服务认证失败，需要重新填写认证信息！',
                zh_CHT: 'Jupyter 服務認證失敗，需要重新填寫認證信息！',
                default: 'Jupyter authentication failed, please re-fill in the authentication information!',
            },

            ok: {
                zh_CN: '确认',
                zh_CHT: '確認',
                default: 'OK'
            },
            test: {
                zh_CN: '测试',
                zh_CHT: '測試',
                default: 'Test'
            },
            refresh: {
                zh_CN: '刷新',
                zh_CHT: '刷新',
                default: 'Refresh'
            },
            create: {
                zh_CN: '新建',
                zh_CHT: '新建',
                default: 'Create'
            },
            update: {
                zh_CN: '更新',
                zh_CHT: '更新',
                default: 'Update'
            },
            connect: {
                zh_CN: '连接',
                zh_CHT: '連接',
                default: 'Connect'
            },
            interrupt: {
                zh_CN: '中断',
                zh_CHT: '中斷',
                default: 'Interrupt'
            },
            restart: {
                zh_CN: '重启',
                zh_CHT: '重啟',
                default: 'Restart'
            },
            close: {
                zh_CN: '关闭',
                zh_CHT: '關閉',
                default: 'Close'
            },

            incomplete: {
                zh_CN: '信息不完整！',
                zh_CHT: '信息不完整！',
                default: 'Incomplete information!'
            },
            session: {
                zh_CN: '会话',
                zh_CHT: '會話',
                default: 'Session'
            },
            sessions: {
                zh_CN: '会话组',
                zh_CHT: '會話組',
                default: 'Sessions'
            },

            busy: {
                zh_CN: '忙碌',
                zh_CHT: '忙碌',
                default: 'Busy'
            },
            idle: {
                zh_CN: '空闲',
                zh_CHT: '空閑',
                default: 'Idle'
            },
            starting: {
                zh_CN: '启动中',
                zh_CHT: '啟動中',
                default: 'Starting'
            },

            start: {
                zh_CN: '上次运行时间',
                zh_CHT: '上次運行時間',
                default: 'Last Run Time'
            },
            runtime: {
                zh_CN: '运行用时',
                zh_CHT: '運行用時',
                default: 'Running Time'
            },
        }
    },
};

const i18n = (key, lang) => config.jupyter.i18n[key][lang] || config.jupyter.i18n[key].default;

async function loadCustomJs(path = '/widgets/custom.js') {
    try {
        // 合并配置文件 custom.js
        const customjs = await import(path);
        if (customjs?.config?.jupyter) merge(config.jupyter, customjs.config.jupyter);
    } catch (err) {
        console.warn(err);
    } finally {
        console.log(config);
    }
}

await loadCustomJs();
