/* 导入 *.ipynb 文件 */
// REF [The Notebook file format — nbformat 5.7 documentation](https://nbformat.readthedocs.io/en/latest/format_description.html#notebook-file-format)
import {
    config,
} from './config.js';
import {
    upload,
    setBlockAttrs,
    updateBlock,
    appendBlock,
} from './api.js';
import {
    parseText,
    parseData,
    createIAL,
    nodeIdMaker,
    base64ToBlob,
    workerInit,
    isString,
} from './utils.js';

self.handlers = {
    importJson,
};

class IpynbImport {
    ipynb; // 文件内容
    cells; // 内容块
    origin; // 原始内容
    language; // 单元格语言
    metadata; // notebook 元数据
    nbformat; // 缩进长度
    nbformat_minor; // 次要缩进长度
    kramdown; // 导入的 kramdown 字符串数组
    attributes; // 导入的文档块属性
    newNodeID; // 块 ID 生成器

    constructor(origin = null) {
        this.origin = origin;
        this.newNodeID = nodeIdMaker();
    }

    /* 从文件导入 */
    async loadFile(file) {
        const json = await file.text();
        return this.loadJson(json);
    }

    /* 导入 json 文本内容 */
    loadJson(json) {
        return this.loadIpynb(JSON.parse(json));
    }

    /* 导入 ipynb json 对象 */
    loadIpynb(ipynb) {
        this.ipynb = ipynb;
        return this;
    }

    /**解析
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#top-level-structure
     */
    async parse() {
        this.kramdown = [];
        this.attributes = {};

        this.cells = this.ipynb.cells; // 单元格
        this.metadata = this.ipynb.metadata; // 笔记本级元数据
        this.nbformat = this.ipynb.nbformat; // 缩进长度
        this.nbformat_minor = this.ipynb.nbformat_minor; // 次要缩进长度

        this.initKramdown(); // 初始化 kramdown
        this.parseMetadata(); // 解析文档元数据
        await this.parseCells(); // 解析所有单元格
        return this;
    }

    toKramdown() {
        return this.kramdown.join('\n\n');
    }

    /* 初始化 kramdown */
    initKramdown() {
        if (isString(this.origin)) this.kramdown.push(this.origin);
    }

    /**解析文档元数据
     * REF: https://jupyter-client.readthedocs.io/en/stable/kernels.html#kernel-specs
     */
    parseMetadata() {
        this.language =
            this.metadata.kernelspec.language
            ?? this.metadata.language_info.name
            ?? this.metadata.language_info.nbconvert_exporter;
        this.attributes[config.jupyter.attrs.kernel.language] = this.language;

        const kernel_name =
            this.metadata.kernelspec.name
            ?? this.metadata.kernel_info.name;
        this.attributes[config.jupyter.attrs.kernel.name] = kernel_name;

        const display_name =
            this.metadata.kernelspec.display_name
            ?? this.metadata.kernelspec.name
            ?? this.metadata.kernel_info.name;
        this.attributes[config.jupyter.attrs.kernel.display_name] = display_name;

        this.attributes[config.jupyter.attrs.other.prompt] = `${this.language} | ${display_name}`;
    }

    /* 解析单元格 */
    async parseCells() {
        for (let i = 0; i < this.cells.length; ++i) {
            this.kramdown.push(await this.parseCell(this.cells[i]));
        }
    }

    /**解析单个块
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#cell-types
     */
    async parseCell(cell) {
        switch (cell.cell_type) {
            case 'markdown':
                return await this.parseMarkdown(cell);
            case 'code':
                return await this.parseCode(cell);
            case 'raw':
                return await this.parseRaw(cell);
        }
    }

    /**解析 markdown 块
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#markdown-cells
     */
    async parseMarkdown(cell) {
        /* 标题折叠 */
        if (cell.metadata['jp-MarkdownHeadingCollapsed']) {
            let index = -1; // 级别最高的标题所有序号
            let top_level = 7; // 当前级别最高的标题级别
            for (let i = 0; i < cell.source.length; ++i) {
                const line = cell.source[i];
                if (/^#{1,6}\s/.test(line)) { // 是否为标题块
                    for (let j = 0; j < line.length && j < 6; ++j) {
                        if (line.charAt(j) !== '#') {
                            if (j + 1 < top_level) {
                                top_level = j + 1;
                                index = i;
                            }
                            break;
                        }
                    }
                }
            }
            if (index >= 0 && 1 <= top_level && top_level <= 6) { // 存在待折叠的标题
                cell.source[index] = `${cell.source[index].trim()}\n${createIAL(config.jupyter.import.fold.attrs)}\n`;
            }
        }
        var markdown = cell.source.join(''); // markdown 文本
        const attachments = await this.parseAttachments(cell.attachments); // 附件
        for (const filename in attachments) {
            markdown = markdown.replace(`attachment:${filename}`, attachments[filename]);
        }
        // TODO: 解析 metadata 为块属性, 属性嵌套使用 `-` 展开
        /**幻灯片类型
         * slideshow.slide_type.slide
         * slideshow.slide_type.subslide
         * slideshow.slide_type.fragment
         * slideshow.slide_type.skip
         * slideshow.slide_type.notes
         */
        return markdown;
    }

    /**解析 code 块
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#code-cells
     */
    async parseCode(cell) {
        const markdown = [];
        const execution_count = cell.execution_count?.toString() ?? '*'; // 当前块运行计数器
        const source_hidden = cell.matedate?.jupyter?.source_hidden; // 代码是否折叠
        const outputs_hidden = cell.matedate?.jupyter?.outputs_hidden; // 输出是否折叠
        const code_id = this.newNodeID(); // 代码块 ID
        const output_id = this.newNodeID(); // 输出块 ID

        const code_attrs = {
            id: code_id,
            [config.jupyter.attrs.code.index]: execution_count,
            [config.jupyter.attrs.code.output]: output_id,
            [config.jupyter.attrs.code.type.key]: config.jupyter.attrs.code.type.value,
            fold: source_hidden ? '1' : null,
        }; // 代码块属性
        const output_attrs = {
            id: output_id,
            [config.jupyter.attrs.output.index]: execution_count,
            [config.jupyter.attrs.output.code]: code_id,
            [config.jupyter.attrs.output.type.key]: config.jupyter.attrs.output.type.value,
            fold: outputs_hidden ? '1' : null,
        }; // 输出块属性

        /* 代码块 */
        markdown.push(
            `\`\`\`${this.language}`,
            cell.source.join(''),
            '```',
            createIAL(code_attrs),
        );
        /* 输出块 */
        markdown.push(
            `{{{row`,
            '---',
        );
        markdown.push(await this.parseOutputs(cell.outputs));
        markdown.push(
            `---`,
            '}}}',
            createIAL(output_attrs),
        );
        return markdown.join('\n');
    }

    /**解析 raw 块
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#raw-nbconvert-cells
     */
    async parseRaw(cell) {
        var mime_main, mime_sub;
        const mime = cell.metadata.raw_mimetype ?? '/';
        [mime_main, mime_sub] = mime.split('/');
        const markdown = [];
        switch (mime_main) {
            case 'text':
                switch (mime_sub) {
                    case 'markdown':
                        markdown.push(
                            '{{{row',
                            cell.source.join(''),
                            '}}}',
                        );
                        break;
                    case 'html':
                        markdown.push(
                            '<div>',
                            cell.source.join(''),
                            '</div>',
                        );
                        break;
                    case 'x-python':
                        markdown.push(
                            '```python',
                            cell.source.join(''),
                            '```',
                        );
                        break;
                    case 'asciidoc':
                    case 'latex':
                    case 'restructuredtext':
                    default:
                        markdown.push(
                            `\`\`\`${mime_sub}`,
                            cell.source.join(''),
                            '```',
                        );
                        break;
                }
                break;
            case 'pdf':
            case 'slides':
            case 'script':
            case 'notebook':
            case 'custom':
            default:
                markdown.push(
                    `\`\`\`${mime_main}`,
                    cell.source.join(''),
                    '```',
                );
                break;
        }
        if (cell.metadata?.jupyter?.source_hidden) { // 折叠内容
            markdown.push(createIAL({ fold: '1' }));
        }
        return markdown.join('\n');
    }

    /**解析附件
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#cell-attachments
     * @return {object}: 附件引用名(attachment:xxx.ext) -> 附件文件引用(assets/xxx.ext)
     */
    async parseAttachments(attachments) {
        const map = {}; // attachment -> assets
        for (const filename in attachments) {
            const attachment = attachments[filename];
            for (const mime in attachment) {
                const response = await upload(
                    base64ToBlob(attachment[mime], mime),
                    undefined,
                    filename,
                );
                const filepath = response?.data?.succMap[filename];
                map[filename] = filepath;
            }
        }
        return map;
    }

    /**
     * 解析输出
     * @params {array} outputs: 输出对象列表
     * @return {string}: 最终结果
     */
    async parseOutputs(outputs) {
        const markdowns = [];
        for (let i = 0; i < outputs.length; ++i) {
            const output = outputs[i];
            switch (output.output_type) {
                case 'stream': {
                    const markdown = parseText(output.text.join(''), config.jupyter.import.params);
                    switch (output.name) {
                        case 'stdout':
                            markdowns.push(markdown);
                            break;
                        case 'stderr':
                            const lines = markdown.split('\n{2,}');
                            for (let j = 0; j < lines.length; ++j) {
                                markdowns.push(lines[j]);
                                markdowns.push(createIAL({ style: config.jupyter.style.error }));
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                }
                case 'error':
                    markdowns.push('{{{row');
                    markdowns.push(parseText(output.traceback.join('\n'), config.jupyter.import.params));
                    markdowns.push('}}}');
                    markdowns.push(createIAL({ style: config.jupyter.style.error }));
                    markdowns.join('\n');
                    break;
                case 'execute_result':
                case 'display_data':
                    markdowns.push(await parseData(output.data, config.jupyter.import.params));
                    break;
            }
        }
        return markdowns.join('\n');
    }
}

/**
 * 通过 json 字符串导入 Jupyter Notebook
 * @params {string} docID: 文档 ID
 * @params {string} json: Jupyter Notebook 文件(*.ipynb)内容
 * @params {string} mode: 写入模式('w': 覆盖, 'a': 追加)
 */
async function importJson(docID, json, mode = 'a') {
    const ipynb_import = new IpynbImport();
    await ipynb_import.loadJson(json).parse();
    const kramdown = ipynb_import.toKramdown();

    await setBlockAttrs(docID, ipynb_import.attributes); // 设置文档块属性
    switch (mode) {
        case 'w': // 覆盖模式
            await updateBlock(docID, kramdown);
            break;
        case 'a': // 追加模式
        default:
            await appendBlock(docID, kramdown);
            break;
    }
};

workerInit(self); // 初始化工作线程
