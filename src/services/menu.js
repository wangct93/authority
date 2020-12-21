import {requestApi} from "../frame";

/**
 * 菜单查询
 * @author wangchuitong
 */
export function menuSearch(params) {
  return requestApi('/menu/search', {
    body: params,
    loading:true,
  });
}

/**
 * 菜单节点查询
 * @author wangchuitong
 */
export function menuNodeSearch(params) {
  return requestApi('/menu/nodeSearch', {
    body: params,
    loading:true,
  });
}

/**
 * 菜单创建
 * @author wangchuitong
 */
export function menuCreate(params) {
    return requestApi('/menu/create', {
        body: params,
      loading:true,
    });
}


/**
 * 编辑单条数据
 * @author wangchuitong
 */
export function menuUpdate(params) {
    return requestApi(`/menu/update`, {
        body: params,
      loading:true,
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
      loading:true,
    });
}

/**
 * 菜单树
 * @returns {Promise<*>}
 */
export function menuTreeSearch(){
  return requestApi('/menu/menuTree');
}
