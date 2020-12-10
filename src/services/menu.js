import {requestApi} from "../frame";

/**
 * 菜单查询
 * @author wangchuitong
 */
export function menuSearch(params) {
  return requestApi('/menu/search', {
    body: params
  });
}

/**
 * 菜单创建
 * @author wangchuitong
 */
export function menuCreate(params) {
    return requestApi('/menu/create', {
        body: params
    });
}


/**
 * 编辑单条数据
 * @author wangchuitong
 */
export function menuUpdate(params) {
    return requestApi(`/menu/update`, {
        body: params
    })
}

/**
 * 删除单条数据
 * @returns {*|*}
 */
export function menuDelete(menu_id) {
    return requestApi('/menu/delete',{
      body:{
        menu_id,
      },
    });
}

/**
 * 菜单树
 * @returns {Promise<*>}
 */
export function menuTreeSearch(){
  return requestApi('/menu/menuTree')
}
