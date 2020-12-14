
import {toAry,getCache,setCache,callFunc} from "@wangct/util";
import {requestApi} from "../frame";
import {dicFormatter, getDicFormatter} from "../utils/util";

/**
 * 缓存方法结果
 * @param type
 * @param func
 */
export function getFuncCache(type,func){
  let result = getCache(type);
  if(result){
    return result;
  }
  result = callFunc(func);
  setCache(type,result);
  return result;
}

/**
 * 字典请求
 */
export function dicRequest(url,needCache = true){
  const func = () => {
    return requestApi(url);
  };
  if(!needCache){
    return func();
  }
  return getFuncCache(url,func);
}


/**
 * 用户启用标志
 * @author wangchuitong
 */
export function dicUserEnableMark() {
  return dicRequest('/dic/userEnableMark');
}

/**
 * 角色列表
 */
export function dicRoleList(){
  return dicRequest('/dic/roleList').then(getDicFormatter('role_id','role_name'));
}
