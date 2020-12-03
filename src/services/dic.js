
import {getFixedNodeId} from '../utils/util';
import { getFormatterByFields, onceRequest, promiseCache, request, strEqual } from "afc-basic-element-browser";
import requestAuth, {onceRequestAuth} from "./auth";
import {toAry} from "afc-browser-util";
import * as roleApi from "./role";
export function t() {

}



/**
 * 登录点列表
 * @author wangchuitong
 */
export function loginNodeDic() {
  return promiseCache('loginNodeDic' + getFixedNodeId(),() => {
    return requestAuth('/landing/dic').then(getFormatterByFields('node_id','node_name'));
  });
}

/**
 * 登录点类型
 * @author wangchuitong
 */
export function loginNodeType() {
  return onceRequestAuth('/landing/typeDic').then((data) => {
    return Object.keys(data).map((key) => {
      return {
        value:key,
        text:data[key],
      };
    });
  });
}

/**
 * 是否配置IP
 * @author wangchuitong
 */
export function loginNodeIfValid() {
  return [
    {
      text: '是',
      value: '0',
    },
    {
      text: '否',
      value: '1',
    },
  ]
}

/**
 * 用户类型
 * @author wangchuitong
 */
export function userType() {
  return onceRequestAuth('/user/getUserType').then(getFormatterByFields('user_type','user_type_name'));
  // return [
  //   {
  //     text: '超级管理员',
  //     value: '1',
  //   },
  //   {
  //     text: '系统管理员',
  //     value: '2',
  //   },
  //   {
  //     text: '普通用户',
  //     value: '3',
  //   },
  // ]
}
/**
 * 获取完整的菜单树
 * @author douxiaochen
 */
export function searchMenuTree() {
  return requestAuth(`/menu/menuTree`, {
    method: 'post',
    // body: params
  }).then(v => {
    return v.sub_nodes;
  })
}
/**
 * 获取菜单节点类型
 * @author douxiaochen
 */
export async function getMenuNodeTypeList() {
  return requestAuth('/menu/nodeType').then((data) => {
      const list = [];
      data.map(item=>{
        list.push({
                  text: item.value,
              value: item.key,

        })
      })
      return list;
  });
}

export async function transTypeList() {
  return [
    {
      value: '1',
      text: '一票通交易',
    },
    {
      value: '2',
      text: '一卡通交易',
    },
  ];
}

/**
 * 组织机构树
 * @author wangchuitong
 */
export async function deptDicTree() {
  return requestAuth('/dept/getDeptTree').then((v) => {
    return toAry(v.sub_nodes);
  });
}

/**
 * 用户启用标志
 * @author wangchuitong
 */
export function userEnableMark() {
  return [
    {
      text: '启用',
      value: '0',
    },
    {
      text: '禁用',
      value: '1',
    },
  ]
}
/**
 * 获取菜单类型
 * @author douxiaochen
 */
export async function getMenuTypeList() {
  return requestAuth('/menu/menuType').then((data) => {
      const list = [];
      data.map(item=>{
        list.push({
                  text: item.value,
              value: item.key,

        })
      })
      return list;
  });
}
/**
 * 获取完整的组织机构树
 * @author douxiaochen
 */
export function searchOrganizeTree() {
  return requestAuth(`/dept/dicTree`, {
    method: 'post',
    // body: params
  }).then(v => {
    return v.sub_nodes;
  })
}
