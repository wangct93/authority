import { request as requestFunc ,getSessionUser} from 'afc-basic-element-browser';
import requestAuth from "./auth";

export const APIhost = '/api';
export function request(url, ...args) {
    return requestFunc(APIhost + url, ...args);
}

export function formatTable(data = {}) {
    //@ts-ignore
    const { total = 0 } = data;
    return {
        ...data,
        total_count: total
    }
}
//查询
export function search(params) {
    return requestAuth(`/role/query`, {
        method: 'post',
        body: params
    })
}

//增加单条数据
export function create(params) {
    return requestAuth(`/role/create`, {
        method: 'post',
        body: {
            menu_list:params.menu_list,
          ...params,
        }
    })
}

//根据角色编号查询单条数据
export function getById(params) {
    return requestAuth(`/role/findById?role_id=${params.role_id}`, {
        method: 'post',
        // body: params
    })
}

//编辑单条数据
export function update(params) {
    return requestAuth(`/role/update`, {
        method: 'post',
        body: params
    })
}

//删除单条数据
export function deleteItem(params) {
    return requestAuth(`/role/delete?role_id=${params.role_id}`, {
        method: 'post',
        // body: params
    })
}

/**
 * 根据用户ID获取角色列表
 * @author wangchuitong
 */
export function doGetRolesByUserId() {
    return requestAuth(`/role/findRolesByUserId?user_id=` + getSessionUser().userId, {
        method: 'post',
    });
}
