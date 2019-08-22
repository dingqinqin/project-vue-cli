import waves from './waves/waves.js';
import download from './download-tables.js';

const isServer = Vue.prototype.$isServer;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);
/* istanbul ignore next */
const camelCase = function (name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

function setStyle(element, styleName, value) {
    if (!element || !styleName) return;

    if (typeof styleName === 'object') {
        for (var prop in styleName) {
            if (styleName.hasOwnProperty(prop)) {
                setStyle(element, prop, styleName[prop]);
            }
        }
    } else {
        styleName = camelCase(styleName);
        if (styleName === 'opacity' && ieVersion < 9) {
            element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
        } else {
            element.style[styleName] = value;
        }
    }
};

const styles = {
    display: 'block',
    'box-sizing': 'border-box',
    width: '100%',
    'vertical-align': 'middle',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    'overflow': 'hidden'
}

export default (Vue) => {
    Vue.directive('focus', { //输入框自动获得焦点
        inserted: (el) => {
            el.focus()
        }
    });

    Vue.directive("back", { //返回上个history页面
        bind: (el, binding, vnode) => {
            el.addEventListener('click', () => {
                window.history.go(-1);
                // window.history.back();
            })
        }
    });
    let getStyles = function (styles, _styles) {
        if (_styles) {
            for (let key in _styles) {
                styles[key] = _styles[key];
            }
        }
        return styles;
    };
    Vue.directive("title", {
        //溢出隐藏 并增加鼠标提示
        bind: (el, binding, vnode) => {
            if (binding.value) {
                setStyle(el, getStyles(styles, binding.value.styles), null);
                if (el.offsetWidth < el.scrollWidth) {
                    el.setAttribute("title", binding.value.title);
                }
            } else {
                if (el.offsetWidth < el.scrollWidth) {
                    var re1 = new RegExp("<.+?>", "g");
                    el.setAttribute("title", el.innerHTML.replace(re1, ''));
                }
            }
        },
        inserted: (el, binding, vnode) => {
            if (binding.value) {
                setStyle(el, getStyles(styles, binding.value.styles), null);
                if (el.offsetWidth < el.scrollWidth) {
                    el.setAttribute("title", binding.value.title);
                }
            } else {
                if (el.offsetWidth < el.scrollWidth) {
                    var re1 = new RegExp("<.+?>", "g");
                    el.setAttribute("title", el.innerHTML.replace(re1, ''));
                }
            }
        },
        componentUpdated: (el, binding, vnode) => {
            if (binding.value) {
                setStyle(el, getStyles(styles, binding.value.styles), null);
                if (el.offsetWidth < el.scrollWidth) {
                    el.setAttribute("title", binding.value.title);
                }
            } else {
                if (el.offsetWidth < el.scrollWidth) {
                    var re1 = new RegExp("<.+?>", "g");
                    el.setAttribute("title", el.innerHTML.replace(re1, ''));
                }
            }
        }
    });
    let movetext = (el) => {
        let boxw = el.offsetWidth;
        let maxW = el.scrollWidth;
        let paremtDom = el.parentNode;

        let reg = new RegExp("<.+?>", "g");
        let isChildren = reg.test(el.innerHTML);
        // console.log(paremtDom)
        if (!paremtDom) { return }
        // console.log(paremtDom)
        let _cz = maxW - boxw;
        if (_cz > 0) {
            el.style.position = 'relative';
            if (isChildren) {
                el.style.zIndex = -1;
            }
            let timer = '';
            let start = () => {
                if (timer) {
                    clearInterval(timer)
                }
                let startnum = 0;
                timer = setInterval(() => {
                    // console.log(startnum, maxW, Math.abs(startnum) - maxW > 0);
                    el.style.left = startnum + 'px';
                    if (Math.abs(startnum) - maxW > 0) {
                        el.style.left = boxw + 'px';
                        startnum = boxw;
                    }
                    startnum = startnum - 2;
                }, 83);
            }
            paremtDom.onmouseover = function(e) {
                start()
                el.style.width = maxW * 1 + 2 + 'px';
            }
            paremtDom.onmouseout = () => {
                clearInterval(timer)
                el.style.width = boxw + 'px';
                el.style.left = 0;
            }
        }
    }
    Vue.directive("textscreen", {
        //溢出隐藏 并增加鼠标提示
        // bind: (el, binding, vnode) => {
        //     movetext(el)
        // },
        inserted: (el, binding, vnode) => {
            movetext(el)
        },
        update: (el, binding, vnode) => {
            movetext(el)
        }
    });

    Vue.directive("waves", waves);
    Vue.directive("download", download);
}