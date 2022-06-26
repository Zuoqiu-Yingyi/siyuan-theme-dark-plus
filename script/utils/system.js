export {
    openFile,
    writeFile,
    copyFile,
    rename,
    stat,
    rm,
};

/**
 * 通过文件选择器选择文件
 */
async function openFile(
    title = undefined,
    defaultPath = undefined,
    buttonLabel = undefined,
    filters = [
        { name: 'All Files', extensions: ['*'] },
    ],
    properties = [
        'openFile',
        // 'openDirectory',
        // 'multiSelections',
        'showHiddenFiles',
    ],
) {
    let path;
    // Electron 环境
    try {
        // REF [Electron - 使用文件对话框](https://www.electronjs.org/docs/api/dialog)
        const { dialog } = require('@electron/remote');
        const fs = require('fs/promises');
        let result = await dialog.showOpenDialog({
            title: title,
            defaultPath: defaultPath,
            buttonLabel: buttonLabel,
            filters: filters,
            properties: properties,
        });

        if (result.canceled) {
            return null;
        }
        if (result.filePaths && result.filePaths.length > 0) path = result.filePaths[0];

        return path ? path.replaceAll('\\', '/') : null;
    }
    catch (err) {
        console.warn(err);
        return null;
    }
}

/**
 * 写入文件
 * REF [fsPromises.writeFile(file, data[, options])](https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options)
 */
async function writeFile(
    path,
    data,
    options = {
        encoding: 'utf8',
        mode: 0o666,
        flag: 'w',
    },
) {
    // Electron 环境
    try {
        const fs = require('fs/promises');
        await fs.writeFile(path, data, options);
        return path;
    }
    catch (err) {
        console.warn(err);
        return null;
    }
}

/**
 * 复制文件
 * REF [fsPromises.copyFile(src, dest\[, mode\])](https://nodejs.org/api/fs.html#fspromisescopyfilesrc-dest-mode)
 */
async function copyFile(
    src,
    dest,
) {
    // Electron 环境
    try {
        const fs = require('fs/promises');
        await fs.copyFile(src, dest);
        return src;
    }
    catch (err) {
        console.warn(err);
        return null;
    }
}

/**
 * 重命名/移动文件
 * REF [fsPromises.rename(oldPath, newPath)](https://nodejs.org/api/fs.html#fspromisesrenameoldpath-newpath)
 */
async function rename(
    oldPath,
    newPath,
) {
    // Electron 环境
    try {
        const fs = require('fs/promises');
        await fs.rename(oldPath, newPath);
        return newPath;
    }
    catch (err) {
        console.warn(err);
        return null;
    }
}

/**
 * 检查文件状态
 * REF [fsPromises.stat(path\[, options\])](https://nodejs.org/api/fs.html#fspromisesstatpath-options)
 */
async function stat(path) {
    // Electron 环境
    try {
        const fs = require('fs/promises');
        let stats = await fs.stat(path);
        // console.log(stats);
        return stats;
    }
    catch (err) {
        console.warn(err);
        return null;
    }
}

/**
 * 删除文件
 * REF [fsPromises.rm(path\[, options\])](https://nodejs.org/api/fs.html#fspromisesrmpath-options)
 */
async function rm(
    path,
    options = {
        force: true,
        recursive: true,
    },
) {
    // Electron 环境
    try {
        const fs = require('fs/promises');
        await fs.rm(path, options);
        return path;
    }
    catch (err) {
        console.warn(err);
        return null;
    }
}
