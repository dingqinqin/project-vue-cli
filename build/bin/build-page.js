const Components = require("../../pageModule.json");
const fs = require("fs-extra");
const render = require("json-templater/string");
const uppercamelcase = require("uppercamelcase");
const path = require("path");
const endOfLine = require("os").EOL;
const chalk = require("chalk");
const error = chalk.bold.red;
const success = chalk.bold.green;
const info = chalk.bold.blue;
const danger = chalk.bold.red;
const ROOT_NAME = Components.page;

// ----------配置路由文件文件名
fs.writeFileSync(
  path.join(__dirname, "../../src/router/index.js"),
  render(require("./router-index.js"), {
    page: ROOT_NAME
  })
);
/* build dir ... 创建文件夹 */
// page
var ROOT_DIR_PATH = path.join(__dirname, "../../src/" + ROOT_NAME);
if (!fs.existsSync(ROOT_DIR_PATH)) {
  fs.mkdirSync(ROOT_DIR_PATH);
}
// page/css
var ROOT_CSS_DIR_PATH = path.join(__dirname, "../../src/" + ROOT_NAME + "/css");
if (!fs.existsSync(ROOT_CSS_DIR_PATH)) {
  fs.mkdirSync(ROOT_CSS_DIR_PATH);
  fs.writeFileSync(
    path.join(__dirname, "../../src/" + ROOT_NAME + "/css/index.css"),
    "/* ---- style ----*/"
  );
}
// page/ultis
var ROOT_ULTILS_DIR_PATH = path.join(
  __dirname,
  "../../src/" + ROOT_NAME + "/ultis"
);
if (!fs.existsSync(ROOT_ULTILS_DIR_PATH)) {
  fs.mkdirSync(ROOT_ULTILS_DIR_PATH);
  fs.writeFileSync(
    path.join(__dirname, "../../src/" + ROOT_NAME + "/ultis/index.js"),
    "/* ---- methods ----*/"
  );
}
// page/components
var ROOT_COMPONENTS_DIR_PATH = path.join(
  __dirname,
  "../../src/" + ROOT_NAME + "/components"
);
if (!fs.existsSync(ROOT_COMPONENTS_DIR_PATH)) {
  fs.mkdirSync(ROOT_COMPONENTS_DIR_PATH);
}
// page/view
var ROOT_VIEW_DIR_PATH = path.join(
  __dirname,
  "../../src/" + ROOT_NAME + "/view"
);
if (!fs.existsSync(ROOT_VIEW_DIR_PATH)) {
  fs.mkdirSync(ROOT_VIEW_DIR_PATH);
}

var pathPreFixed = "";
var pathPostFixed = "";
if (Components.pre) {
  if (Components.post) {
    var ROOT_VIEW_PRE_DIR_PATH = path.join(
      __dirname,
      "../../src/" + ROOT_NAME + "/view/pre"
    );
    if (!fs.existsSync(ROOT_VIEW_PRE_DIR_PATH)) {
      fs.mkdirSync(ROOT_VIEW_PRE_DIR_PATH);
    }
    pathPreFixed = "/view/pre/";
  } else {
    pathPreFixed = "/view/";
  }
  fs.writeFileSync(
    path.join(
      __dirname,
      "../../src/" + ROOT_NAME + pathPreFixed + "/index.vue"
    ),
    render(require("./tepl.js"), {
      text: "Welcome!"
    })
  );
}

if (Components.post) {
  if (Components.pre) {
    var ROOT_VIEW_POST_DIR_PATH = path.join(
      __dirname,
      "../../src/" + ROOT_NAME + "/view/post"
    );
    if (!fs.existsSync(ROOT_VIEW_POST_DIR_PATH)) {
      fs.mkdirSync(ROOT_VIEW_POST_DIR_PATH);
    }
    pathPostFixed = "/view/post/";
  } else {
    pathPostFixed = "/view/";
  }
  Components.config.navList.forEach(row => {
    row.menuRoute = `/${Components.name}/${Components.postName}/${row.dir}`;
  });
  fs.writeFileSync(
    path.join(
      __dirname,
      "../../src/" + ROOT_NAME + pathPostFixed + "index.vue"
    ),
    render(require("./tepl-home-vue.js"), {
      name: Components.name,
      page: Components.page,
      navList: JSON.stringify(Components.config.navList)
    })
  );
}

/* bulid ... 创建文件前台模板 */
if (Components.pre) {
}
/* bulid ... 创建文件后台模板 */
// page/index.vue
var OUTPUT_IDEX_PATH = path.join(
  __dirname,
  "../../src/" + ROOT_NAME + "/index.vue"
);
fs.writeFileSync(
  OUTPUT_IDEX_PATH,
  render(require("./tepl-index-vue.js"), {
    name: Components.name,
    page: Components.page,
    navList: JSON.stringify(Components.config.navList)
  })
);
console.log(success("[ build index.vue ] DONE:", OUTPUT_IDEX_PATH));

// router.js

// -------------------特殊处理 根据模块生成文件 路由
// ROOT_NAME + pathPostFixed
var template_router = `{
  path: "{{path}}",
  name: "{{name}}",
  component: _import("{{dir}}")
}
`;

var post_router_template = `{
  path: "{{path}}",
  name: "",
  component: _import("{{dir}}"),
  children: [
    {
      path: "hello",
      name: "hello",
      component: _import("commonPage/hello/Hello")
    },
    {{routers}},
    {
      path: "/",
      redirect: "/{{name}}/{{path}}/hello"
    }
  ]
}
`;
var redirect_template = `{
  path: "/",
  redirect: "/{{name}}/{{path}}"
}
`;
var routerList = [];
Components.config.navList.forEach(row => {
  var _path_ = path.join(
    __dirname,
    "../../src/" + ROOT_NAME + pathPostFixed + row.dir
  );
  if (!fs.existsSync(_path_)) {
    fs.mkdirSync(_path_);
  }
  fs.writeFileSync(
    _path_ + "/index.vue",
    render(require("./tepl-vue.js"), {
      text: row.name
    })
  );
  row.menuRoute = '';
  routerList.push(
    render(template_router, {
      path: row.dir,
      name: row.name,
      dir: ROOT_NAME + pathPostFixed + row.dir + "/index"
    })
  );
});
var template_routers = [];
if (Components.pre) {
  template_routers.push(
    render(template_router, {
      path: Components.preName,
      name: Components.preName,
      dir: ROOT_NAME + pathPreFixed + "index"
    })
  );
}
if (Components.post) {
  template_routers.push(
    render(post_router_template, {
      path: Components.postName,
      name: Components.name,
      dir: ROOT_NAME + pathPostFixed + "index",
      routers: routerList.join("," + endOfLine)
    })
  );
}
var redirect_template_path = "";
if (Components.pre) {
  redirect_template_path = `${Components.preName}`;
}
if (Components.post) {
  if (Components.pre) {
    redirect_template_path = `${Components.preName}`;
  } else {
    redirect_template_path = `${Components.postName}`;
  }
}
template_routers.push(
  render(redirect_template, {
    name: Components.name,
    path: redirect_template_path
  })
);
var OUTPUT_ROUTER_PATH = path.join(
  __dirname,
  "../../src/" + ROOT_NAME + "/router.js"
);
fs.writeFileSync(
  OUTPUT_ROUTER_PATH,
  render(require("./tepl-router.js"), {
    name: Components.name,
    page: ROOT_NAME,
    list: template_routers.join("," + endOfLine)
  })
);
console.log(success("[ build router.js ] DONE:", OUTPUT_ROUTER_PATH));

// request.js
var OUTPUT_REQUEST_PATH = path.join(
  __dirname,
  "../../src/" + ROOT_NAME + "/request.js"
);
fs.writeFileSync(
  OUTPUT_REQUEST_PATH,
  render(require("./tepl-request.js"), {
    name: Components.name
  })
);
console.log(success("[ build request.js ] DONE:", OUTPUT_REQUEST_PATH));

// version.js
var OUTPUT_VERSION_PATH = path.join(
  __dirname,
  "../../src/" + ROOT_NAME + "/version.js"
);
fs.writeFileSync(
  OUTPUT_VERSION_PATH,
  "export default " + JSON.stringify(Components.version)
);
console.log(success("[ build version.js ] DONE:", OUTPUT_VERSION_PATH));
