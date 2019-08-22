/*
 * name -- common api
 * author -- Harry
 * date -- 2019-03-27
 * version -- 4.2.0
 *  入口vue文件中调用 统计用户习惯
 */

import api from '@/api';

// /user_access_detail 用户访问详情
export let saveUserAccessDetail = (params) => {
    let result = new Promise((resolve, reject) => {
        api('post', '/api/base/user_access_detail', params).then((data) => {
            if (data.status == 200) {
                resolve(data.data);
            } else {
                reject(data.fieldErrors);
            }
        }).catch(err => {
            reject(err);
        });
    })
    return result
}

// 模块到期时间查询 get /license/unit  系统license校验
export let getUnitLicense = (serverId, unitId) => {
    let result = new Promise((resolve, reject) => {
        api('get', '/api/base/license/unit', { unitId, serverId }).then((data) => {
            if (data.status == 200) {
                resolve(data.data);
            } else {
                reject(data.fieldErrors);
            }
        }).catch(err => {
            reject(err);
        });
    })
    return result
}

// GET / unit_config / language / find; 根据单位和模块code查询语言;
export let getUnitCodeConfigLang = (code, unitId) => {
    let result = new Promise((resolve, reject) => {
        api('get', '/api/base/unit_config/language/find', { code, unitId }).then((data) => {
            if (data.status == 200) {
                resolve(data.data);
            } else {
                reject(data.fieldErrors);
            }
        }).catch(err => {
            reject(err);
        });
    })
    return result
}

// 模块中左侧导航栏目
export let getCodeMenuList = (code) => {
    let result = new Promise((resolve, reject) => {
        api('get', '/api/base/resource/user/code/tree', { code }).then((data) => {
            resolve(data.data || []);
        });
    })
    return result
}

// 获得权限
export let getRcCodeList = (code, obj) => {
    let result = new Promise((resolve, reject) => {
        api('get', '/api/base/resource/user/code', { code }).then((data) => {
            if (data && data.code === 'ok') {
                if(obj){
                    Object.keys(obj).forEach((_rc, i) => {
                        if (_.find(data.data, { code: _rc })) {
                            obj[_rc] = true;
                        }
                    })
                }
                resolve(true);
            } else {
                reject('error');
            }
        });
    })
    return result
};