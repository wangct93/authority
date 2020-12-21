import {requestApi} from "../frame";

/**
 * 查询
 * @author wangchuitong
 */
export function roleSearch(params) {
    return requestApi(`/role/search`, {
        body: params,
      loading:true,
    })
}

/**
 * 增加单条数据
 * @author wangchuitong
 */
export function roleCreate(params) {
    return requestApi(`/role/create`, {
        body: params,
      loading:true,
    });
}

/**
 * 编辑
 * @author wangchuitong
 */
export function roleUpdate(params) {
    return requestApi(`/role/update`, {
        body: params,
      loading:true,
    })
}

/**
 * 删除单条数据
 * @author wangchuitong
 */
export function roleDelete(role_id) {
    return requestApi(`/role/delete`, {
        body: {
          role_id,
        },
      loading:true,
    })
}

/**
 * 根据用户ID获取角色列表
 * @author wangchuitong
 */
export function getRolesByUserId(user_id) {
    return requestApi(`/role/findRolesByUserId`, {
      body:{
        user_id,
      },
    });
}
