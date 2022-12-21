export {
    Iterator,
    pathParse,
    saveAsFile,
    merge, // 递归合并对象
    getRelativePath,
    copyToClipboard,
    removeOuterIAL, // 移除非列表项块的 IAL
    compareVersion, // 比较版本号
    preProcessBlockDOM, // 预处理 BlockDOM
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
    let path = filePath.replaceAll(/(\\|\/)+/g, '/');
    let paths = path.split('/');
    let filename = {
        full: paths.pop() || '', // 文件名全名
        main: null, // 主文件名
        ext: null, // 文件扩展名
    }
    let dir = paths.join('/'); // 文件所在目录
    if (filename.full.lastIndexOf('.') > 0) { // 文件有扩展名
        filename.main = filename.full.substring(0, filename.full.lastIndexOf('.'));
        filename.ext = filename.full.split('.').pop();
    }
    else {
        filename.main = filename.full;
        filename.ext = "";
    }
    return { path, dir, filename };
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

/**
 * 写入剪贴板(兼容模式)
 * REF [google chrome - navigator.clipboard is undefined - Stack Overflow](https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined)
 */
function copyToClipboard(text) {
    // navigator clipboard api needs a secure context (https | localhost | loopback)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(text);
    } else {
        // text area method
        const textarea = document.createElement("textarea");
        textarea.value = text;
        // make the textarea out of viewport
        // textarea.style.position = "fixed";
        // textarea.style.left = "-999999px";
        // textarea.style.top = "-999999px";
        textarea.style.display = "none";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        return new Promise((resolve, reject) => {
            // here the magic happens
            document.execCommand('copy') ? resolve() : reject();
            textarea.remove();
        });
    }
}

/**
 * 移除非列表项块的 IAL
 * @params {string} kramdown: kramdown 源码
 * @return {string}: 移除块的 IAL
 */
function removeOuterIAL(kramdown) {
    return kramdown.substring(0, kramdown.lastIndexOf('\n'))
}

/**
 * 比较版本号
 * @params {string} version1: 版本号1
 * @params {string} version2: 版本号2
 * @return {number}: 1: v1 > v2; -1: v1 < v2; 0: v1 = v2
 */
function compareVersion(version1, version2) {
    let v1_arr = version1.split('.');
    let v2_arr = version2.split('.');
    for (let i = 0; i < v1_arr.length; i++) {
        let v1_str = v1_arr[i];
        let v2_str = v2_arr[i];
        let v1_int = parseInt(v1_str);
        let v2_int = parseInt(v2_str);
        let v1, v2;
        if (!isNaN(v1_str) && !isNaN(v2_str)) { // 两者都为数字
            v1 = v1_int;
            v2 = v2_int;
        }
        else if (!isNaN(v1_arr[i]) || !isNaN(v2_arr[i])) { // 其中一者为数字
            if (v1_int !== v2_int) { // 版本号不一致
                v1 = v1_int;
                v2 = v2_int;
            }
            else if (!isNaN(v1_str) && isNaN(v2_str)) // v1 是正式版 | v2 是内测(x-alphaX)/公测(x-betaX)/开发版(x-devX)
                return 1;
            else if (isNaN(v1_str) && !isNaN(v2_str)) // v2 是正式版 | v1 是内测(x-alphaX)/公测(x-betaX)/开发版(x-devX)
                return -1;
            else // 意外的情况
                return 0;
        }
        else { // 都不为数字, 比较字符串, 开发版(dev) < 内测版(alpha) < 公测版(beta)版本号小
            if (v1_int !== v2_int) { // 版本号不一致
                v1 = v1_int;
                v2 = v2_int;
            } else { // 版本号一致, 通过后缀判断
                switch (true) {
                    case v1_str.includes('-dev'):
                        v1 = 1;
                        break;
                    case v1_str.includes('-alpha'):
                        v1 = 2;
                        break;
                    case v1_str.includes('-beta'):
                        v1 = 3;
                        break;
                    default:
                        v1 = 0
                        break;
                }
                switch (true) {
                    case v2_str.includes('-dev'):
                        v2 = 1;
                        break;
                    case v2_str.includes('-alpha'):
                        v2 = 2;
                        break;
                    case v2_str.includes('-beta'):
                        v2 = 3;
                        break;
                    default:
                        v2 = 0
                        break;
                }
                if (v1 === v2) { // 后缀也相同, 比较字符串大小
                    v1 = v1_str;
                    v2 = v2_str;
                }
            }
        }
        switch (true) {
            case v1 > v2:
                return 1;
            case v1 < v2:
                return -1;
            case v1 === v2:
            default:
                continue;
        }
    }
    return 0;
}

/**
 * 预处理 BlockDOM
 * @params {string} blockDOM: blockDOM 字符串
 * @return {string}: 处理后的 blockDOM
 */
function preProcessBlockDOM(blockDOM) {
    return blockDOM
        .replaceAll(`contenteditable="false"`, `contenteditable="true"`) // 默认 contenteditable 为 true
        ;
}
