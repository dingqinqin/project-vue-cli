import _ from 'lodash';
import qs from 'qs';
import moment from 'moment';
import print from '../print/index.js';
import tableDownload from './download-table.js';
import { scrollTo } from '../methods.js';

export default {
    tableDownload,
    scrollTo: scrollTo,
    print: print,
    _: _,
    moment: moment,
    isEmptyObject: (obj) => {
        if (null == obj || undefined == obj || typeof obj == 'object') {
            return true;
        }
        return Object.keys(obj).length == 0;
    },
    // 判断一个返回结果是不是数组
    isArry: (o) => { 
        return Object.prototype.toString.call(o) == '[object Array]';
    },
    emptyObj: (obj = {}) => {
        Object.keys(obj).forEach((_key, index) => {
            if (Object.prototype.toString.call(_key) == '[object Array]') {
                obj[_key] = [];
            } else {
                obj[_key] = '';
            }
        })
    },
    isEditorObject: (oldObj, newObj) => { // 判断两个对象是否相等 用于编辑判断提交
        let oldKeys = Object.keys(oldObj);
        let newKeys = Object.keys(newObj);
        if (oldKeys.length < newKeys.length) {
            // oldObj = [newObj, newObj = oldObj][0];
            [oldObj, newObj] = [newObj, oldObj]; // es6
        }
        for (let key in newObj) {
            console.log(oldObj[key], newObj[key]);
            if (oldObj[key] || newObj[key]) {
                if (oldObj[key] != newObj[key]) {
                    return true;
                }
            }
        }
        return false;
    },
    trim: (str) => {
        return str.replace(/^\s+|\s+$/g, '');
    },
    trimLeft: (str) => {
        return str.replace(/^\s+/, '');
    },
    trimRight: (str) => {
        return str.replace(/\s+$/, '');
    },
    overflow: (clazz) =>  {
        if (!clazz){ return false}
        let dom = document.getElementsByClassName(clazz);
        if (dom.length == 0) { return false }
        if (dom[0].offsetWidth < dom[0].scrollWidth){
            return true
        }else{
            return false
        }
    },
    setStore: (name, content) => { // 存储localStorage
        if (!name) return;
        if (typeof content === 'object') {
            content = JSON.stringify(content);
        }
        window.localStorage.setItem(name, content);
    },
    getStore: name => { // 获取localStorage
        if (!name) return '';
        let localValue = window.localStorage.getItem(name);
        try {
            localValue = JSON.parse(localValue)
        } catch (error) {
            
        }
        return localValue;
    },
    setSess: (name, content) => { // sessionStorage
        if (!name) return;
        if (typeof content === 'object') {
            content = JSON.stringify(content);
        }
        window.sessionStorage.setItem(name, content);
    },
    getSess: name => { // sessionStorage
        if (!name) return false;
        let msg = window.sessionStorage.getItem(name);
        if (msg && /^[\[{]/gi.test(msg)) {
            msg = JSON.parse(msg);
        }
        return msg;
    },
    removeSess: name => { // 删除sessionStorage
        if (!name) return;
        window.sessionStorage.removeItem(name);
    },
    removeStore: name => { // 删除localStorage
        if (!name) return;
        window.localStorage.removeItem(name);
    },
    testEmail: (value) => { // 验证邮箱格式
        value = value.trim();
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            return false;
        }
        return true;
    },
    data2tree: (datas, idprop, pIdprop) => {
        if (!idprop) {
            idprop = 'id';
        }
        if (!pIdprop) {
            pIdprop = 'parentId';
        }
        let nodes = [],
            c = function(obj) {
                let _c = [];
                for (let i = 0; i < datas.length; i++) {
                    let _d = _.cloneDeep(datas[i]);
                    if (_d[pIdprop + ''] == obj[idprop + '']) {
                        _c.push(_d);
                        c(_d);
                    }
                }
                if (_c.length) {
                    obj.children = _c;
                }
            };
        for (let i = 0; i < datas.length; i++) {
            let _d = _.cloneDeep(datas[i]);
            if ((!_d[pIdprop + ''] && _d[pIdprop + ''] != '') || (!_.result(_.find(datas, {
                    [idprop]: _d[pIdprop + '']
                }), idprop))) {
                c(_d);
                nodes.push(_d);
            }
        }
        return nodes;
    },
    downloade: (url, method, parmas = {}) => {
        let obj = {};
        for (let key in parmas) {
            if (typeof (parmas[key]) == 'number' || parmas[key]) {
                obj[key] = parmas[key]
            }
        }
        let formDom = document.createElement('form');
        formDom.method = method.toUpperCase();
        formDom.style.display = 'none';
        if (formDom.method == 'GET') {
            formDom.action = window.ShiYue.base + url + '?' + qs.stringify(obj);
        } else {
            Object.keys(obj).forEach((_p, p) => {
                let textarea = document.createElement('textarea');
                textarea.value = obj[_p];
                textarea.name

                    = _p;
                formDom.appendChild(textarea);
            })
            formDom.action = window.ShiYue.base + url
        }
        document.body.appendChild(formDom);
        formDom.submit();
        setTimeout(() => {
            document.body.removeChild(formDom)
        }, 500)
    },
    checkPhoneNumber: (value) => {
        return /^1[0-9]{10}$/.test(value)
    },
    checkIdCard: (value) => {
        return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i.test(value)
    },
    checkEmail: (value) => {
        return /^([a-zA-Z0-9_\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/gi.test(value);
    },
    removeZero: (val, obj, key) => {
        if (val) {
            if (/^0{1,}$/.test(val)) {
                setTimeout(() => {
                    obj[key] = '0'; //把一串0变成一个0
                }, 50)
            } else {
                if (!/^\d{0,}\./.test(val))
                    obj[key] = val.replace(/\b(0+)/gi, ""); //去掉字符串前面的所有0
            }
        }
    },

    //验证联系电话
    /*规则：
     * 可以为空字符串或null；
     * 允许包含最多两个空格或"-"，不允许空格或"-"连续或交替输入;
     * 可以匹配手机、座机或400/800热线电话;
     * 联系电话正确返回true,错误返回false；
     */
    checkContact: (value) => {
        let f = /^\d|-|\s{1,}$/
        let nf = /-{2,}|\s{2,}|(\s-)|(-\s)/
        let s = /(^1\d{10}$)|(^(0[1-9]\d{1,2})?\d{7,8}$)|(^(400|800)\d{7,8}$)/
        let v = value === null ? "" : value + "";
        if (v.length === 0) return true;
        if (f.test(v) && !nf.test(v) && v.replace(/\d/g, "").length < 3) {
            if (s.test(v.replace(/\D/g, ""))) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },

    //点击树节点选中该节点
    /*
     * 点击没有children的树节点,该节点会改变选中状态
     * 用法：写在tree的node-click事件里
     *
     * 参数如下：
     * _this：this
     * val：当前节点数据，类型为object
     * refName：树的$refs对象名，类型为string
     * noSelect：可选择节点的标识，可选，类型为string
     * noSelectContent：可选择节点标识的内容，可选
     * isRadio：是否为单选，默认值false
     */
    selectNodeClick: (_this, val, refName, noSelect, noSelectContent, isRadio) => {
        let data = _this.$refs[refName].getCheckedNodes();
        if (noSelect && noSelectContent) {
            if (val[noSelect] !== noSelectContent) {
                return;
            }
        }
        if (!Boolean(val.children) || val.children.length < 1) {
            if (data.length > 0) {
                let z = _.findIndex(data, (obj) => {
                    return JSON.stringify(obj) == JSON.stringify(val);
                });
                if (z > -1) {
                    data.splice(z, 1)
                    _this.$refs[refName].setCheckedNodes(data);
                    return;
                }
            }
            if (isRadio) data = [val];
            else data.push(val);
            console.log("data", data)
            _this.$refs[refName].setCheckedNodes(data);
            return;
        }
    },


    //检验非法文件类型
    checkFileType: (fileName) => {
        let fileType = /\.[^\.]+$/.exec(fileName);
        if (fileType == ".exe" ||
            fileType == ".jar" ||
            fileType == ".jsp" ||
            fileType == ".asp" ||
            fileType == ".dll" ||
            fileType == ".php" ||
            fileType == ".aspx" ||
            fileType == ".bat" ||
            fileType == ".sh" ||
            fileType == ".html" ||
            fileType == ".com" ||
            fileType == ".cgi" ||
            fileType == ".class" ||
            fileType == ".jspx")
            return false;
        else
            return true;
    },
    uuid: (len, radix)=>{
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
    numberToChinese:(number)=> {
        var a = (number + '').split(''),
            s = [];
        let units = '个十百千万@#%亿^&~';
        let chars = '零一二三四五六七八九';
        if (a.length > 12) {
            throw new Error('too big');
        } else {
            for (var i = 0, j = a.length - 1; i <= j; i++) {
                if (j == 1 || j == 5 || j == 9) { // 两位数 处理特殊的 1*
                    if (i == 0) {
                        if (a[i] != '1')
                            s.push(chars.charAt(a[i]));
                    } else {
                        s.push(chars.charAt(a[i]));
                    }
                } else {
                    s.push(chars.charAt(a[i]));
                }
                if (i != j) {
                    s.push(units.charAt(j - i));
                }
            }
        }
        // return s;
        return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) { // 优先处理
            // 零百
            // 零千 等
            b = units.indexOf(d);
            if (b != -1) {
                if (d == '亿')
                    return d;
                if (d == '万')
                    return d;
                if (a[j - b] == '0')
                    return '零'
            }
            return '';
        }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) { // 零百 零千处理后
            // 可能出现
            // 零零相连的
            // 再处理结尾为零的
            return b;
        }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
            return {
                '@': '十',
                '#': '百',
                '%': '千',
                '^': '十',
                '&': '百',
                '~': '千'
            }[m];
        }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
            c = units.indexOf(d);
            if (c != -1) {
                if (a[j - c] == '0')
                    return d + '零' + b
            }
            return m;
        });
    }
}