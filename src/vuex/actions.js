import { getUnitCodeConfigLang } from "@/service";

var actions = {
    "getLanguages": function(store, param) {
        if (process.env.NODE_ENV == 'production') {
            getUnitCodeConfigLang(param.code, param.unitId).then(res => {
                let arr = [];
                res.forEach((_a) => {
                    arr.push({
                        value: _a.value,
                        name: _a.name
                    })
                })
                store.commit('changeLangList', arr);
            }).catch(err => {
                store.commit('changeLangList', []);
            })
        } else {
            store.commit('changeLangList', [{ value: 'zh-CN', name: '中文' }, { value: 'en', name: 'English' }]);
        }
    }
}
export default actions