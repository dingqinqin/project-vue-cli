const fs = require('fs-extra');
var path = require('path');
const log = console.log;
const render = require("json-templater/string");
console.log('----- Reset config start -----')
// router ----
function getFileStr(imports, routers) {
    if (!routers || routers.length == 0) {
        return 'export default []';
    }
    return imports.join('\n') + '\n\nexport default [\n\t...' + routers.join(',\n\t...') + '\n]';
}

let _p = path.join(__dirname, '../src/page/'),
    _import = [],
    _router = [],
    state = [],
    mutations = [],
    actions = [],
    vuex = [];

if (fs.existsSync(_p)) {
    fs.readdirSync(_p).forEach((el, i) => {
        let _path = ('../src/page/' + el + '/router.js');
        if (el != '.svn' && fs.existsSync(path.join(__dirname, _path))) {
            _router.push(el);
            _import.push('import ' + el + ' from "' + _path.replace('/src/', '/') + '";');
            if(fs.existsSync(path.join(__dirname, `../src/page/${el}/vuex/state.js`))){
                vuex.push(`import ${el}State from "PAGE/${el}/vuex/state.js"`);
                state.push(`...${el}State`);
            }
            if(fs.existsSync(path.join(__dirname, `../src/page/${el}/vuex/mutations.js`))){
                vuex.push(`import ${el}Mutations from "PAGE/${el}/vuex/mutations.js"`);
                mutations.push(`...${el}Mutations`);
            }
            if(fs.existsSync(path.join(__dirname, `../src/page/${el}/vuex/actions.js`))){
                vuex.push(`import ${el}Actions from "PAGE/${el}/vuex/actions.js"`);
                actions.push(`...${el}Actions`);
            }
        }
    });
}
console.log('ROUTER:')
console.log(getFileStr(_import, _router))
fs.writeFileSync(path.join(__dirname, '../src/router/routers.js'), getFileStr(_import, _router));
log('> router-success', path.join(__dirname, '../src/router/routers.js'));
// ---- vuex
let temeplate = `import actions from './actions.js';
import state from './state.js';
import mutations from './mutations';
// 项目内vuex配置
{{import}}
export default {
    state: {...state,{{state}}},
    mutations: {...mutations,{{mutations}}},
    actions: {...actions,{{actions}}}
};`;

let result = render(temeplate, {
    import: vuex.join('\n'),
    state: state.join(','),
    mutations: mutations.join(','),
    actions: actions.join(',')
})
console.log('VUEX:')
console.log(result)
fs.writeFileSync(path.join(__dirname, '../src/vuex/store.js'), result);
log('> vuex-success', path.join(__dirname, '../src/vuex/store.js'));

console.log('----- Reset config end -----')