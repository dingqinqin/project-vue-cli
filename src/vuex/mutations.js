import lang from "../lang/index.js";
import {
    PageLogin
} from 'element-ui';
let getQueryString = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
}
export default {
    SHOW_LOGIN_DIALOG(state, data) {
        state.isShowLoginBox = data || true;
        PageLogin({
            closeOnClickModal: false,
            beforeClose: (action, instance, done) => {
                done();
            }
        }).then((res) => {
            let href = getQueryString('redirect_uri');
            location.href = href;
            state.isShowLoginBox = false;
        });
    },
    SHOW_LOGIN_BOX(state, data) {
        state.isShowLoginBox = data || false;
    },
    getUserInfo(state) {
        let userMsg = JSON.parse(window.localStorage.getItem('user')) || {data: {}};
        state.realName = userMsg.data.realName || '';
        state.loginName = userMsg.data.loginName || '';
        state.avatar = userMsg.data.avatar || '';
        state.unitId = userMsg.data.unitId || '';
        state.unitType = userMsg.data.unitType || '';
        state.userId = userMsg.data.userId || '';
        state.userType = userMsg.data.userType || '';
    },
    changeLange(state, data) {
        state.langType = data;
        state.lang = lang[data];
    },
    changeTheme(state, data) {
        state.theme = data;
    },
    changeLangList(state, data) {
        state.langList = data;
    }
}