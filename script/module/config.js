/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

export var config = {
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
        limit: 'len', // 查询结果字段限制, (null 为不限制, 'len' 为限制长度, 'row' 为限制行数)
        CRLF: '<br />', // 换行符替换
        space: ' ', // 空白字符替换
        fields: [ // 渲染的字段
            'type', // 内容块类型，参考((20210210103523-ombf290 "类型字段"))
            'content', // 去除了 Markdown 标记符的文本
            'created', // 创建时间
            'updated', // 更新时间
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

            //// 'markdown', // 包含完整 Markdown 标记符的文本(该字段无法正常渲染)
        ],
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
    token: '',
};

try {
    let custom = await import('/widgets/custom.js');
    config = custom.config;
} catch (err) {
    console.log(err);
} finally {
    console.log(config);
}

