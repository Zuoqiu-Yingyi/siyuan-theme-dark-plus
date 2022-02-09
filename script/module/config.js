/* 配置文件(可以被 data/widgets/custom.js 覆盖) */
import {
    cutString,
    ReplaceSpace,
    ReplaceCRLF,
    ialParser,
    markdown2span,
    timestampFormat,
    isEmptyString,
} from '/appearance/themes/Dark+/script/utils/string.js';

export var config = {
    token: '', // API token, 无需填写
    styles: [
        // 渲染的自定义样式
        'font-size',
    ],
    query: { // 查询配置
        regs: {
            blocks: /^\s*SELECT\s+\*\s+FROM\s+blocks.*/i, // 块查询的正则表达式
        },
        maxlen: 64, // 查询结果每个字段最大长度
        maxrow: 3, // 查询结果每个字段最大行数
        limit: 'row', // 查询结果字段限制, (null 为不限制, 'len' 为限制长度, 'row' 为限制行数)
        CRLF: '<br />', // 换行符替换
        space: ' ', // 空白字符替换
        fields: [ // 需渲染的 blocks 表的字段, 顺序分先后
            // 'content', // 去除了 Markdown 标记符的文本
            'markdown', // 包含完整 Markdown 标记符的文本
            'created', // 创建时间
            'updated', // 更新时间
            'type', // 内容块类型，参考((20210210103523-ombf290 "类型字段"))
            'hpath', // 人类可读的内容块所在文档路径

            // 'id', // 内容块 ID
            // 'parent_id', // 双亲块 ID, 如果内容块是文档块则该字段为空
            // 'root_id', // 文档块 ID
            // 'box', // 笔记本 ID
            // 'path', // 内容块所在文档路径
            // 'name', // 内容块名称
            // 'alias', // 内容块别名
            // 'memo', // 内容块备注
            // 'hash', // content 字段的 SHA256 校验和
            // 'length', // markdown 字段文本长度
            // 'subtype', // 内容块子类型，参考((20210210103411-tcbcjja "子类型字段"))
            // 'ial', // 内联属性列表，形如 `{: name="value"}`
            // 'sort', // 排序权重, 数值越小排序越靠前

        ],
        align: { // 查询结果字段对齐样式(':-' 左对齐, ':-:' 居中, '-:' 右对齐)
            content: ':-',
            markdown: ':-',
            created: ':-:',
            updated: ':-:',
            type: ':-:',
            hpath: ':-',

            id: ':-:',
            parent_id: ':-:',
            root_id: ':-:',
            hash: ':-:',
            box: ':-:',
            path: ':-',
            name: ':-',
            alias: ':-',
            memo: ':-',
            length: '-:',
            subtype: '-:',
            ial: ':-',
            sort: '-:',
        },
        handler: { // 查询结果字段处理方法
            content: (row) => {
                switch (config.query.limit) {
                    case 'len':
                        return markdown2span(cutString(ReplaceSpace(row.content, config.query.space), config.query.maxlen));
                    case 'row':
                        return markdown2span(ReplaceCRLF(cutString(row.content, undefined, config.query.maxrow), config.query.CRLF));
                        default:
                        return markdown2span(row.content);
                }
            },
            markdown: (row) => {
                switch (config.query.limit) {
                    case 'len':
                        return markdown2span(cutString(ReplaceSpace(row.markdown, config.query.space), config.query.maxlen));
                    case 'row':
                        return markdown2span(ReplaceCRLF(cutString(row.markdown, undefined, config.query.maxrow), config.query.CRLF));
                    default:
                        return markdown2span(row.markdown);
                }
            },
            created: (row) => {
                return timestampFormat(row.created);
            },
            updated: (row) => {
                return timestampFormat(row.updated);
            },
            type: (row) => {
                return `((${row.id} "${config.query.map.blocktype[row.type]}"))`;
            },
            hpath: (row) => {
                return `((${row.root_id} "${row.hpath}"))`;
            },

            id: (row) => {
                return `((${row.id} "${row.id}"))`;
            },
            parent_id: (row) => {
                if (isEmptyString(row.parent_id)) return '';
                else return `((${row.parent_id} "${row.parent_id}"))`;
            },
            root_id: (row) => {
                return `((${row.root_id} "${row.root_id}"))`;
            },
            hash: (row) => {
                return `\`${row.hash}\``;
            },
            box: (row) => {
                return `\`${row.box}\``;
            },
            path: (row) => {
                return `\`${row.path}\``;
            },
            name: (row) => {
                return markdown2span(row.name);
            },
            alias: (row) => {
                return markdown2span(row.alias);
            },
            memo: (row) => {
                return markdown2span(row.memo);
            },
            length: (row) => {
                return row.length;
            },
            subtype: (row) => {
                return config.query.map.subtype[row.subtype];
            },
            ial: (row) => {
                let ial = ialParser(row.ial);
                let ial_markdown = [];
                for (let key of Object.keys(ial)) {
                    switch (key) {
                        case 'id':
                        case 'updated':
                            continue;
                        case 'icon':
                            ial_markdown.push(`\`${key}\`\: :${ial[key].replace(/\.\w+$/, '')}:`);
                            break;
                        default:
                            ial_markdown.push(`\`${key}\`\: \`${ial[key]}\``);
                            break;
                    }
                }
                return ial_markdown.join(config.query.CRLF);
            },
            sort: (row) => {
                return row.sort;
            },
        },
        map: { // 映射表
            blocktype: { // 块类型映射
                d: '文档块',
                h: '标题块',
                l: '列表块',
                i: '列表项',
                c: '代码块',
                m: '公式块',
                t: '表格块',
                b: '引述块',
                s: '超级块',
                p: '段落块',
                tb: '分隔线',
                video: '视频块',
                audio: '音频块',
                widget: '挂件块',
                iframe: 'iframe',
                query_embed: '嵌入块',
                '': '',
                null: '',
                undefined: '',
            },
            subtype: { // 子类型映射
                o: '有序列表',
                u: '无序列表',
                t: '任务列表',
                h1: '一级标题',
                h2: '二级标题',
                h3: '三级标题',
                h4: '四级标题',
                h5: '五级标题',
                h6: '六级标题',
                '': '',
                null: '',
                undefined: '',
            },
        },
    },
    hotkeys: {
        // 快捷键
        render: {
            // 渲染
            ctrlKey: true,
            metaKey: true,
            shiftKey: false,
            altKey: false,
            key: 'F1',
        },
        query: {
            // 查询
            ctrlKey: true,
            metaKey: true,
            shiftKey: false,
            altKey: false,
            key: 'F2',
        },
    },
};

try {
    let custom = await import('/widgets/custom.js');
    config = custom.config;
} catch (err) {
    console.log(err);
} finally {
    console.log(config);
}

