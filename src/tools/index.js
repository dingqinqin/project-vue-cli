
import extend from './extend/index.js';
import directive from './extend/directive.js';
import request from '@/api'; 
import * as filters from './filters/index.js'; // 全局filter
import Dragging from './extend/dragging.js';
const install = function (Vue, opts = {}) {
    if (Vue.prototype.$isServer) return; 
    Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key])
    });
    // 自定义指令
    directive(Vue);
    // 引入配置内置请求方法
    Vue.prototype.$http = request;
    // 工具扩展
    for (let key in extend) {
        Vue.prototype['$' + key] = extend[key];
    }
    // 拖动排序
    Vue.use(Dragging);
};

export default {
    version: '1.0.0',
    install,
};