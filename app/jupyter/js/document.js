import {
    url,
    config,
    custom,
    saveCustomFile,
} from './config.js';
import {
    jupyter,
    getBlockAttrs,
    setBlockAttrs,
} from './api.js';

const sessions_create_kernel_select = document.getElementById(config.jupyter.id.session.create.select);
const sessions_create_refresh_button = document.getElementById(config.jupyter.id.session.create.refresh);

const sessions_create_kernel_image = document.getElementById(config.jupyter.id.session.create.image);
const sessions_create_language_span = document.getElementById(config.jupyter.id.session.create.language);

const sessions_create_name_input = document.getElementById(config.jupyter.id.session.create.name);
const sessions_create_path_input = document.getElementById(config.jupyter.id.session.create.path);
const sessions_create_create_button = document.getElementById(config.jupyter.id.session.create.create);

const sessions_manage_session_select = document.getElementById(config.jupyter.id.session.manage.select);
const sessions_manage_refresh_button = document.getElementById(config.jupyter.id.session.manage.refresh);
const sessions_manage_name_input = document.getElementById(config.jupyter.id.session.manage.name);
const sessions_manage_path_input = document.getElementById(config.jupyter.id.session.manage.path);
const sessions_manage_update_button = document.getElementById(config.jupyter.id.session.manage.update);

const sessions_manage_state_span = document.getElementById(config.jupyter.id.session.manage.state);
const sessions_manage_kernel_image = document.getElementById(config.jupyter.id.session.manage.image);
const sessions_manage_kernel_name_span = document.getElementById(config.jupyter.id.session.manage.kernel);

const sessions_manage_start_button = document.getElementById(config.jupyter.id.session.manage.start);
const sessions_manage_interrupt_button = document.getElementById(config.jupyter.id.session.manage.interrupt);
const sessions_manage_restart_button = document.getElementById(config.jupyter.id.session.manage.restart);
const sessions_manage_delete_button = document.getElementById(config.jupyter.id.session.manage.delete);

const id = url.searchParams.get('id'); // 文档 ID
const lang = url.searchParams.get('lang'); // 用户语言
const i18n = config.jupyter.i18n; // 多语言

var attrs = await getBlockAttrs(id);
var kernelspecs, sessions, session, kernel;

/* 初始化 */
function init() {
    if (kernelspecs && sessions) {
        if (attrs[config.jupyter.attrs.kernel.name])
            sessions_create_kernel_select.value = attrs[config.jupyter.attrs.kernel.name];
        if (attrs[config.jupyter.attrs.session.name])
            sessions_create_name_input.value = attrs[config.jupyter.attrs.session.name];
        if (attrs[config.jupyter.attrs.session.path])
            sessions_create_path_input.value = attrs[config.jupyter.attrs.session.path];
        if (attrs[config.jupyter.attrs.kernel.id]) {
            session = sessions.find(session => session.kernel.id === attrs[config.jupyter.attrs.kernel.id]);
            if (session) {
                sessions_manage_session_select.value = session.id;
                renderSessionInfo(session);
            }
        }
    }
    else setTimeout(init, 250);
}

/* 更新内核下拉选择器 */
function updateKernelspecsSelector(kernelspecs, selector, defaultKernel) {
    selector.innerHTML = '';
    for (const kernelspec in kernelspecs) {
        const defaultSelected = kernelspecs[kernelspec].name === defaultKernel ? true : false;
        selector.appendChild(new Option(
            kernelspecs[kernelspec].spec.display_name,
            kernelspecs[kernelspec].name),
            undefined,
            defaultSelected,
        );
    }
    selector.dispatchEvent(new Event('change'));
}

/* 更新会话下拉选择器 */
function updateSessionsSelector(sessions, selector, defaultSession) {
    selector.innerHTML = '';
    for (const session of sessions) {
        const defaultSelected = session.id === defaultSession.id ? true : false;
        selector.appendChild(new Option(
            session.name,
            session.id,
            undefined,
            defaultSelected,
        ));
    }
    selector.dispatchEvent(new Event('change'));
}

/* 渲染内核信息 */
function renderKernelspecInfo(kernelspec) {
    sessions_create_kernel_image.src = `${custom.jupyter.server}${kernelspec.resources[`logo-32x32`]}`;
    sessions_create_language_span.innerText = kernelspec.spec.language;
}

/* 渲染会话信息 */
function renderSessionInfo(session) {
    sessions_manage_name_input.value = session.name;
    sessions_manage_path_input.value = session.path;
    sessions_manage_state_span.innerText = session.kernel.execution_state;
    if (kernelspecs && kernelspecs.kernelspecs[session.kernel.name]) {
        sessions_manage_kernel_image.src = `${custom.jupyter.server}${kernelspecs.kernelspecs[session.kernel.name].resources[`logo-32x32`]}`;
        sessions_manage_kernel_name_span.innerText = session.kernel.name;
    }
}

/* 刷新当前可用内核 */
sessions_create_refresh_button.addEventListener('click', async () => {
    kernelspecs = await jupyter.kernelspecs.get();

    updateKernelspecsSelector(
        kernelspecs.kernelspecs,
        sessions_create_kernel_select,
        kernelspecs.default,
    );
});

/* 新建会话 */
sessions_create_create_button.addEventListener('click', async () => {
    const kernel_name = sessions_create_kernel_select.value;
    const name = sessions_create_name_input.value;
    const path = sessions_create_path_input.value;
    if (kernel_name && name && path) {
        session = await jupyter.sessions.post({
            path: path,
            name: name,
            type: 'console',
            kernel: {
                name: kernel_name,
            },
        });
        console.log(
            `${i18n.session[lang] || i18n.session.default}:\n`,
            session,
        );
        sessions_manage_refresh_button.click();
    }
    else {
        alert(i18n.incomplete[lang] || i18n.incomplete.default);
    }
});

/* 更换内核后显示内核的信息 */
sessions_create_kernel_select.addEventListener('change', () => {
    renderKernelspecInfo(kernelspecs.kernelspecs[sessions_create_kernel_select.value]);
});

/* 更换会话后显示会话的信息 */
sessions_manage_session_select.addEventListener('change', () => {
    session = sessions.find(session => session.id === sessions_manage_session_select.value);
    renderSessionInfo(session);
});

/* 刷新当前活动会话 */
sessions_manage_refresh_button.addEventListener('click', async () => {
    sessions = await jupyter.sessions.get();
    console.log(
        `${i18n.sessions[lang] || i18n.sessions.default}:\n`,
        sessions,
    );
    if (sessions.length > 0) {
        updateSessionsSelector(
            sessions,
            sessions_manage_session_select,
            session ? session : sessions[0],
        );
    }
});

/* 更新会话信息 */
sessions_manage_update_button.addEventListener('click', async () => {
    const session_id = sessions_manage_session_select.value;
    const session_name = sessions_manage_name_input.value;
    const session_path = sessions_manage_path_input.value;
    if (session_id && session_name && session_path) {
        session = await jupyter.sessions.patch(
            session_id,
            {
                name: session_name,
                path: session_path,
            },
        );
        console.log(
            `${i18n.session[lang] || i18n.session.default}:\n`,
            session,
        );
        sessions_manage_refresh_button.click();
    }
    else {
        alert(i18n.incomplete[lang] || i18n.incomplete.default);
    }
});

/* 链接文档与会话 */
sessions_manage_start_button.addEventListener('click', async () => {
    const kernel_id = session.kernel.id;
    const kernel_name = session.kernel.name;
    const kernel_language = kernelspecs.kernelspecs[kernel_name].spec.language;
    const session_name = sessions_manage_name_input.value;
    const session_path = sessions_manage_path_input.value;
    attrs = {
        [config.jupyter.attrs.kernel.id]: kernel_id,
        [config.jupyter.attrs.kernel.name]: kernel_name,
        [config.jupyter.attrs.kernel.language]: kernel_language,
        [config.jupyter.attrs.session.name]: session_name,
        [config.jupyter.attrs.session.path]: session_path,
    };
    localStorage.setItem("local-codelang", kernel_language);
    setBlockAttrs(id, attrs);
});

/* 中止当前会话内核运行 */
sessions_manage_interrupt_button.addEventListener('click', async () => {
    const r = await jupyter.kernels.interrupt(session.kernel.id);
    console.log(
        `${i18n.interrupt[lang] || i18n.interrupt.default}:\n`,
        r,
    );
    sessions_manage_refresh_button.click();
});

/* 重启当前会话内核 */
sessions_manage_restart_button.addEventListener('click', async () => {
    kernel = await jupyter.kernels.restart(session.kernel.id);
    if (kernel) {
        console.log(
            `${i18n.restart[lang] || i18n.restart.default}:\n`,
            kernel,
        );
        sessions_manage_refresh_button.click();
    }
});

/* 删除当前会话 */
sessions_manage_delete_button.addEventListener('click', async () => {
    const r = await jupyter.sessions.delete(session.id);
    console.log(
        `${i18n.delete[lang] || i18n.delete.default}:\n`,
        session,
    );
    session = null;
    sessions_manage_refresh_button.click();
});

sessions_create_refresh_button.click(); // 刷新内核列表
sessions_manage_refresh_button.click(); // 刷新会话列表
setTimeout(init, 0);
