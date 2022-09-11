import { config } from './js/config.js';
import {
    Iterator,
    pathParse,
    saveAsFile,
    merge,
    getRelativePath,
    copyToClipboard,
} from './js/utils.js';
import {
    queryBlock,
    getFullHPathByID,
    exportMdContent,
    updateBlock,
    getBlockKramdown,
    getDocHistoryContent,
    getBlockDomByID,
    getDoc,
    getFile,
    putFile,
    resolveAssetPath,
} from './js/api.js';

async function init(params) {
    // 设置界面字体
    params.fontFamily = document.body.style.fontFamily = params.fontFamily.concat(config.editor.UI.fontFamily).join(',');

    let r; // 响应
    let b; // 块
    let n; // 笔记本
    let t; // 临时
    switch (params.mode) {
        case 'history': // 历史文档
            // 获取文档路径
            r = await getFullHPathByID(params.id);
            if (r && r.code === 0) {
                n = r;
            }
            else {
                // 没有查询到完整文档路径
                params.mode = 'none';
                return;
            }

            r = await getDocHistoryContent(params.url); // 获取历史文档内容
            if (r && r.code === 0) {
                b = r;
            }
            else {
                params.mode = 'none';
                return;
            }

            params.value = {
                original: null,
                modified: null,
            }
            switch (params.type) {
                case 'markdown': // 查看 markdown
                    params.value.original = b.data.isLargeDoc
                        ? b.data.content
                        : window.editor.lute.BlockDOM2StdMd(b.data.content);
                    r = await getDoc(params.id);
                    if (r && r.code === 0) {
                        params.value.modified = window.editor.lute.BlockDOM2StdMd(r.data.content);
                    }
                    else {
                        params.mode = 'none';
                        return;
                    }
                    break;
                case 'kramdown': // 对比历史与当前 kramdown
                    params.value.original = b.data.isLargeDoc
                        ? b.data.content
                        : window.editor.lute.BlockDOM2Md(b.data.content);

                    r = await getBlockKramdown(params.id);
                    // r = await getBlockDomByID(params.id);
                    // r = await getDoc(params.id);
                    if (r && r.code === 0) {
                        params.value.modified = r.data.kramdown;
                        // params.value.modified = window.editor.lute.BlockDOM2Md(r.data.blocks[0].content);
                        // params.value.modified = window.editor.lute.BlockDOM2Md(r.data.content);
                    }
                    else {
                        params.mode = 'none';
                        return;
                    }
                    break;
            }

            params.diff = true;

            params.language = 'markdown';
            params.tabSize = 2;
            params.IStandaloneEditorConstructionOptions.copyWithSyntaxHighlighting = false;

            params.breadcrumb.set(
                `${config.editor.mark.history}${config.editor.MAP.LABELS.mode[params.mode][params.lang] || config.editor.MAP.LABELS.mode[params.mode].default}`,
                `${config.editor.mark.historypath}${n.data.replaceAll('/', config.editor.mark.pathseparate)}`,
                params.url,
                n.data,
                config.editor.link.file(params.url),
                config.editor.link.siyuan(params.id),
            ); // 设置面包屑
            break;
        case 'inbox': // 收集箱
            r = await getFile(params.path); // 获取文件内容
            if (r) {
                params.value = await r.text();
                params.language = 'markdown';
                params.tabSize = 2;
                params.IStandaloneEditorConstructionOptions.copyWithSyntaxHighlighting = false;
                let typeText, hpathText, typeTitle, hpathTitle, blockHref, docHref;
                try {
                    const url = new URL(params.url);

                    typeText = `${config.editor.mark.inbox}${config.editor.MAP.LABELS.mode[params.mode][params.lang] || config.editor.MAP.LABELS.mode[params.mode].default}`;
                    hpathText = `${config.editor.mark.inboxpath}${url.host}${url.pathname}`.replaceAll('/', config.editor.mark.pathseparate);
                    typeTitle = params.title || params.describe;
                    hpathTitle = params.url;
                    blockHref = '#';
                    docHref = params.url;

                    // params.breadcrumb.type.download = typeTitle; // 设置下载按钮
                    params.breadcrumb.crumb.target = '_self'; // 在本窗口打开
                }
                catch (e) {
                    typeText = `${config.editor.mark.inbox}${config.editor.MAP.LABELS.mode[params.mode][params.lang] || config.editor.MAP.LABELS.mode[params.mode].default}`;
                    hpathText = `${config.editor.mark.inboxpath}${params.describe}`;
                    typeTitle = params.title;
                    hpathTitle = params.describe;
                    blockHref = '#';
                    docHref = '#';
                }
                finally {
                    params.filename = `${typeTitle.replaceAll(/[\\\/\:\*\?\"\<\>\|]/g, '')}.md`;
                    params.breadcrumb.set(
                        typeText,
                        hpathText,
                        typeTitle,
                        hpathTitle,
                        blockHref,
                        docHref,
                    ); // 设置面包屑
                }
            }
            break;
        case 'assets': // 资源文件
            switch (true) {
                case params.path.startsWith('assets/'):
                case params.path.startsWith('/assets/'):

                    // 使用 API 查询资源文件的相对路径
                    // 查询绝对路径 => 获得相对路径 => 获得资源文件 => 设置面包屑
                    r = await resolveAssetPath(params.path);
                    if (r && r.code === 0) {
                        params.url = r.data.replaceAll(/(\\|\/)+/g, '/');
                        params.path = `${getRelativePath(params.url, params.workspace)}`;
                        r = await getFile(params.path);
                        if (r) {
                            params.value = await r.text(); // 文件内容
                            break;
                        }
                        else {
                            params.mode = 'none';
                            return;
                        }
                    }
                    else {
                        params.mode = 'none';
                        return;
                    }
                // 使用遍历目录的方法获取资源文件
                // r = await queryAsset(params.path);
                // if (!(r
                //     && r.code === 0
                //     && r.data.length > 0
                // )) params.path = `/data/${params.path}`; // 没有查询到资源文件
                // else {
                //     for (const asset of r.data) {
                //         b = asset;
                //         let paths = `${b.box}${b.docpath}`.split('/');
                //         for (let i = 0; i < paths.length; ++i) {
                //             t = `/data/${paths.slice(0, i).join('/')}/${b.path}`.replaceAll('//', '/');
                //             r = await getFile(t);
                //             if (r) break;
                //         }
                //         if (r) {
                //             params.block = b;
                //             params.path = t;
                //             params.value = await r.text();
                //             break;
                //         }
                //     }
                // }
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
                case params.path.startsWith('http://'):
                case params.path.startsWith('https://'):
                    // 如果是网络资源，则直接获取资源文件
                    r = await fetch(params.path);
                    if (r) {
                        let url = new URL(params.path);
                        params.url = url.href;
                        params.mode = 'web';
                        params.value = await r.text();

                        let { dir, filename } = pathParse(params.url); // 获得路径与文件名
                        params.dir = dir;
                        params.filename = filename.full;
                        params.ext = filename.ext;

                        if (params.language === 'default' && filename.ext) params.language = filename.ext; // 如果没有设置语言, 则根据文件扩展名设置语言
                        params.breadcrumb.set(
                            `${config.editor.mark.url}${config.editor.MAP.LABELS.mode[params.mode][params.lang] || config.editor.MAP.LABELS.mode[params.mode].default}`,
                            `${config.editor.mark.urlpath}${url.host}${url.pathname}`.replaceAll('/', config.editor.mark.pathseparate),
                            filename.full,
                            params.url,
                            params.url,
                            params.url,
                        ); // 设置面包屑

                        params.breadcrumb.type.download = filename.full; // 设置下载按钮
                        params.breadcrumb.crumb.target = '_self'; // 在本窗口打开
                        return;
                    }
                    else {
                        params.mode = 'none';
                        return;
                    }
                default:
                    params.mode = 'none';
                    return;
            }

        case 'local': // 本地文件
            if (!params.url) {
                params.url = `${params.workspace}${params.path}`.replaceAll(/(\\|\/)+/g, '/');
            }
            // 文件路径
            let hpathText = params.url.startsWith(params.workspace)
                ? params.path.substring(1)
                : params.url;
            r = await getFile(params.path); // 获取文件内容
            if (r) {
                params.value = await r.text(); // 文件内容
                let { dir, filename } = pathParse(params.url); // 获得路径与文件名
                params.dir = dir;
                params.filename = filename.full;
                params.ext = filename.ext;

                if (params.language === 'default' && filename.ext) params.language = filename.ext; // 如果没有设置语言, 则根据文件扩展名设置语言
                params.breadcrumb.set(
                    `${config.editor.mark.file}${config.editor.MAP.LABELS.mode[params.mode][params.lang] || config.editor.MAP.LABELS.mode[params.mode].default}`,
                    `${config.editor.mark.filepath}${hpathText}`.replaceAll('/', config.editor.mark.pathseparate),
                    filename.full,
                    params.url,
                    config.editor.link.file(params.url),
                    config.editor.link.directory(params.dir),
                ); // 设置面包屑
            }
            else {
                params.mode = 'none';
                return;
            };
            break;
        case 'block': // 块
            if (!config.editor.regs.id.test(params.id)) {
                params.mode = 'none';
                return;
            }

            // 获取块
            r = await queryBlock(params.id);
            // console.log(r);
            if (!(r
                && r.code === 0
                && r.data.length === 1
            )) {
                // 没有查询到块
                params.mode = 'none';
                return;
            }
            b = r.data[0];

            // 获取笔记本
            r = await getFullHPathByID(params.id);
            if (!(r
                && r.code === 0
            )) {
                // 没有查询到笔记本
                params.mode = 'none';
                return;
            }
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
                    t = config.editor.regs.query.exec(b.markdown);
                    if (t && t.length === 2) {
                        params.mode = 'query';
                        params.value = t[1];
                        params.language = 'sql';
                    }
                    else {
                        params.mode = 'leaf';
                        params.value = b.markdown;
                        params.language = 'markdown';
                        // params.tabSize = 2;
                        params.IStandaloneEditorConstructionOptions.copyWithSyntaxHighlighting = false;
                    }
                    break;
                case 'd': // 文档块
                    switch (params.type) {
                        case 'kramdown':
                            if (params.path) {
                                // 使用模板文件
                                r = await getFile(params.path);
                                if (r) {
                                    params.value = await r.text();
                                    break;
                                } else {
                                    // 没有查询到 kramdown 模板
                                    params.mode = 'none';
                                    return;
                                }
                            }
                            else {
                                // 使用 API /api/block/getBlockKramdown
                                r = await getBlockKramdown(b.id);
                                if (r && r.code === 0) {
                                    params.value = r.data.kramdown;
                                    break;
                                }
                            }
                        case 'markdown':
                        default:
                            // 标准 markdown 编辑模式
                            r = await exportMdContent(b.id);
                            if (!(r && r.code === 0)) {
                                params.mode = 'none';
                                return;
                            }
                            else {
                                params.value = r.data.content;
                            }
                            break;
                    }
                    params.filename = `${b.content}.md`;
                    params.mode = 'doc';
                    params.language = 'markdown';
                    params.tabSize = 2;
                    params.IStandaloneEditorConstructionOptions.copyWithSyntaxHighlighting = false;
                    break;
                case 'c': // 代码块
                    t = config.editor.regs.code.exec(b.markdown);
                    if (t && t.length === 2) {
                        params.mode = 'code';
                        params.value = b.content;
                        params.language = t[1];
                    }
                    else {
                        params.mode = 'leaf';
                        params.value = b.markdown;
                        params.language = 'markdown';
                        // params.tabSize = 2;
                        params.IStandaloneEditorConstructionOptions.copyWithSyntaxHighlighting = false;
                    }
                    break;
                case 'm': // 公式块
                    params.mode = 'leaf';
                    params.value = b.markdown;
                    params.language = 'markdown';
                    params.IStandaloneEditorConstructionOptions.copyWithSyntaxHighlighting = false;
                    break;
                case `h`:
                case `t`:
                case `p`:
                case `tb`:
                    // 其他叶子块
                    params.mode = 'leaf';
                default:
                    // 其他容器块
                    switch (params.type) {
                        case 'kramdown':
                            r = await getBlockKramdown(b.id);
                            if (r && r.code === 0) {
                                params.value = r.data.kramdown;
                                break;
                            }
                        case 'markdown':
                        default:
                            params.value = b.markdown;
                            break;
                    }
                    params.mode = params.mode === 'leaf'
                        ? 'leaf'
                        : 'container';
                    params.language = 'markdown';
                    params.tabSize = 2;
                    params.IStandaloneEditorConstructionOptions.copyWithSyntaxHighlighting = false;
                    break;
            }
            // params.value = `${b.markdown}\n${b.ial}`;
            // console.log(params);
            params.block = b;
            params.breadcrumb.set(
                `${config.editor.mark.block}${config.editor.MAP.LABELS.type[b.type][params.lang] || config.editor.MAP.LABELS.type[b.type].default}`,
                `${config.editor.mark.blockpath}${n.replaceAll('/', config.editor.mark.pathseparate)}`,
                config.editor.link.siyuan(b.id),
                n,
                config.editor.link.siyuan(b.id),
                config.editor.link.siyuan(b.root_id),
            ); // 设置面包屑
            break;
        case 'none':
        default:
            break;
    }
}

function registerCompletionItemProvider(language) {
    window.editor.IDisposable?.dispose();
    switch (language) {
        case 'markdown':
            window.editor.IDisposable = monaco.languages.registerCompletionItemProvider(
                language,
                new window.editor.completion.MdCompletionItemProvider(),
            );
            break;
    }
}

window.onload = () => {
    try {
        window.editor = {};
        window.editor.url = new URL(window.location.href);
        window.editor.lute = window.Lute.New();
        // console.log(window.editor.url);
        window.editor.picker = document.getElementById('picker');
        window.editor.changed = false; // 是否有改动
        window.editor.params = {
            diff: false, // 是否为差异编辑器
            breadcrumb: {
                status: document.getElementById('status'),
                type: document.getElementById('type'),
                crumb: document.getElementById('crumb'),
                set: (typeText, hpathText, typeTitle, hpathTitle, blockHref, docHref) => {
                    if (typeText) {
                        typeText = typeText.replaceAll(/(\n|\r)+/g, ' ')
                        window.editor.params.breadcrumb.type.innerText = typeText;
                        window.editor.params.breadcrumb.typeText = typeText;
                    }
                    if (hpathText) window.editor.params.breadcrumb.crumb.innerText = hpathText.replaceAll(/(\n|\r)+/g, ' ');

                    if (typeTitle) window.editor.params.breadcrumb.type.setAttribute('title', typeTitle);
                    if (hpathTitle) window.editor.params.breadcrumb.crumb.setAttribute('title', hpathTitle);

                    if (blockHref) window.editor.params.breadcrumb.type.href = blockHref;
                    if (docHref) window.editor.params.breadcrumb.crumb.href = docHref;
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
                || null, // 文件资源定位
            path: decodeURI(window.editor.url.searchParams.get('path') || '')
                || null, // 文件读写路径
            /**
             * 模式
             * 'none': 白板
             * 'inbox': 收集箱
             * 'local': 本地资源
             * 'assets': 资源
             *     -> 'assets': 思源资源
             *     -> 'web': web 资源
             * 'block': 块
             *     -> 'left': 叶子块
             *     -> 'container': 容器块
             *     -> 'query': 嵌入块
             *     -> 'code': 代码块
             *     -> 'html': html块
             *     -> 'doc': 文档块
             */
            mode: window.editor.url.searchParams.get('mode')
                || 'none', // 编辑器模式
            type: window.editor.url.searchParams.get('type')
                || 'markdown', // 编辑类型
            value: '', // 内容
            theme: window.editor.url.searchParams.get('theme')
                || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0), // 主题模式
            lang: window.editor.url.searchParams.get('lang')
                || 'default', // 语言
            language: window.editor.url.searchParams.get('language')
                || 'default', // 语言模式
            tabSize: parseInt(window.editor.url.searchParams.get('tabSize'))
                || 4, // 缩进空格数量
            workspace: (window.editor.url.searchParams.get('workspace')
                || '').replaceAll(/(\\|\/)+/g, '/'), // 工作空间路径
            fontFamily: decodeURI(window.editor.url.searchParams.get('fontFamily') || '')
                ? [decodeURI(window.editor.url.searchParams.get('fontFamily') || '')]
                : [], // 字体

            title: decodeURI(window.editor.url.searchParams.get('title') || ''), // 标题(inbox 内容)
            describe: decodeURI(window.editor.url.searchParams.get('describe') || ''), // 描述(inbox 内容)
            IStandaloneEditorConstructionOptions: {}, // 其他编辑器配置
            IStandaloneDiffEditorConstructionOptions: {}, // 其他差异编辑器配置
            // REF [JS Unicode编码和解码（6种方法）](http://c.biancheng.net/view/5602.html)
            body: JSON.parse(decodeURI(window.editor.url.hash.substring(1)) || null),
        };
        init(window.editor.params).then(() => {
            window.editor.container = document.getElementById('container');
            window.editor.picker = document.getElementById('picker');

            // REF [Monaco Editor 入门指南 - 知乎](https://zhuanlan.zhihu.com/p/88828576)
            require.config({
                paths: {
                    vs: '/appearance/themes/Dark+/app/editor/vs'
                    // vs: '/appearance/themes/Dark+/script/test/monaco/0.33.0/dev/vs'
                },
            });
            require.config({
                'vs/nls': {
                    availableLanguages: {
                        '*': config.editor.MAP.LANGS[window.editor.params.lang]
                            || config.editor.MAP.LANGS.default
                            || '',
                    },
                },
            });

            require(['vs/editor/editor.main'], async () => {
                window.editor.completion = await import('./js/completion.js');

                const language = config.editor.MAP.LANGUAGES[window.editor.params.language.toLowerCase()]
                    || window.editor.params.language
                    || 'plaintext';
                window.editor.picker.value = language;

                // 编辑器配置
                const options = {};
                merge(
                    options,
                    config.editor.IStandaloneEditorConstructionOptions, // 默认配置
                    {
                        theme: config.editor.MAP.THEMES[window.editor.params.theme]
                            || config.editor.MAP.THEMES.default
                            || 'vs', // 主题
                        tabSize: window.editor.params.tabSize || 4, // 缩进
                    }, // URL params 配置
                    window.editor.params.IStandaloneEditorConstructionOptions || {},
                    window.editor.params.body
                        ? window.editor.params.body.IStandaloneEditorConstructionOptions || {}
                        : {}, // URL hash 配置
                );
                if (window.editor.params.diff) {
                    merge(
                        options,
                        config.editor.IStandaloneDiffEditorConstructionOptions, // 默认配置
                        window.editor.params.IStandaloneDiffEditorConstructionOptions || {},
                        window.editor.params.body
                            ? window.editor.params.body.IStandaloneDiffEditorConstructionOptions || {}
                            : {}, // URL hash 配置
                    );
                    window.editor.diffEditor = monaco.editor.createDiffEditor(
                        container,
                        options,
                    );
                    window.editor.diffEditor.setModel({
                        original: monaco.editor.createModel(
                            window.editor.params.value.original,
                            language,
                        ),
                        modified: monaco.editor.createModel(
                            window.editor.params.value.modified,
                            language,
                        ),
                    });
                    window.editor.editor = window.editor.diffEditor.getModifiedEditor();
                }
                else {
                    merge(
                        options,
                        {
                            language: language, // 语言模式
                            value: window.editor.params.value, // 初始值
                        },
                    );
                    window.editor.editor = monaco.editor.create(
                        container,
                        options,
                    );
                }
                // console.log(options);

                async function save() {
                    // 保存文件
                    let response;
                    switch (window.editor.params.mode) {
                        case 'web':
                        case 'inbox':
                            response = await saveAsFile(window.editor.editor.getValue(), window.editor.params.filename || undefined);
                            break;
                        case 'local':
                            response = await putFile(
                                window.editor.params.path,
                                window.editor.editor.getValue(),
                            ).then(() => config.editor.command.SAVED());
                            break;
                        case 'assets':
                            response = await putFile(
                                window.editor.params.path,
                                window.editor.editor.getValue(),
                            );
                            break;
                        case 'query':
                            response = await updateBlock(
                                window.editor.params.id,
                                `\{\{${window.editor.editor.getValue().trim()}\}\}\n${window.editor.params.block.ial}`,
                            );
                            break;
                        case 'code':
                            response = await updateBlock(
                                window.editor.params.id,
                                `\`\`\`${window.editor.params.language}\n${window.editor.editor.getValue()}\n\`\`\`\n${window.editor.params.block.ial}`,
                            );
                            break;
                        case 'doc':
                        case 'history':
                            response = await updateBlock(
                                window.editor.params.id,
                                window.editor.editor.getValue(),
                            );
                            break;
                        case 'html':
                        case 'leaf':
                        case 'container':
                            response = await updateBlock(
                                window.editor.params.id,
                                `${window.editor.editor.getValue().trim()}\n${window.editor.params.block.ial}`,
                            );
                            break;
                        case 'none':
                        default:
                            break;
                    }
                    if (response && (!response.code || response.code === 0)) {
                        // 保存成功
                        window.editor.changed = false; // 更改标记
                        window.editor.params.breadcrumb.status.innerText = config.editor.mark.status.success;
                    }
                    else {
                        // 保存失败
                        console.error(response);
                        window.editor.changed = false; // 更改标记
                        window.editor.params.breadcrumb.status.innerText = config.editor.mark.status.error;
                    }
                }

                /* 设置 markdown 文件的自动补全 */
                registerCompletionItemProvider(language);

                /**
                 * 文件是否发生更改
                 * REF [onDidChangeModelContent](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneCodeEditor.html#onDidChangeModelContent)
                 */
                window.editor.editor.onDidChangeModelContent(() => {
                    if (window.editor.changed) return; // 之前已经发生更改
                    else {
                        // 之前没有发生更改
                        window.editor.changed = true;
                        window.editor.params.breadcrumb.status.innerText = config.editor.mark.status.edited;
                    }
                });

                /* 设置语言标签 */
                window.editor.picker.onchange = () => {
                    // console.log(window.editor.picker.value);
                    // window.editor.params.lang = window.editor.picker.value;
                    if (window.editor.params.diff) {
                        monaco.editor.setModelLanguage(window.editor.diffEditor.getOriginalEditor().getModel(), window.editor.picker.value);
                        monaco.editor.setModelLanguage(window.editor.diffEditor.getModifiedEditor().getModel(), window.editor.picker.value);
                    }
                    else {
                        monaco.editor.setModelLanguage(window.editor.editor.getModel(), window.editor.picker.value);
                    }
                    registerCompletionItemProvider(window.editor.picker.value);
                };

                /* 👇👇 右键菜单项 👇👇 */
                // REF [IActionDescriptor | Monaco Editor API](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IActionDescriptor.html)

                let wrap_iter = Iterator(['on', 'off'], true);
                window.editor.editor.addAction({ // 切换折行状态
                    id: 'F9E62A24-619E-49EA-A870-B31E6F9D284F', // 菜单项 id
                    label: config.editor.MAP.LABELS.wrap[window.editor.params.lang]
                        || config.editor.MAP.LABELS.wrap.default, // 菜单项名称
                    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ], // 绑定快捷键
                    contextMenuGroupId: '2_view', // 所属菜单的分组
                    contextMenuOrder: 1, // 菜单分组内排序
                    run: () => {
                        const word_wrap_status = wrap_iter.next().value;
                        if (window.editor.params.diff) {
                            window.editor.diffEditor.getOriginalEditor().updateOptions({ wordWrap: word_wrap_status });
                            window.editor.diffEditor.getModifiedEditor().updateOptions({ wordWrap: word_wrap_status });
                        }
                        else {
                            window.editor.editor.updateOptions({ wordWrap: word_wrap_status });
                        }
                    }, // 点击后执行的操作
                });
                if (!(window.editor.params.type === 'markdown'
                    && (
                        window.editor.params.mode === 'doc'
                        || window.editor.params.mode === 'container'
                        || window.editor.params.mode === 'history'
                    ))) { // 容器块以 markdown 模式无法保存
                    window.editor.editor.addAction({ // 保存
                        id: '18730D32-5451-4102-B299-BE281BA929B9', // 菜单项 id
                        label: config.editor.MAP.LABELS.save[window.editor.params.lang]
                            || config.editor.MAP.LABELS.save.default, // 菜单项名称
                        // REF [KeyMod | Monaco Editor API](https://microsoft.github.io/monaco-editor/api/classes/monaco.KeyMod.html)
                        // REF [KeyCode | Monaco Editor API](https://microsoft.github.io/monaco-editor/api/enums/monaco.KeyCode.html)
                        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS], // 绑定快捷键
                        contextMenuGroupId: '3_file', // 所属菜单的分组
                        contextMenuOrder: 1, // 菜单分组内排序
                        run: () => {
                            setTimeout(save, 0);
                        }, // 点击后执行的操作
                    });
                }

                window.editor.editor.addAction({ // 文件另存为
                    id: 'D68588DD-8D0C-4435-8DC2-145B0F464FF8', // 菜单项 id
                    label: config.editor.MAP.LABELS.saveAs[window.editor.params.lang]
                        || config.editor.MAP.LABELS.saveAs.default, // 菜单项名称
                    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS], // 绑定快捷键
                    contextMenuGroupId: '3_file', // 所属菜单的分组
                    contextMenuOrder: 2, // 菜单分组内排序
                    run: () => {
                        saveAsFile(window.editor.editor.getValue(), window.editor.params.filename || undefined);
                    }, // 点击后执行的操作
                });

                /* 本地文件 */
                const file = {
                    is: false, // 是否为本地文件
                    path: null, // 文件绝对路径
                    dir: null, // 文件所在目录
                    name: {
                        full: null, // 完整文件名
                        main: null, // 主文件名
                        ext: null, // 文件扩展名
                    },
                };
                switch (window.editor.params.mode) {
                    case 'assets':
                    case 'local':
                        file.is = true;
                        {
                            let { path, dir, filename } = pathParse(window.editor.params.url);
                            file.path = path;
                            file.dir = dir;
                            file.name = filename;
                        }
                        break;
                    case 'inbox':
                        file.is = true;
                        {
                            let { path, dir, filename } = pathParse(`${window.editor.params.workspace}${window.editor.params.path}`);
                            file.path = path;
                            file.dir = dir;
                            file.name = filename;
                        }
                        break;
                    default:
                        file.is = false;
                        break;
                }
                if (file.is) {
                    window.editor.editor.addAction({ // 在 vscode 中打开文件
                        id: '7EA4AB2E-ED05-4AB2-AB27-575978CA820E', // 菜单项 id
                        label: config.editor.MAP.LABELS.openFileInVscode[window.editor.params.lang]
                            || config.editor.MAP.LABELS.openFileInVscode.default, // 菜单项名称
                        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO], // 绑定快捷键
                        contextMenuGroupId: '3_file', // 所属菜单的分组
                        contextMenuOrder: 3, // 菜单分组内排序
                        run: () => {
                            const position = window.editor.editor.getPosition();
                            window.open(`vscode://file/${file.path}:${position.lineNumber}:${position.column}`);
                        }, // 点击后执行的操作
                    });
                    window.editor.editor.addAction({ // 在 vscode 中打开文件所在目录
                        id: '4AF3B0F5-C37A-43BA-8F7F-0A1983AB4A3C', // 菜单项 id
                        label: config.editor.MAP.LABELS.openDirInVscode[window.editor.params.lang]
                            || config.editor.MAP.LABELS.openDirInVscode.default, // 菜单项名称
                        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyO], // 绑定快捷键
                        contextMenuGroupId: '3_file', // 所属菜单的分组
                        contextMenuOrder: 4, // 菜单分组内排序
                        run: () => {
                            window.open(`vscode://file/${file.dir}`);
                        }, // 点击后执行的操作
                    });
                }

                window.editor.editor.addAction({ // 复制当前窗口超链接
                    id: 'CFA39E4D-535A-497A-955B-E5F66A8F27EA', // 菜单项 id
                    label: config.editor.MAP.LABELS.copyhref[window.editor.params.lang]
                        || config.editor.MAP.LABELS.copyhref.default, // 菜单项名称
                    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyC], // 绑定快捷键
                    // contextMenuGroupId: '9_window', // 所属菜单的分组
                    // contextMenuOrder: 1, // 菜单分组内排序
                    run: () => {
                        copyToClipboard([
                            window.location.pathname,
                            window.location.search,
                            window.location.hash,
                        ].join(''));
                    }, // 点击后执行的操作
                });

                window.editor.editor.addAction({ // 复制当前窗口超链接(完整)
                    id: '927304E5-B97B-4193-8A2C-37ADFB96944F', // 菜单项 id
                    label: config.editor.MAP.LABELS.copyfullhref[window.editor.params.lang]
                        || config.editor.MAP.LABELS.copyfullhref.default, // 菜单项名称
                    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyC], // 绑定快捷键
                    // contextMenuGroupId: '9_window', // 所属菜单的分组
                    // contextMenuOrder: 2, // 菜单分组内排序
                    run: () => {
                        copyToClipboard(window.location.href);
                    }, // 点击后执行的操作
                });

                window.editor.editor.addAction({ // 窗口置顶与取消置顶
                    id: 'B3727110-AF46-4B5C-B910-0C6FC8091864', // 菜单项 id
                    label: config.editor.MAP.LABELS.pin[window.editor.params.lang]
                        || config.editor.MAP.LABELS.pin.default, // 菜单项名称
                    keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyP], // 绑定快捷键
                    // contextMenuGroupId: '9_window', // 所属菜单的分组
                    // contextMenuOrder: 3, // 菜单分组内排序
                    run: config.editor.command.PIN, // 点击后执行的操作
                });

                window.editor.params.breadcrumb.status.innerText = config.editor.mark.status.success; // 加载完成
                config.editor.command.LOADED(); // 加载完成
            });
        });
    }
    catch (error) {
        console.error(error);
        document.getElementById('status').innerText = config.editor.mark.status.error;
    }
}
