module.exports = `import api from '@/api';
export let request = (method, url, params, serializer = true) => {
    return api(method, url, params, serializer, {
        headers: {
            'Sy-Headers': 'device=pc;app={{name}}'
        }
    })
};

export let getLoginConfig = () => {
    let result = new Promise((resolve, reject) => {
        request('get', '/api/uaa/oauth/login/config').then(((data) => {
            if (data.status == 200) {
                resolve(data.data)
            } else {
                reject(data);
            }

        }))
    })
    return result
}

// GET / unit_config / language / find; 根据单位和模块code查询语言;
export let getUnitCodeConfigLang = (code, unitId) => {
    let result = new Promise((resolve, reject) => {
        request('get', '/api/base/unit_config/language/find', { code, unitId }).then((data) => {
            if(data.status == 200){
                resolve(data.data);
            }else{
                reject(data.fieldErrors);
            }
        }).catch(err=>{
            reject(err);
        });
    })
    return result
}
// 模块到期时间查询 get /license/unit  系统license校验
export let getUnitLicense = (serverId, unitId) => {
    let result = new Promise((resolve, reject) => {
        request('get', '/api/base/license/unit', { unitId, serverId }).then((data) => {
            if(data.status == 200){
                resolve(data.data);
            }else{
                reject(data.fieldErrors);
            }
        }).catch(err=>{
            reject(err);
        });
    })
    return result
}
// 模块中左侧导航栏目
export let getCodeMenuList = (code) => {
    let result = new Promise((resolve, reject) => {
        request('get', '/api/base/resource/user/code/tree', { code }).then((data) => {
            resolve(data.data || []);
        });
    })
    return result
}

// 获得权限
export let getRcCodeList = (code, obj) => {
    let result = new Promise((resolve, reject) => {
        request('get', '/api/base/resource/user/code', { code }).then((data) => {
            if (data && data.code === 'ok') {
                Object.keys(obj).forEach((_rc, i) => {
                    if (_.find(data.data, { code: _rc })) {
                        obj[_rc] = true;
                    }
                })
                resolve(true);
            } else {
                reject('error');
            }
        });
    })
    return result
};
`;
