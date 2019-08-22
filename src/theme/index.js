/*
* name -- theme
* author -- Harry
* date -- 2019-8-13
* version -- 4.2.0
* description -- 用于系统换主题
*/

import generateColors from './utils/color.js';
import colorMap from './utils/colorMap.js';
import api from "@/api";
import config from "../config";
import store from "@/vuex/index.js";
let { prefixedPath, themeCss, themes, defaultColor } = config;
let profix = process.env.NODE_ENV === 'production' ? '' : location.origin;
let changeTheme = async (color, theme, resolve) => {
    let styleData = '';
    if (themes[theme]) {
        themeCss.push(`/common/css/lib/${theme}.css`)
    }
    let apis = [];
    themeCss.forEach((_s, s) => {
        apis.push(
            api('get', profix + _s, {
                noIntercept: true,
                cache: true
            })
        )
    })
    await Promise.all(apis).then(data => {
        styleData = data.join(' ');
    }).catch(err => { })
    if (styleData && color != defaultColor) {
        let colors = {
            primary: color
        };
        colors = {
            ...colors,
            ...generateColors(colors.primary)
        };
        Object.keys(colorMap).forEach(key => {
            var value = colorMap[key];
            styleData = styleData.replace(new RegExp(key, "ig"), value);
        });
        Object.keys(colors).forEach(key => {
            styleData = styleData.replace(new RegExp("(:|\\s+)" + key, "g"), "$1" + colors[key]);
        });
    }
    styleData = styleData.replace(new RegExp("fonts/element-icons.woff", "g"), prefixedPath + "fonts/element-icons.woff");
    styleData = styleData.replace(new RegExp("fonts/element-icons.ttf", "g"), prefixedPath + "fonts/element-icons.ttf");
    var nod = document.createElement("style");
    if (nod.styleSheet) {
        nod.styleSheet.cssText = styleData;
    } else {
        nod.innerHTML = styleData;
    }
    document.getElementsByTagName("head")[0].appendChild(nod);
    window.localStorage.setItem('themeColor', theme);
    resolve();
}

// 修改主题
export default () => {
    return new Promise((resolve, reject) => {
        let storeColor = window.localStorage.getItem("themeColor");
        storeColor = storeColor == 'null' || !storeColor ? defaultColor : storeColor;
        let color = themes[storeColor] || storeColor;
        if (storeColor && store.state.theme != storeColor) {
            api("get", "/api/base/my_desktop/color", {
            }).then(res => {
                if (res.status == 200 && res.code == 'ok') {
                    if (res.data == defaultColor) {
                        store.commit("changeTheme", defaultColor);
                        window.localStorage.setItem('themeColor', defaultColor);
                        resolve()
                    } else {
                        color = themes[res.data] || res.data;
                        storeColor = res.data;
                        changeTheme(color, storeColor, resolve);
                        store.commit("changeTheme", storeColor);
                    }

                } else {
                    changeTheme(color, storeColor, resolve);
                    store.commit("changeTheme", storeColor);
                }
            }).catch(err => {
                changeTheme(color, storeColor, resolve);
                store.commit("changeTheme", storeColor);
            });
        } else {
            resolve()
            store.commit("changeTheme", storeColor);
            window.localStorage.setItem('themeColor', storeColor);
        }
    })
}