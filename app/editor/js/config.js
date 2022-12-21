import { merge } from './utils.js';

export var config = {
    token: '',
    editor: {
        UI: {
            fontFamily: [ // 界面字体
                '"Sarasa Mono SC"',
                '"Microsoft YaHei"',
                '"幼圆"',
            ],
        },
        mark: {
            // 标记
            block: 'Ⓑ', // 块标记
            blockpath: '🄽', // 块路径标记

            file: '🗋', // 文件标记
            // file: '🖹', // 文件标记
            // file: '🖺', // 文件标记
            filepath: '🄿', // 文件路径标记

            url: '🌐', // 超链接标记
            urlpath: '🔗', // 超链接路径标记

            inbox: '📥', // 收集箱标记
            inboxpath: '🔗', // 收集箱路径标记

            history: '⭯', // 历史文档标记
            historypath: '🗋', // 历史文档路径标记

            snapshot: '📷', // 快照文档标记
            snapshotpath: '🗋', // 快照文档路径标记

            pathseparate: ' > ', // 路径分隔符
            status: { // 状态
                edited: '📝', // 已编辑且未保存标记
                error: '❌', // 错误标记
                success: '✅', // 成功标记
            },
        },
        link: {
            // 面包屑文件链接处理方案
            file: filepath => `file://${filepath}`, // 文件链接
            // file: filepath => `vscode://file/${filepath}`, // 使用 vscode 打开文件
            directory: dirpath => `file://${dirpath}`, // 目录链接
            // directory: dirpath => `vscode://file/${dirpath}`, // 使用 vscode 打开目录
            siyuan: id => `siyuan://blocks/${id}`, // 思源链接
        },
        regs: {
            id: /^\d{14}\-[0-9a-z]{7}$/, // 块 ID 正则表达式
            query: /^\s*\{\{(.*)\}\}\s*$/, // 嵌入块正则表达式
            code: /^\s*\`{3,}\s*(\w*)\s*\n/, // 代码块正则表达式
            file: /^file:\/*(.*)$/, // 文件路径正则表达式
        },
        command: {
            // 命令
            SAVED: () => {
                console.debug('SAVED');
                return true;
            },
            LOADED: () => {
                console.debug('LOADED');
                return true;
            },
            PIN: () => {
                console.debug('WINDOW-SWITCH-PIN');
                return true;
            },
        },
        IStandaloneEditorConstructionOptions: {
            // autoClosingBrackets: 'languageDefined', // 是否自动添加后括号(包括中括号)
            // autoClosingDelete: 'languageDefined', // 是否自动删除后括号(包括中括号)
            // autoClosingQuotes: 'languageDefined', // 是否自动添加后单引号 双引号
            automaticLayout: true, // 是否自动布局
            bracketPairColorization: { // 匹配括号颜色
                enabled: true,
            },
            colorDecorators: true, // 是否渲染定义的颜色(CSS 中颜色值)
            copyWithSyntaxHighlighting: false, // 是否复制为富文本
            // cursorSmoothCaretAnimation: true, // 光标平滑移动动画
            fontFamily: [
                '"Sarasa Mono SC"',
                '"JetBrainsMono-Regular"',
                '"mononoki"',
                '"Consolas"',
                '"Liberation Mono"',
                '"Menlo"',
                '"Courier"',
                '"monospace"',
            ].join(','), // 字体
            fontLigatures: true, // 是否启用字体连字
            formatOnPaste: true, // 是否格式化粘贴的内容
            // inDiffEditor: false, // 是启用对比功能
            mouseWheelZoom: true, // 是否使用鼠标滚轮缩放
            readOnly: false, // 是否只读
            tabSize: 4, // Tab 制表符缩进大小
            useShadowDOM: true, // 是否使用 Shadow DOM
            // value: '', // 初始文本
            wordWrap: 'off', // 是否自动换行 "on" | "off" | "wordWrapColumn" | "bounded"
        },
        IStandaloneDiffEditorConstructionOptions: {
            // diffCodeLens: true,
            // diffWordWrap: "inherit",
            // isInEmbeddedEditor: true,
        },
        MAP: { // 字段映射
            LABELS: { // 标签
                save: {
                    zh_CN: '保存',
                    zh_CHT: '保存',
                    default: 'Save'
                },
                saveAs: {
                    zh_CN: '另存为',
                    zh_CHT: '另存為',
                    default: 'Save As'
                },
                openFileInVscode: {
                    zh_CN: '在 VS Code 中打开文件',
                    zh_CHT: '在 VS Code 中打開文件',
                    default: 'Open File in VS Code'
                },
                openDirInVscode: {
                    zh_CN: '在 VS Code 中打开目录',
                    zh_CHT: '在 VS Code 中打開目錄',
                    default: 'Open Directory in VS Code'
                },
                copyhref: {
                    zh_CN: '复制页面链接',
                    zh_CHT: '復製頁面鏈接',
                    default: 'Copy Link'
                },
                copyfullhref: {
                    zh_CN: '复制页面完整链接',
                    zh_CHT: '復製頁面完整鏈接',
                    default: 'Copy Full Link'
                },
                wrap: {
                    zh_CN: '切换自动换行',
                    zh_CHT: '切換自動換行',
                    default: 'Toggle Word Wrap'
                },
                pin: {
                    zh_CN: '窗口置顶/取消置顶',
                    zh_CHT: '窗口置頂/取消置頂',
                    default: 'Window Pin/Unpin'
                },
                unSaved: {
                    zh_CN: "是否不保存更改？\n如果不保存，你的更改将丢失。",
                    zh_CHT: "是否不保存更改？\n如果不保存，你的更改將丟失。",
                    default: "Do you not save your changes?\nIf you don't save, your changes will be lost"
                },
                mode: {
                    local: {
                        zh_CN: '本地文件',
                        zh_CHT: '本地文件',
                        default: 'Local File'
                    },
                    assets: {
                        zh_CN: '资源文件',
                        zh_CHT: '資源文件',
                        default: 'Asset File'
                    },
                    web: {
                        zh_CN: '网络文件',
                        zh_CHT: '網絡文件',
                        default: 'Web File'
                    },
                    inbox: {
                        zh_CN: '收集箱',
                        zh_CHT: '收集箱',
                        default: 'Inbox'
                    },
                    history: {
                        zh_CN: '文档历史',
                        zh_CHT: '文檔歷史',
                        default: 'History'
                    },
                    snapshot: {
                        zh_CN: '文档快照',
                        zh_CHT: '文檔快照',
                        default: 'Snapshot'
                    },
                },

                type: {
                    d: {
                        zh_CN: '文档块',
                        zh_CHT: '文檔塊',
                        default: 'Document'
                    },
                    h: {
                        zh_CN: '标题块',
                        zh_CHT: '標題塊',
                        default: 'Heading'
                    },
                    l: {
                        zh_CN: '列表块',
                        zh_CHT: '列表塊',
                        default: 'List'
                    },
                    i: {
                        zh_CN: '列表项',
                        zh_CHT: '列表項',
                        default: 'List Item'
                    },
                    c: {
                        zh_CN: '代码块',
                        zh_CHT: '代碼塊',
                        default: 'Code'
                    },
                    m: {
                        zh_CN: '公式块',
                        zh_CHT: '公式塊',
                        default: 'Math'
                    },
                    t: {
                        zh_CN: '表格块',
                        zh_CHT: '表格塊',
                        default: 'Table'
                    },
                    b: {
                        zh_CN: '引述块',
                        zh_CHT: '引述塊',
                        default: 'Quote'
                    },
                    s: {
                        zh_CN: '超级块',
                        zh_CHT: '超級塊',
                        default: 'Super'
                    },
                    p: {
                        zh_CN: '段落块',
                        zh_CHT: '段落塊',
                        default: 'Paragraph'
                    },
                    tb: {
                        zh_CN: '分隔线',
                        zh_CHT: '分隔線',
                        default: 'hr'
                    },
                    html: {
                        zh_CN: 'HTML块',
                        zh_CHT: 'HTML塊',
                        default: 'HTML'
                    },
                    video: {
                        zh_CN: '视频块',
                        zh_CHT: '視頻塊',
                        default: 'Video'
                    },
                    audio: {
                        zh_CN: '音频块',
                        zh_CHT: '音頻塊',
                        default: 'Audio'
                    },
                    widget: {
                        zh_CN: '挂件块',
                        zh_CHT: '掛件塊',
                        default: 'Widget'
                    },
                    iframe: {
                        zh_CN: 'iframe',
                        zh_CHT: 'iframe',
                        default: 'Iframe'
                    },
                    query_embed: {
                        zh_CN: '嵌入块',
                        zh_CHT: '嵌入塊',
                        default: 'Query'
                    },

                },
            },
            LANGS: {
                zh_CN: 'zh-cn',
                zh_CHT: 'zh-tw',
                en_US: '',
                fr_FR: 'fr',
                default: '',
            },
            LANGUAGES: {
                /* 👇 块渲染样式 👇 */
                default: 'plaintext',
                plaintext: 'plaintext',
                mindmap: 'markdown',
                echarts: 'json',

                /* 👇 文件渲染样式 👇 */
                svg: 'xml',

                /* 👇 highlight.js => monaco-editor 👇 */
                'abap': 'abap',
                'bat': 'bat',
                'clojure': 'clojure',
                'coffeescript': 'coffee',
                'cpp': 'cpp',
                'c#': 'csharp',
                'csharp': 'csharp',
                'csp': 'csp',
                'css': 'css',
                'dart': 'dart',
                'dockerfile': 'dockerfile',
                'elixir': 'elixir',
                'fsharp': 'fsharp',
                'go': 'go',
                'graphql': 'graphql',
                'handlebars': 'handlebars',
                'html': 'html',
                'ini': 'ini',
                'java': 'java',
                'js': 'javascript',
                'javascript': 'javascript',
                'json': 'json',
                'julia': 'julia',
                'kotlin': 'kotlin',
                'less': 'less',
                'lua': 'lua',
                'markdown': 'markdown',
                'mipsasm': 'mips',
                'objectivec': 'objective-c',
                'perl': 'perl',
                'pgsql': 'pgsql',
                'php': 'php',
                'powershell': 'powershell',
                'protobuf': 'protobuf',
                'python': 'python',
                'r': 'r',
                'ruby': 'ruby',
                'rust': 'rust',
                'scala': 'scala',
                'scheme': 'scheme',
                'scss': 'scss',
                'shell': 'shell',
                'solidity': 'solidity',
                'sql': 'sql',
                'swift': 'swift',
                'tcl': 'tcl',
                'twig': 'twig',
                'ts': 'typescript',
                'typescript': 'typescript',
                'xml': 'xml',
                'yaml': 'yaml',
                /* 👆 highlight.js => monaco-editor 👆 */
                /* 👇 !=> monaco-editor 👇 */
                'apex': 'apex',
                'azcli': 'azcli',
                'bicep': 'bicep',
                'cameligo': 'cameligo',
                'cypher': 'cypher',
                'ecl': 'ecl',
                'flow9': 'flow9',
                'freemarker2': 'freemarker2',
                'hcl': 'hcl',
                'lexon': 'lexon',
                'liquid': 'liquid',
                'm3': 'm3',
                'msdax': 'msdax',
                'mysql': 'mysql',
                'pascal': 'pascal',
                'pascaligo': 'pascaligo',
                'pla': 'pla',
                'postiats': 'postiats',
                'powerquery': 'powerquery',
                'pug': 'pug',
                'qsharp': 'qsharp',
                'razor': 'razor',
                'redis': 'redis',
                'redshift': 'redshift',
                'restructuredtext': 'restructuredtext',
                'sb': 'sb',
                'sophia': 'sophia',
                'sparql': 'sparql',
                'st': 'st',
                'systemverilog': 'systemverilog',
                'vb': 'vb',
                /* 👆 !=> monaco-editor 👆 */
            },
            THEMES: {
                0: 'vs',
                1: 'vs-dark',
                '0': 'vs',
                '1': 'vs-dark',
                'default': 'vs',
            },
        },
    },
};

try {
    const custom = import('/widgets/custom.js');
    if (custom?.config?.editor) {
        merge(config.editor, custom.config.editor);
    }
} catch (err) {
    console.warn(err);
} finally {
    console.log(config);
}
