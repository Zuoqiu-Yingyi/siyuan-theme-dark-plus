export {
    Iterator,
    pathParse,
    saveAsFile,
    merge, // 递归合并对象
    getRelativePath,
};

// REF [js - 对象递归合并merge - zc-lee - 博客园](https://www.cnblogs.com/zc-lee/p/15873611.html)
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
function isArray(arr) {
    return Array.isArray(arr)
}
function merge(target, ...arg) {
    return arg.reduce((acc, cur) => {
        return Object.keys(cur).reduce((subAcc, key) => {
            const srcVal = cur[key]
            if (isObject(srcVal)) {
                subAcc[key] = merge(subAcc[key] ? subAcc[key] : {}, srcVal)
            } else if (isArray(srcVal)) {
                // series: []，下层数组直接赋值
                subAcc[key] = srcVal.map((item, idx) => {
                    if (isObject(item)) {
                        const curAccVal = subAcc[key] ? subAcc[key] : []
                        return merge(curAccVal[idx] ? curAccVal[idx] : {}, item)
                    } else {
                        return item
                    }
                })
            } else {
                subAcc[key] = srcVal
            }
            return subAcc
        }, acc)
    }, target)
}

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
    return true;
}

/**
 * 绝对路径转相对路径
 */
function getRelativePath(filePath, basePath) {
    filePath = filePath.replaceAll(/(\\|\/)+/g, '/');
    basePath = basePath.replaceAll(/(\\|\/)+/g, '/');
    if (filePath.startsWith(basePath)) {
        return filePath.substring(basePath.length);
    }
    else if (filePath.find(basePath) !== -1) {
        return filePath.substring(filePath.find(basePath) + basePath.length);
    }
    else return null;
}
