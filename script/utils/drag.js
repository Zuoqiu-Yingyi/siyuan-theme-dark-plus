class Drag {
    status;
    constructor() {
        this.status = {
            mouse: { // 当前鼠标
                position: { // 当前鼠标位置
                    x: null,
                    y: null,
                },
            },
            drag: { // 拖拽
                position: { // 拖动点相对于拖拽元素的位置
                    x: null,
                    y: null,
                },
                size: { // 拖拽目标尺寸
                    width: null,
                    height: null,
                },
            },
            flags: {
                dragging: false, // 是否正在拖拽
            },
        };
        /* 获得鼠标位置 */
        window.addEventListener("mousemove",
            e => {
                this.status.mouse.position.x = e.pageX;
                this.status.mouse.position.y = e.pageY;
            },
            {
                capture: true,
                passive: true,
            },
        );

        this.handler = {
            /**
             * 拖拽移动事件处理
             * @params {Event} e: 鼠标事件
             * @params {HTMLElement} draggable: 可拖拽的区域
             * @params {HTMLElement} target: 操作的目标元素
             * @params {HTMLElement} stage: 在哪个元素内拖拽
             */
            dragMove: (e, draggable, target, stage) => {
                // console.log(e);
                /* 子窗口左上角将要移动到的位置坐标 */
                let x = e.clientX - this.status.drag.position.x;
                let y = e.clientY - this.status.drag.position.y;

                /* 子窗口左上角可以可以移动到区域边缘 */
                let window_width = stage.clientWidth - target.offsetWidth;
                let window_height = stage.clientHeight - target.offsetHeight;

                x = (x < 0) ? 0 : x;                          // 当子窗口移动到主窗口最左边时
                x = (x > window_width) ? window_width : x;    // 当子窗口移动到主窗口最右边时
                y = (y < 0) ? 0 : y;                          // 当子窗口移动到主窗口最上边时
                y = (y > window_height) ? window_height : y;  // 当子窗口移动到主窗口最下边时

                // target.style.left = `${x}px`;
                // target.style.top = `${y}px`;
                target.style.left = `${100 * x / document.documentElement.offsetWidth}%`;
                target.style.top = `${100 * y / document.documentElement.offsetHeight}%`;
            }
        };
    }

    /**
     * 拖动功能鼠标按下时的处理器
     * @params {Event} e: 鼠标事件
     * @params {HTMLElement} stage: 在哪个元素内拖拽
     * @params {function} mousemoveHandler: 鼠标移动事件的处理器
     */
    dragMousedown(e, stage, mousemoveHandler) {
        /* 取消其他默认事件处理 */
        e.preventDefault();
        e.stopPropagation();

        /* 避免 mousemove 事件在 iframe 中无法触发 */
        // REF [在 iframe 上无法捕获 mousemove](https://blog.csdn.net/DongFuPanda/article/details/109533365)
        stage.querySelectorAll('iframe').forEach(iframe => iframe.style.pointerEvents = 'none');

        stage.addEventListener("mousemove", mousemoveHandler);
    }


    /**
     * 拖动功能鼠标抬起时的处理器
     * @params {Event} e: 鼠标事件
     * @params {HTMLElement} stage: 在哪个元素内拖拽
     * @params {function} mousemoveHandler: 鼠标移动事件的处理器
     */
    dragMouseup(e, stage, mousemoveHandler) {
        /* 取消其他默认事件处理 */
        e.preventDefault();
        e.stopPropagation();

        stage.querySelectorAll('iframe').forEach(iframe => iframe.style.pointerEvents = 'auto');

        stage.removeEventListener("mousemove", mousemoveHandler);
    }

    /**
     * 注册拖拽功能
     * @params {HTMLElement} draggable: 可拖拽的区域
     * @params {HTMLElement} target: 拖拽的目标元素
     * @params {HTMLElement} stage: 在哪个元素内拖拽
     * @params {function} mousemoveHandler: 鼠标移动事件的处理器
     * @params {function} preproccess: 预处理方法
     * @params {function} postproccess: 后处理方法
     * @params {function} final: 拖动完成回调方法
     */
    dragRegister(draggable, target, stage, handler, preproccess = null, postproccess = null, final = null) {
        const eventHandler = e => {
            if (typeof preproccess === 'function') preproccess(this);
            handler(e, draggable, target, stage);
            if (typeof postproccess === 'function') postproccess(this);
        };
        draggable.addEventListener("mousedown", e => {
            /* 取消其他默认事件处理 */
            e.preventDefault();
            e.stopPropagation();

            this.status.flags.dragging = true; // 正在拖拽
            /* 记录鼠标与窗口的相对位置 */
            this.status.drag.position.x = e.clientX - target.offsetLeft; // 鼠标相对于子窗口左上角的横向偏移量(鼠标横坐标 - this.status 的 左侧偏移量)
            this.status.drag.position.y = e.clientY - target.offsetTop; // 鼠标相对于子窗口左上角的纵向偏移量(鼠标纵坐标 - this.status 的 上侧偏移量)
            this.status.drag.size.width = target.offsetWidth; // 窗口宽度
            this.status.drag.size.height = target.offsetHeight; // 窗口高度

            this.dragMousedown(e, stage, eventHandler);
        });
        draggable.addEventListener("mouseup", e => { // 松开按键结束拖拽
            /* 取消其他默认事件处理 */
            e.preventDefault();
            e.stopPropagation();

            this.status.flags.dragging = false;
            this.dragMouseup(e, stage, eventHandler);
            if (typeof final === 'function') final(this);
        });
        stage.addEventListener('mouseleave', e => { // 鼠标移出拖拽区域结束拖拽
            this.status.flags.dragging = false;
            this.dragMouseup(e, stage, eventHandler);
            if (typeof final === 'function') final(this);
        }, false);
    }
}
export const drag = new Drag();
