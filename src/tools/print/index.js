/* @Print.js
    options.style
    date: 2019-07-31
    version: 2.0
    new:
        1. Print 方法参数更新 支持 #xxx dom对象 和 class类名
        2. class类名传入 不带.，直接传入类名
        3. options参数扩展 控制分页打印(在class类名传入生效) paging 默认值为false
 */
var Print = function(dom, options) {
    if (!(this instanceof Print)) return new Print(dom, options);
    this.options = this.extend({
        'noPrint': '.no-print'
    }, options);
    if ((typeof dom) === "string") {
        this.domId = dom;
        this.dom = document.querySelector(dom);
    } else {
        this.domId = '';
        this.dom = dom;
    }
    this.init(options);
};

function addWrapper(htmlData, params) {
    let bodyStyle = 'font-family:' + params.font + ' !important; font-size: ' + params.font_size + ' !important; width:100%;'
    return '<div style="' + bodyStyle + '">' + htmlData + '</div>'
}

Print.prototype = {
    init: function(options) {
        let params = {
            printable: null,
            fallbackPrintable: null,
            type: "pdf",
            header: null,
            headerStyle: "font-weight: 300;",
            maxWidth: 800,
            font: "TimesNewRoman",
            font_size: "12pt",
            honorMarginPadding: true,
            honorColor: false,
            properties: null,
            gridHeaderStyle: "font-weight: bold;",
            gridStyle: "border: 1px solid lightgray; margin-bottom: -1px;",
            showModal: false,
            onLoadingStart: function() {},
            onLoadingEnd: function() {},
            modalMessage: "Retrieving Document...",
            frameId: "printJS",
            htmlData: "",
            htmlStyle: "",
            noPrint: "",
            paging: false,
            documentTitle: "Document",
            ...options
        };
        var content = this.getStyle() + this.getHtml(params);
        this.writeIframe(content);
    },
    extend: function(obj, obj2) {
        for (var k in obj2) {
            obj[k] = obj2[k];
        }
        return obj;
    },

    getStyle: function() {
        var str = '',
            styles = document.querySelectorAll("style,link");
        for (var i = 0; i < styles.length; i++) {
            str += styles[i].innerHTML;
        }
        str =
            "<style>" +
            str +
            (this.options.noPrint ? this.options.noPrint : ".no-print") +
            "{display:none;} </style>";

        return str;
    },

    getHtml: function(params) {
        if(this.domId){
            if(/^#/g.test(this.domId)){
                return this.dom ? this.dom.innerHTML : 'No Data!';
            }else{
                let dom = document.getElementsByClassName(this.domId);
                let htmls = [];
                for(let i = 0; i<dom.length; i++){
                    htmls.push(dom[i].innerHTML);
                }
                if(params.paging){
                    return htmls.join(`<div style="page-break-before:always"></div>`)
                }else{
                    return htmls.join(``)
                }
            }
        }else{
            return this.dom.innerHTML;
        }
    },

    writeIframe: function(content) {
        var ifrm = document.getElementById('myIframe');
        if (ifrm) {
            document.body.removeChild(ifrm);
        }
        var w,
            doc,
            iframe = document.createElement("iframe"),
            f = document.body.appendChild(iframe);
        iframe.id = "myIframe";
        iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";

        w = f.contentWindow || f.contentDocument;
        doc = f.contentDocument || f.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();
        this.toPrint(w);

        // setTimeout(function() {
        //     document.body.removeChild(iframe);
        // }, 500);
    },

    toPrint: function(frameWindow) {
        try {
            setTimeout(function() {
                frameWindow.focus();
                try {
                    if (!frameWindow.document.execCommand("print", false, null)) {
                        frameWindow.print();
                    }
                } catch (e) {
                    frameWindow.print();
                }
                frameWindow.close();
            }, 10);
        } catch (err) {
            console.log("err", err);
        }
    }
};
export default Print