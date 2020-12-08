import {requestApi} from "../frame";

/**
 * 查询
 * @author wangchuitong
 */
export function userSearch(params){
  return requestApi('/user/search',{
    body:params,
  });
}

/**
 * 新增
 * @author wangchuitong
 */
export function userCreate(params){
  return requestApi('/user/create',{
    body:params,
  });
}

/**
 * 编辑
 * @author wangchuitong
 */
export function userUpdate(params){
  return requestApi('/user/update',{
    body:params,
  });
}

/**
 * 获取用户详情
 * @author wangchuitong
 */
export function userGetInfo(user_id){
  return requestApi('/user/getInfo',{
    body:{
      user_id,
    }
  });
}

/**
 * 删除
 * @author wangchuitong
 */
export function userDelete(user_id){
  return requestApi('/user/delete',{
    body:{
      user_id,
    },
  });
}

/**
 * 导出
 * @author wangchuitong
 */
export function userExport(){
  return requestApi('/user/exportUser');
}

/**
 * 导入
 * @author wangchuitong
 */
export function userImport(params){
  return requestApi('/user/import',{
    body:params,
  });
}

/**
 * 全量导入
 * @author wangchuitong
 */
export function userImportAll(params){
  return requestApi('/user/importAllUser',{
    body:params,
  });
}
