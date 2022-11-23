/* 导入 *.ipynb 文件 */
// REF [The Notebook file format — nbformat 5.7 documentation](https://nbformat.readthedocs.io/en/latest/format_description.html#notebook-file-format)

import {
    config,
} from './config.js';
import {
    upload,
} from './api.js';

class Import {
    ipynb; // 文件内容
    cells; // 内容块
    metadata; // notebook 元数据
    nbformat; // 缩进长度
    nbformat_minor; // 次要缩进长度
    kramdown; // 导入的 kramdown 字符串数组
    attributes; // 导入的文档块属性

    constructor() {

    }

    /* 从文件导入 */
    loadFile(filepath) {

    }

    /* 导入文件内容 */
    loadText(json) {
        this.ipynb = JSON.parse(json);
        this.parse();
    }

    /**解析
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#top-level-structure
     */
    parse() {
        this.kramdown = [];
        this.attributes = {};

        this.cells = this.ipynb.cells; // 单元格
        this.metadata = this.ipynb.metadata; // 笔记本级元数据
        this.nbformat = this.ipynb.nbformat; // 缩进长度
        this.nbformat_minor = this.ipynb.nbformat_minor; // 次要缩进长度

        this.parseMarkdown(); // 解析文档元数据
        this.parseCells; // 解析所有单元格
        return this.kramdown.join('\n');
    }

    /**解析文档元数据
     * REF: https://jupyter-client.readthedocs.io/en/stable/kernels.html#kernel-specs
     */
    parseMetadata() {
        this.attributes[config.jupyter.attrs.kernel.name] =
            this.metadata.kernelspec.name
            ?? this.metadata.kernel_info.name;
        this.attributes[config.jupyter.attrs.kernel.language] =
            this.metadata.kernelspec.language
            ?? this.metadata.language_info.name;
        this.attributes[config.jupyter.attrs.kernel.display_name] =
            this.metadata.kernelspec.display_name
            ?? this.metadata.kernelspec.name
            ?? this.metadata.kernel_info.name;
    }

    /* 解析单元格 */
    parseCells() {
        for (let i = 0; i < this.cells.length; ++i) {
            this.kramdown.push(...this.parseCell(this.cells[i]));
        }
    }

    /**解析单个块
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#cell-types
     */
    async parseCell(cell) {
        switch (cell.cell_type) {
            case 'markdown':
                return this.parseMarkdown(cell);
            case 'code':
                return this.parseCode(cell);
            case 'raw':
                return this.parseRaw(cell);
        }
    }

    /**解析 markdown 块
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#markdown-cells
     */
    async parseMarkdown(cell) {
        const markdown = cell.source.join(); // markdown 文本
        const attachments = await this.parseAttachments(cell.attachments); // 附件
        for (const filename of attachments) {
            markdown.replace(`attachment:${filename}`, attachments[filename]);
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
    parseCode(cell) {
    }

    /**解析 raw 块
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#raw-nbconvert-cells
     */
    parseRaw(cell) {
        var mime_main, mime_sub;
        const mime = cell.metadata.raw_mimetype;
        [mime_main, mime_sub] = mime.split('/');
        const markdown = [];
        switch (mime_main) {
            case 'text':
                switch (mime_sub) {
                    case 'markdown':
                        markdown.push(...cell.source);
                        break;
                    case 'html':
                        markdown.push(
                            '<div>',
                            ...cell.source,
                            '</div>',
                        );
                        break;
                    case 'asciidoc':
                    case 'latex':
                    case 'restructuredtext':
                    case 'x-python':
                    default:
                        markdown.push(
                            `\`\`\`${mime_sub}`,
                            ...cell.source,
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
                    ...cell.source,
                    '```',
                );
                break;
        }
    }

    /**解析附件
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#cell-attachments
     * @return {object}: 附件引用名(attachment:xxx.ext) -> 附件文件引用(assets/xxx.ext)
     */
    async parseAttachments(attachments) {
        const map = {}; // attachment -> assets
        for (const filename of attachments) {
            const attachment = attachments[filename];
            for (const mime of attachment) {
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
}
