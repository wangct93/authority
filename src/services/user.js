import requestAuth from "./auth";
import exportUser from "../routes/User/export";

/**
 * 用户接口
 * @author wangchuitong
 */
export function requestUser(url,options = {},...args){
  return requestAuth('/user' + url,{
    method:'post',
    ...options,
  });
}

/**
 * post请求
 * @author wangchuitong
 */
function post(url,params = {},...args){
  return requestUser(url,{
    body:params,
  },...args);
}

/**
 * 查询
 * @author wangchuitong
 */
export function doSearch(params){
  return post('/query',params);
}

/**
 * 新增
 * @author wangchuitong
 */
export function doCreate(params){
  return post('/create',params);
}

/**
 * 编辑
 * @author wangchuitong
 */
export function doEdit(params){
  return post('/update',params);
}

/**
 * 重置密码
 * @author wangchuitong
 */
export function doResetPsw(params){
  return post('/resetPwd',params);
}

/**
 * 获取用户详情
 * @author wangchuitong
 */
export function doGetInfo(userId){
  return requestUser('/findById?user_id=' + userId);
}

/**
 * 删除
 * @author wangchuitong
 */
export function doDelete(userId){
  return requestUser('/delete?user_id=' + userId);
}

/**
 * 导出
 * @author wangchuitong
 */
export function doExport(){
  return post('/exportUser').then((data) => exportUser(data));
}

/**
 * 导入
 * @author wangchuitong
 */
export function doImport(params){
  return post('/importUser',params);
}

/**
 * 全量导入
 * @author wangchuitong
 */
export function doImportAll(params){
  return post('/importAllUser',params);
}
