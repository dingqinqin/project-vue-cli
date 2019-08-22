import Vue from 'vue';
import Router from 'vue-router';
import routers from './routers.js';
import store from '@/vuex/index.js';
import api from '@/api/index.js';
Vue.use(Router);
let router = new Router({
    mode: 'history',
    history: true,
    hashbang: false, //将路径格式化为#!开头
    transitionOnLoad: true, //初次加载是否启用场景切换
    saveScrollPosition: false, //在启用html5 history模式的时候生效，用于后退操作的时候记住之前的滚动条位置
    routes: routers,
    scrollBehavior(to, from, savedPosition) { //这个功能只在 HTML5 history 模式下可用
        if (savedPosition) {
            // return savedPosition
            return {
                x: 0,
                y: 0
            }
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }
});

// 路由导航钩子
router.beforeEach((to, from, next) => {
    // 刷新用户信息
    let user = localStorage.getItem("user");
    if (user) {
        store.commit("getUserInfo");
        next();
    } else {
        api('get', '/api/uaa/oauth/me', {
            noIntercept: true
        }).then(res => {
            if (res.status == 200 && res.code == 'ok') {
                localStorage.setItem("user", JSON.stringify(res));
                store.commit("getUserInfo");
                next();
                // location.reload();
            } else {
                if (!store.state.isShowLoginBox) {
                    if (process.env.NODE_ENV == 'development') {
                        store.commit('SHOW_LOGIN_DIALOG', true);
                    } else {
                        location.href = "/login?redirect_uri=" + encodeURIComponent(location.href);
                    }
                }
            }
        }).catch(err => {
            if (!store.state.isShowLoginBox) {
                if (process.env.NODE_ENV == 'development') {
                    store.commit('SHOW_LOGIN_DIALOG', true);
                } else {
                    location.href = "/login?redirect_uri=" + encodeURIComponent(location.href);
                }
            }
        })
    }
})

export default router