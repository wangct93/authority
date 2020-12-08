
import { NodeType } from "./options";
import { toStr } from "@wangct/util";
import { getGlobalState ,setDicApi} from "afc-basic-element-browser";
import {toAry,aryToObject} from '@wangct/util';
import * as dicApi from '../db/dic';

initConfig();

/**
 * 获取acc编号
 */
export function getFixedAccId() {
  return getOperationInfo().acc_id;
}

/**
 * 获取当前线路
 */
export function getFixedLineId() {
  return getOperationInfo().line_id;
}

/**
 * 获取当前车站
 */
export function getFixedStationId() {
  return getOperationInfo().station_id;
}

/**
 * 获取当前运营点
 */
export function getFixedNodeId() {
  return getOperationInfo().node_id;
}

/**
 * 判断是否为指定类型的节点
 */
export function checkNodeType(type) {
  type = toStr(type).toLocaleLowerCase();
  const mapData = {
    acc: getFixedAccId,
    lc: getFixedLineId,
    sc: getFixedStationId,
    [NodeType.ACC]: getFixedAccId,
    [NodeType.LC]: getFixedLineId,
    [NodeType.SC]: getFixedStationId,
  };
  const typeFunc = mapData[type];
  const typeId = typeFunc && typeFunc();
  return typeId === getFixedNodeId();
}

/**
 * 获取运营点信息
 */
export function getOperationInfo() {
  return getGlobalState().operation || {
    node_id:1,
  };
}

/**
 * 将树形结构数据展开为扁平化数组
 * @author douxiaochen
 */
export function generateMenuTreeToArray(tree, arr) {
  tree.forEach((item) => {
    arr.push({...item});
    if (item.sub_nodes && item.sub_nodes.length !== 0) {
      generateMenuTreeToArray(item.sub_nodes, arr);
    }
  });
  return arr;
}

/**
 * 根据当前菜单的菜单id找出下级菜单的菜单类型
 * @author douxiaochen
 */
export function findChildMenuTypeByMenuId(tree, id) {
  let childMenuType = null;
  generateMenuTreeToArray(tree, []).forEach((item) => {
    if (item.parent_id === id) {
      childMenuType = item.menu_type;
    }
  });
  return childMenuType;
}

/**
 * 根据当前菜单的菜单名称找出menu_id
 * @author douxiaochen
 */
export function findMenuIdByMenuName(tree, name) {
  let menuId = null;
  generateMenuTreeToArray(tree, []).forEach((item) => {
    // if (item.name.indexOf(name) >-1) {
    if (item.name === name) {
      menuId = item.menu_id;
    }
  });
  return menuId;
}

/**
 * 将树形结构数据展开为扁平化数组
 * @author douxiaochen
 */
export function generateOrganizeTreeToArray(tree, arr) {
  tree.forEach((item) => {
    arr.push({...item});
    if (item.sub_nodes && item.sub_nodes.length !== 0) {
      generateOrganizeTreeToArray(item.sub_nodes, arr);
    }
  });
  return arr;
}

/**
 * 过滤菜单id父节点
 * @author douxiaochen
 */
export function getSelectedKey(treeData,list){
  const getFlatData = (data) => {
    let extData = {};
    toAry(data).forEach((node) => {
      extData = {
        ...extData,
        [node.menu_id]:node.sub_nodes,
        ...getFlatData(node.sub_nodes),
      };
    });
    return extData;
  };
  const flatData = getFlatData(treeData);
  const listFlat = aryToObject(list,(item) => item,() => true);

  // 缓存，避免重复判断
  const cache = {};

  // 判断id是否选中
  const isSelected = (nodeId) => {
    if(cache[nodeId] !== undefined){
      return cache[nodeId];
    }
    const children = flatData[nodeId];
    const selected = children && children.length ? children.every((node) => isSelected(node.menu_id)) : listFlat[nodeId] || false;
    cache[nodeId] = selected;
    return selected;
  };
  return list.filter((nodeId) => isSelected(nodeId));
}

function initConfig(){
  setDicApi(dicApi);
}
