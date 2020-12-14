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
 * 用户登录
 * @author wangchuitong
 */
export function userLogin(params){
  return requestApi('/user/login',{
    body:params,
  });
}

/**
 * 获取当前用户信息
 * @author wangchuitong
 */
export function queryUserInfo(){
  return requestApi('/user/queryUserInfo',{
    alertError:false,
  });
}
