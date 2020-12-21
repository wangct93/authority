import {requestApi} from "../frame";

/**
 * 部门查询
 * @author wangchuitong
 */
export function deptSearch(params) {
  return requestApi('/dept/search', {
    body: params,
    loading:true,
  });
}

/**
 * 部门创建
 * @author wangchuitong
 */
export function deptCreate(params) {
    return requestApi('/dept/create', {
        body: params,
      loading:true,
    });
}


/**
 * 编辑单条数据
 * @author wangchuitong
 */
export function deptUpdate(params) {
    return requestApi(`/dept/update`, {
        body: params,
      loading:true,
    })
}

/**
 * 删除单条数据
 * @returns {*|*}
 */
export function deptDelete(dept_id) {
    return requestApi('/dept/delete',{
      body:{
        dept_id,
      },
      loading:true,
    });
}

/**
 * 部门树
 * @returns {Promise<*>}
 */
export function deptTreeSearch(){
  return requestApi('/dept/deptTree')
}
