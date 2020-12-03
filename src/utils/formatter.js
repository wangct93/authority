import {getFormatter} from "afc-basic-element-browser";

/**
 * 用户名称格式化
 * @author wangchuitong
 */
export function userNameFormatter(v,ov){
  return getFormatter({
      length:10,
  })(v,ov);
}

/**
 * 角色名称格式化
 * @author wangchuitong
 */
export function roleNameFormatter(v,ov){
  return getFormatter({
    length:10,
  })(v,ov);
}
