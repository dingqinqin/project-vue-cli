import Vue from 'vue';
import App from './App';
import router from './router';
import store from "./vuex/index.js"; // vuex
import api from './api';
import changeTheme from '@/theme/index.js';

// 全局配置 自定义方法 指令 过滤
import config_g from "./tools/index.js";
Vue.use(config_g);

// 语言 初始化
const langType = window.localStorage.getItem("lange_") || store.state.langType;
// 更新vuex中的语言信息
store.commit("changeLange", langType);
// 初始化 element 语言
if (langType == 'en' && ELEMENT) {
    ELEMENT.locale(ELEMENT.lang.en)
}

Vue.config.productionTip = false;
// 参数反序列化
let getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
};
// 实例化vue方法
let init = () => {
    // 查询当前用户主题
    changeTheme().then(res => {
        new Vue({
            el: '#app',
            router,
            store,
            template: '<App/>',
            components: {
                App
            }
        })
    })
};
// 检查是否是第三方授权登陆方式，--- 只有在异步登录框登陆才会触发
if (getQueryString("code") && location.pathname != '/desktop/setting') {
    var type = getQueryString("state").split("_")[0];
    api('get', "/api/uaa/social/" + type, {
        code: getQueryString("code")
    }).then(res => {
        if (res.status && res.status == 200) {
            localStorage.setItem("user", JSON.stringify(res.data));
            store.commit("getUserInfo");
            init();
        }
    }).catch(err => {
        init();
    })
} else {
    init();
}