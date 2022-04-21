import { config } from './js/config.js';
import { Iterator } from './js/utils.js';
import {
    queryBlock,
    queryAsset,
    getNotebookConf,
    exportMdContent,
    updateBlock,
    getFile,
    putFile,
} from './js/api.js';

async function init(params) {
    document.body.style.fontFamily = config.UI.fontFamily.join(',');

    let r; // 响应
    let b; // 块
    let n; // 笔记本
    let t; // 临时
    switch (params.mode) {
        case 'assets':
            // TODO 完整 URL 资源
            if (params.url) return;

            switch (true) {
                case params.path.startsWith('assets/'):
                    r = await queryAsset(params.path);
                    if (!(r
                        && r.code === 0
                        && r.data.length > 0
                    )) params.path = `/data/${params.path}`; // 没有查询到资源文件
                    else {
                        for (const asset of r.data) {
                            b = asset;
                            let paths = `${b.box}${b.docpath}`.split('/');
                            for (let i = 0; i < paths.length; ++i) {
                                t = `/data/${paths.slice(0, i).join('/')}/${b.path}`.replaceAll('//', '/');
                                r = await getFile(t);
                                if (r) break;
                            }
                            if (r) {
                                params.block = b;
                                params.path = t;
                                params.value = await r.text();
                                break;
                            }
                        }
                    }
                    break;
                case params.path.startsWith('/assets/'):
                    params.path = `/data${params.path}`;
                    break;
                case params.path.startsWith('widgets/'):
                    params.path = `/data/${params.path}`;
                    break;
                case params.path.startsWith('/widgets/'):
                    params.path = `/data${params.path}`;
                    break;
                case params.path.startsWith('emojies/'):
                    params.path = `/data/${params.path}`;
                    break;
                case params.path.startsWith('/emojies/'):
                    params.path = `/data${params.path}`;
                    break;
                case params.path.startsWith('appearance/'):
                    params.path = `/conf/${params.path}`;
                    break;
                case params.path.startsWith('/appearance/'):
                    params.path = `/conf${params.path}`;
                    break;
                case params.path.startsWith('export/'):
                    params.path = `/temp/${params.path}`;
                    break;
                case params.path.startsWith('/export/'):
                    params.path = `/temp${params.path}`;
                    break;
            }
            params.path.replaceAll('\\', '/').replaceAll('//', '/');
            r = await getFile(params.path);
            if (r) {
                params.mode = 'assets';
                params.value = await r.text();
                params.language = params.path.substring(params.path.lastIndexOf('.') + 1);
            }
            else return;
            break;
        case 'block':
            if (!config.regs.id.test(window.editor.params.id)) return;

            // 获取块
            r = await queryBlock(params.id);
            // console.log(r);
            if (!(r
                && r.code === 0
                && r.data.length === 1
            )) return; // 没有查询到块
            b = r.data[0];

            // 获取笔记本
            r = await getNotebookConf(b.box);
            if (!(r
                && r.code === 0
            )) return; // 没有查询到笔记本
            n = r.data;
            switch (b.type) {
                case 'html':
                case 'video':
                case 'audio':
                case 'widget':
                case 'iframe':
                    params.mode = 'html';
                    params.value = b.markdown;
                    params.language = 'html';
                    break;
                case 'query_embed': // 嵌入块
                    t = config.regs.query.exec(b.markdown);
                    if (t && t.length === 2) {
                        params.mode = 'query';
                        params.value = t[1];
                        params.language = 'sql';
                    }
                    break;
                case 'd': // 文档块
                    r = await exportMdContent(b.id);
                    if (!(r && r.code === 0)) return;
                    else {
                        params.mode = 'doc';
                        params.value = r.data.content;
                        params.language = 'markdown';
                        params.tabSize = 2;
                    }
                    break;
                case 'c': // 代码块
                    t = config.regs.code.exec(b.markdown);
                    if (t && t.length === 2) {
                        params.mode = 'code';
                        params.value = b.content;
                        params.language = t[1];
                    }
                    break;
                default:
                    params.mode = 'block';
                    params.value = b.markdown;
                    params.language = 'markdown';
                    params.tabSize = 2;
                    break;
            }
            // params.value = `${b.markdown}\n${b.ial}`;
            // console.log(params);
            params.block = b;
            params.breadcrumb.set(
                `Ⓑ${config.MAP.LABELS.type[b.type][params.lang] || config.MAP.LABELS.type[b.type].default}`,
                `🄽${n.name}${b.hpath.replaceAll('/', ' > ')}`,
                `siyuan://blocks/${b.id}`,
                `${n.name}${b.hpath}`,
                `siyuan://blocks/${b.id}`,
                `siyuan://blocks/${b.root_id}`,
            );
            break;
        case 'none':
        default:
            break;
    }
}

window.onload = () => {
    try {
        window.editor = {};
        window.editor.url = new URL(window.location.href);
        window.editor.picker = document.getElementById('picker');
        window.editor.params = {
            breadcrumb: {
                type: document.getElementById('type'),
                crumb: document.getElementById('crumb'),
                set: (typeText, hpathText, typeTitle, hpathTitle, blockHref, docHref) => {
                    window.editor.params.breadcrumb.type.href = blockHref;
                    window.editor.params.breadcrumb.type.innerText = typeText;
                    window.editor.params.breadcrumb.type.setAttribute('title', typeTitle);
                    window.editor.params.breadcrumb.crumb.href = docHref;
                    window.editor.params.breadcrumb.crumb.innerText = hpathText;
                    window.editor.params.breadcrumb.crumb.setAttribute('title', hpathTitle);
                },
            },
            picker: {
                element: document.getElementById('picker'),
                set: (value) => {
                    window.editor.params.picker.element.value = value;
                },
            },
            id: window.editor.url.searchParams.get('id')
                || null, // 块 ID
            url: decodeURI(window.editor.url.searchParams.get('url') || '')
                || null, // 资源完整 URL
            path: decodeURI(window.editor.url.searchParams.get('path') || '')
                || null, // 资源路径
            /**
             * 模式
             * 'none': 白板
             * 'assets': 资源
             *     -> 'assets': 资源
             *     -> 'file': 文件
             * 'block': 块
             *     -> 'block': 普通块
             *     -> 'query': 嵌入块
             *     -> 'code': 代码块
             *     -> 'html': html块
             *     -> 'doc': 文档块
             */
            mode: window.editor.url.searchParams.get('mode')
                || 'none',
            value: '',
            theme: window.editor.url.searchParams.get('theme')
                || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0),
            lang: window.editor.url.searchParams.get('lang')
                || 'default',
            language: window.editor.url.searchParams.get('language')
                || 'default',
            tabSize: parseInt(window.editor.url.searchParams.get('tabSize'))
                || 4,
            // REF [JS Unicode编码和解码（6种方法）](http://c.biancheng.net/view/5602.html)
            body: JSON.parse(decodeURI(window.editor.url.hash.substr(1)) || null),
        };
        init(window.editor.params).then(() => {
            window.editor.container = document.getElementById('container');
            window.editor.picker = document.getElementById('picker');

            require.config({
                paths: {
                    vs: '/appearance/themes/Dark+/app/editor/vs'
                    // vs: '/appearance/themes/Dark+/script/test/monaco/0.33.0/dev/vs'
                },
            });
            require.config({
                'vs/nls': {
                    availableLanguages: {
                        '*': config.MAP.LANGS[window.editor.params.lang]
                            || config.MAP.LANGS.default
                            || '',
                    },
                },
            });
            require(['vs/editor/editor.main'], () => {
                let language = config.MAP.LANGUAGES[window.editor.params.language.toLowerCase()]
                    || window.editor.params.language
                    || 'plaintext';
                window.editor.picker.value = language;
                window.editor.editor = monaco.editor.create(
                    container,
                    Object.assign(
                        Object.assign(
                            config.IStandaloneEditorConstructionOptions, // 默认配置
                            {
                                language: language, // 语言模式
                                theme: config.MAP.THEMES[window.editor.params.theme]
                                    || config.MAP.THEMES.default
                                    || 'vs', // 主题
                                value: window.editor.params.tabSize || 4, // 初始值
                                value: window.editor.params.value, // 初始值
                            }, // URL params 配置
                        ),
                        window.editor.params.body
                            ? window.editor.params.body.IStandaloneEditorConstructionOptions
                            : null, // URL hash 配置
                    ),
                );

                /* 设置语言标签 */
                window.editor.picker.onchange = () => {
                    // console.log(window.editor.picker.value);
                    // window.editor.params.lang = window.editor.picker.value;
                    monaco.editor.setModelLanguage(window.editor.editor.getModel(), window.editor.picker.value);
                };

                /* 👇👇 右键菜单项 👇👇 */
                // REF [IActionDescriptor | Monaco Editor API](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IActionDescriptor.html)
                window.editor.editor.addAction({ // 保存
                    id: '18730D32-5451-4102-B299-BE281BA929B9', // 菜单项 id
                    label: config.MAP.LABELS.save[window.editor.params.lang]
                        || config.MAP.LABELS.save.default, // 菜单项名称
                    // REF [KeyMod | Monaco Editor API](https://microsoft.github.io/monaco-editor/api/classes/monaco.KeyMod.html)
                    // REF [KeyCode | Monaco Editor API](https://microsoft.github.io/monaco-editor/api/enums/monaco.KeyCode.html)
                    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS], // 绑定快捷键
                    // keybindingContext: 'Ctrl+S', // 绑定快捷键上下文
                    contextMenuGroupId: '9_file', // 所属菜单的分组
                    run: () => {
                        switch (window.editor.params.mode) {
                            case 'file':
                                break;
                            case 'assets':
                                putFile(
                                    window.editor.params.path,
                                    window.editor.editor.getValue(),
                                );
                                break;
                            case 'query':
                                updateBlock(
                                    window.editor.params.id,
                                    `\{\{${window.editor.editor.getValue().trim()}\}\}\n${window.editor.params.block.ial}`,
                                );
                                break;
                            case 'code':
                                updateBlock(
                                    window.editor.params.id,
                                    `\`\`\`${window.editor.params.language}\n${window.editor.editor.getValue()}\n\`\`\`\n${window.editor.params.block.ial}`,
                                );
                                break;
                            case 'doc':
                                updateBlock(
                                    window.editor.params.id,
                                    window.editor.editor.getValue(),
                                );
                                break;
                            case 'html':
                            case 'block':
                                updateBlock(
                                    window.editor.params.id,
                                    `${window.editor.editor.getValue().trim()}\n${window.editor.params.block.ial}`,
                                );
                                break;
                            case 'none':
                            default:
                                break;
                        }
                    }, // 点击后执行的操作
                });

                let wrap_iter = Iterator(['on', 'off'], true);
                window.editor.editor.addAction({ // 切换折行状态
                    id: 'F9E62A24-619E-49EA-A870-B31E6F9D284F', // 菜单项 id
                    label: config.MAP.LABELS.wrap[window.editor.params.lang]
                        || config.MAP.LABELS.wrap.default, // 菜单项名称
                    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ], // 绑定快捷键
                    // keybindingContext: 'Alt+Z', // 绑定快捷键上下文
                    contextMenuGroupId: '2_view', // 所属菜单的分组
                    run: () => {
                        window.editor.editor.updateOptions({ wordWrap: wrap_iter.next().value });
                    }, // 点击后执行的操作
                });
            });
        });
    } catch (error) {
        console.error(error);
    }
}
