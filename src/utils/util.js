
import {toAry,aryToObject} from '@wangct/util';
import {queryUserInfo} from "../services/user";
import {updateModel} from "../frame";
import {aryToObj} from "@wangct/util/lib/arrayUtil";

/**
 * 字典格式化
 * @param data
 * @param valueField
 * @param textField
 * @returns {*}
 */
export function dicFormatter(data,valueField,textField){
  return toAry(data).map((item) => ({
    ...item,
    text:item[textField],
    value:item[valueField],
  }));
}

/**
 * 获取字典格式化
  * @param valueField
 * @param textField
 * @returns {function(*=): *}
 */
export function getDicFormatter(valueField,textField){
  return (data) => {
    return dicFormatter(data,valueField,textField);
  }
}

/**
 * 更新用户信息
 * @returns {Promise<void>}
 */
export async function updateUserInfo(){
  const userInfo = await queryUserInfo();
  const authMap = aryToObj(toAry(userInfo.menu_list),(item) => item,() => true);
  updateModel('user',{
    userInfo,
    authMap,
  });
}
