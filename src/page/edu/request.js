import api from '@/api';

// 根据项目地址，如果根路由都为项目标识，则可以直接使用 api，
// 如果项目存在两个或者两个以上的根路由就要使用下面配置进行封装，用于日志的精确记录
// export let request = (method, url, params, serializer = true) => {
//     return api(method, url, params, serializer, {
//         headers: {
//             'Sy-Headers': 'device=pc;app=edu'
//         }
//     })
// };
