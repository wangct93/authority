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
 * 查询本节点及子节点
 * @author wangchuitong
 */
export function menuNodeSearch(params) {
    return requestApi('/menu/nodeSearch', {
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
 * 菜单导入
 * @author wangchuitong
 */
export async function menuImport(file) {
    if(!file){
        throw '文件不存在';
    }
    const formData = new FormData();
    formData.append('file',file);
    return requestApi('/menu/import', {
        body: formData,
    });
}
