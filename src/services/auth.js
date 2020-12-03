import { onceRequest, request} from "afc-basic-element-browser";
import {getFixedNodeId} from "../utils/util";

/**
 * 权限基础请求
 * @author wangchuitong
 */
export default function requestAuth(url,options: any = {},...args){
  return request('/api/auth' + url,{
    method:'post',
    ...options,
    headers:{
      'afc-login-id':getFixedNodeId(),
      ...options.headers,
    },
  },...args);
}

/**
 * 权限缓存基础请求
 * @author wangchuitong
 */
export function onceRequestAuth(url,options: any = {},...args){
  return onceRequest('/api/auth' + url,{
    method:'post',
    ...options,
    headers:{
      'afc-login-id':getFixedNodeId(),
      ...options.headers,
    },
  },...args);
}
