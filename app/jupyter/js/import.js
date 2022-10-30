/* 导入 *.ipynb 文件 */
// REF [The Notebook file format — nbformat 5.7 documentation](https://nbformat.readthedocs.io/en/latest/format_description.html#notebook-file-format)

import {
    config,
} from './config.js';

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

        this.cells = this.ipynb.cells;
        this.metadata = this.ipynb.metadata;
        this.nbformat = this.ipynb.nbformat;
        this.nbformat_minor = this.ipynb.nbformat_minor;

        this.parseMarkdown;
        this.parseCells;
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
    }

    /* 解析块 */
    parseCells() {
        for (let i = 0; i < this.cells.length; ++i) {
            this.kramdown.push(...this.parseCell(this.cells[i]));
        }
    }

    /**解析单个块
     * REF: https://nbformat.readthedocs.io/en/latest/format_description.html#cell-types
     */
    parseCell(cell) {
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
    parseMarkdown(cell) {
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
    }
}
