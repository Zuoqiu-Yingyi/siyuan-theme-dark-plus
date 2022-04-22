export {
    Iterator,
    pathParse,
    saveAsFile,
};
import { getLocalFile } from './api.js';


function* Iterator(items, loop = false) {
    // REF [ES6中的迭代器(Iterator)和生成器(Generator) - 小火柴的蓝色理想 - 博客园](https://www.cnblogs.com/xiaohuochai/p/7253466.html)
    if (loop) {
        for (let i = 0; true; i = (i + 1) % items.length) {
            yield items[i];
        }
    }
    else {
        for (let i = 0; i < items.length; ++i) {
            yield items[i];
        }
    }
}

/* 解析路径 */
function pathParse(filePath) {
    filePath = filePath.replaceAll(/(\\|\/)+/g, '/');
    let path = filePath.split('/');
    let filename = path.pop() || ''; // 文件名
    let dir = path.join('/'); // 文件所在目录
    let ext = filename.lastIndexOf('.') > 0 ? filename.split('.').pop() : ''; // 文件扩展名
    return { dir, filename, ext };
}

/**
 * 另存为文件
 * REF [Saving generated files on the client-side — Eli Grey](https://eligrey.com/blog/saving-generated-files-on-the-client-side/)
 */
async function saveAsFile(filedata, filename = 'block.md', type = null) {
    saveAs(new File(
        [filedata],
        filename,
        type ? { type: type } : undefined
    ));
}
