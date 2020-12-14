import {isStr} from "@wangct/util/lib/typeUtil";
import {getGlobalConfig} from "./utils";
import {message} from 'antd';

const {fetch} = window;

/**
 * 请求方法
 * @param url
 * @param options
 * @returns {*}
 */
export default function request(url, options = {}) {
  options = formatOptions(options);
  return fetch(url,options)
    .then(checkStatus)
    .then((res) => {
      const {json = true,blob,text} = options;
      if(blob){
        return res.blob();
      }else if(text){
        return res.text();
      }else if(json){
        return res.json().then((data) => {
          const {matchData = true,alertError = true} = options;
          if(!matchData){
            return data;
          }
          if(data.code !== 0){
            if(alertError && isStr(data.message)){
              message.error(data.message)
            }
            throw data.message;
          }
          return data.data;
        });
      }
      return res;
    }).catch(() => {
      throw '请求失败';
    });
}

/**
 * api请求
  * @param url
 * @param options
 */
export function requestApi(url,options = {}){
  if(getGlobalConfig('isDev')){
    return request('/api' + url,options);
  }
  return request(url,options);
}


/**
 * 格式化选项
 * @param options
 * @returns {*}
 */
function formatOptions(options){
  const {body,method = 'post'} = options;
  if(body && !(body instanceof FormData)){
    if(options.formatBody !== false){
      options.body = JSON.stringify(options.body);
    }
    options.headers = {
      ...options.headers,
      'content-type':'application/json'
    }
  }
  options.method = method;
  return options;
}

/**
 * 检测状态
 * @param response
 * @returns {*}
 */
function checkStatus(response) {
  const {status} = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
