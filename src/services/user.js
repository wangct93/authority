import {requestApi} from "../frame";

/**
 * 查询
 * @author wangchuitong
 */
export function userSearch(params){
  return requestApi('/user/search',{
    body:params,
    loading:true,
  });
}

/**
 * 新增
 * @author wangchuitong
 */
export function userCreate(params){
  return requestApi('/user/create',{
    body:params,
    loading:true,
  });
}

/**
 * 编辑
 * @author wangchuitong
 */
export function userUpdate(params){
  return requestApi('/user/update',{
    body:params,
    loading:true,
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
    loading:true,
  });
}

/**
 * 用户登录
 * @author wangchuitong
 */
export function userLogin(params){
  return requestApi('/user/login',{
    body:params,
    loading:true,
  });
}

/**
 * 用户登出
 * @author wangchuitong
 */
export function userLogout(){
  return requestApi('/user/logout',{
    loading:true,
  });
}

/**
 * 获取当前用户信息
 * @author wangchuitong
 */
export function queryUserInfo(){
  return requestApi('/user/queryUserInfo',{
    alertError:false,
    loading:true,
  });
}
