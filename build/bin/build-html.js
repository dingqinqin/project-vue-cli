var Components = require("../../plugins.json");
var fs = require("fs");
var render = require("json-templater/string");
var uppercamelcase = require("uppercamelcase");
var path = require("path");
var endOfLine = require("os").EOL;

var OUTPUT_PATH = path.join(__dirname, "../../index.html");

var SCRIPT_TEMPLATE =
  '<script type="text/javascript" src="/common/js/{{name}}.js"></script>';
var STYLE_TEMPLATE = '<link rel="stylesheet" href="/common/css/{{name}}.css"/>';

var MAIN_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta name="renderer" content="webkit|ie-comp|ie-stand"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta charset="utf-8">
    <title></title>
    {{icon}}
    {{style}}
    {{config}}
</head>

<body>
    <div id="app"></div>
    <div id="suser_angent_box">
        <div>
            <p>请使用IE 9.0及以上版本运行！推荐使用Chrome浏览器,
                <a href="https://www.baidu.com/link?url=kl85CNxIUaz2BTwYkr69U1fhq4OtmLFs3hw5LE_WywlQR6jmtxbGJ9MAQXMG06vj9QwYUITH1gDEYf-vEZJbHdzV83XFViEjB4t9I7wZZKW&wd=&eqid=a715fd21000235a900000005599a5811">点击下载</a>
            </p>
        </div>
    </div>
    {{script}}
</body>

</html>
`;

var ComponentNames = Object.keys(Components);

var iconTemplate = [];
var styleTemplate = [];
var configTemplate = [];
var scriptTemplate = [];

ComponentNames.forEach(name => {
  var list = Object.keys(Components[name]);
  if (name == "icon") {
    list.forEach(key => {
      if (Components[name][key]) {
        iconTemplate.push(render(STYLE_TEMPLATE, { name: key }));
      }
    });
  }
  if (name == "style") {
    list.forEach(key => {
      if (Components[name][key]) {
        styleTemplate.push(render(STYLE_TEMPLATE, { name: key }));
      }
    });
  }
  if (name == "config") {
    list.forEach(key => {
      if (Components[name][key]) {
        configTemplate.push(render(SCRIPT_TEMPLATE, { name: key }));
      }
    });
  }
  if (name == "js") {
    list.forEach(key => {
      if (Components[name][key]) {
        scriptTemplate.push(render(SCRIPT_TEMPLATE, { name: key }));
      }
    });
  }
});

var template = render(MAIN_TEMPLATE, {
  icon: iconTemplate.join(endOfLine + "    "),
  style: styleTemplate.join(endOfLine + "    "),
  config: configTemplate.join(endOfLine + "    "),
  script: scriptTemplate.join(endOfLine + "    ")
});
fs.writeFileSync(OUTPUT_PATH, template);
console.log("[build html] DONE:", OUTPUT_PATH);
