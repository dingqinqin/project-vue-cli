/*
 * name -- axios-ajax
 * author -- Harry
 * date -- 2018-12-20
 * version -- 2.0.0
 * description -- 基于axios二次封装
 * method -- 请求方法 get post put delete
 * url -- 请求api, 若为接口，会自动加 window.ShiYue.base 的前缀组成完整的url；如果传入的值为绝对地址，则不加前缀
 * params -- 请求参数
 *       -- get delete 对象参数 自动转键值对? 拼接在url地址后
 *       -- post put 传入为数组 Content-Type默认采用application/json，不处理传入数据；若传入对象则借助qs工具将其转为form表单提交的键值对；
 * serializer -- 是否采用 application/json，传入false 强制采用
 * otherConfig -- 其他配置
 */
import { Notification } from 'element-ui';
import store from "@/vuex/index.js"; // vuex
import qs from "qs";
import config from '@/config.js';

export default (method = 'get', url, params = {}, serializer = true, otherConfig = {}) => {

    // params.cache 为true 时，get请求不带时间戳 不携带在请求参数中
    // params.noIntercept 为true时，不调用公共校验方法 不携带在请求参数中

    let isArray = (obj) => {
        return (Object.prototype.toString.call(obj) == '[object Array]');
    }
    let isJumpCheckValidata = params.noIntercept || false;
    if (_.isPlainObject(serializer)) {
        otherConfig = _.cloneDeep(serializer);
        serializer = true
    }
    if (!/^http/.test(url) && !/^\//.test(url)) {
        url = '/' + url;
    }
    let resultUrl = /^http/.test(url) ? url : window.ShiYue.base + url;
    method = method.toLocaleLowerCase();
    let axiosConfig = {
        url: resultUrl,
        method: method,
        headers: {},
        params: {},
        // paramsSerializer: (params) => {
        //     return qs.stringify(params, { allowDots: true });
        // },
        data: {},
        timeout: 20 * 60 * 1000,
        withCredentials: true
    };
    if (method === 'get' || method === 'delete') {
        if (typeof params == "object" && !params.cache) {
            params._ = new Date().getTime()
        }
        let resultParmas = {};
        for (let key in params) {
            if (['cache', 'noIntercept'].indexOf(key) == -1 && params[key] !== undefined) {
                resultParmas[key] = params[key];
            }
        }
        axiosConfig.params = resultParmas;
    } else if (method === 'post' || method === 'put') {
        let _isArray = isArray(params);
        if (!serializer || _isArray) {
            axiosConfig.headers['Content-Type'] = 'application/json';
        }
        axiosConfig.data = ((!serializer || _isArray) ? params : qs.stringify(params, { allowDots: true }));
    }
    // 默认获取日志标识符
    let prePath = 'base';
    try {
        prePath = location.pathname.split('/')[1] || config.app;
    } catch (error) {
        prePath = config.app
    }
    let logObjs = {
        headers: {
            'Sy-Headers': `device=pc;app=${prePath}`
        }
    }

    return new Promise((resolve, reject) => {
        axios(Object.assign({}, axiosConfig, logObjs, otherConfig)).then(response => {
            let _result = '';
            if (!isJumpCheckValidata) {
                switch (response.data.status) {
                    case 200:
                        _result = response.data;
                        break;
                    case 400:
                        localStorage.removeItem('user');
                        if (!store.state.isShowLoginBox) {
                            if (process.env.NODE_ENV == 'development') {
                                store.commit('SHOW_LOGIN_DIALOG', true);
                            } else {
                                location.href = "/login?redirect_uri=" + encodeURIComponent(location.href);
                            }
                        }
                        _result = response.data;
                        break;
                    case 401:
                        console.log('401：', response.config.url, response.data.message);
                        axios.get(`${window.ShiYue.base}/api/uaa/oauth/refresh`, {
                            params: {
                                noIntercept: true
                            }
                        }).then((result) => {
                            if (result.status == 200 && result.code == 'ok') {
                                localStorage.setItem("user", JSON.stringify(result));
                                store.commit("getUserInfo");
                                let _c = response.config;
                                axios({
                                    url: _c.url,
                                    method: _c.method,
                                    headers: (_c.method == 'get' ? undefined : _c.headers),
                                    params: (_c.method == 'get' ? _c.params : _c.data)
                                }).then((_res) => {
                                    _result = _res;
                                }).catch((err) => {
                                    if (!store.state.isShowLoginBox) {
                                        store.commit('SHOW_LOGIN_DIALOG', true);
                                    }
                                    _result = 'error';
                                });
                            } else {
                                if (!store.state.isShowLoginBox) {
                                    if (process.env.NODE_ENV == 'development') {
                                        store.commit('SHOW_LOGIN_DIALOG', true);
                                    } else {
                                        location.href = "/login?redirect_uri=" + encodeURIComponent(location.href);
                                    }
                                }
                            }
                        }).catch((error) => {
                            if (!store.state.isShowLoginBox) {
                                store.commit('SHOW_LOGIN_DIALOG', true);
                            }
                            _result = 'error';
                        });
                        break;
                    case 403:
                        console.error('403：', response.config.url, response.data.message);
                        Notification.error({
                            title: '错误',
                            message: '您没有权限进行此操作！'
                        });
                        _result = response.data;
                        break;
                    case 404:
                        console.log(`${response.data.status}: `, response.config.url, response.data.message);
                        Notification.info({
                            title: '提示',
                            message: '此条路不通哦，请联系攻城狮。~~~///(^v^)\\\~~~'
                        });
                        break;
                    case 405:
                        console.log(`${response.data.status}: `, response.config.url, response.data.message);
                        _result = response.data;
                        break;
                    case 500:
                        console.error('500：', response.config.url, response.data.message);
                        if (process.env.NODE_ENV == "development") {
                            console.error("500：", response.config.url, response.data.message);
                        } else {
                            console.error("500：", response.config.url, response.data.message);
                        }
                        _result = response.data;
                        break;
                    default:
                        if (response.data.status >= 1000 && response.data.status <= 50000) {
                            let msg = '';
                            if (response.data.fieldErrors && response.data.fieldErrors.length > 0) {
                                for (let i = 0; i < response.data.fieldErrors.length; i++) {
                                    msg += response.data.fieldErrors[i].message + ' '
                                }
                            } else {
                                msg = response.data.message
                            }
                            Notification.info({
                                title: '信息',
                                message: msg
                            });
                        }
                        _result = response.data;
                }
            } else {
                _result = response.data;
            }
            resolve(_result);
        }).catch((error) => {
            // if (error && error.toString() == 'Error: Network Error') {
            //     alert('服务器已经暂停，请联系管理员重启服务器！')
            // }
            reject(error);
        })
    })
}