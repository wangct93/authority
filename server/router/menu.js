const express = require('express');
const {sendRes} = require("../@wangct/node-util/express");
const {toAry} = require("@wangct/util/lib/arrayUtil");
const {deleteMenu} = require("../db/menu");
const {updateMenu} = require("../db/menu");
const {createMenu} = require("../db/menu");
const {queryMenuList} = require("../db/menu");
const router = express.Router();

module.exports = router;

module.exports = {
  search,
  create,
  update,
  delete:deleteFunc,
  menuTree,
  nodeSearch,
};

/**
 * 查询
 * @param req
 * @param res
 */
async function search(req,res){
  const totalPro = await queryMenuList({
    ...req.body,
    page_size:0,
  }).then((data) => data.length);
  const listPro = await queryMenuList(req.body);
  const [total,list] = await Promise.all([totalPro,listPro]);
  return {
    total,
    list,
  };
}

/**
 * 节点查询
 * @param req
 * @returns {Promise<void>}
 */
async function nodeSearch(req){
  const menus = await queryMenuList({
    ...req.body,
    page_size:0,
  });
  const target = menus.find((menu) => menu.menu_id === req.body.parent);
  if(!target){
    return {
      total:0,
      list:[],
    };
  }
  const temp = {};
  menus.forEach((menu) => {
    const parent = menu.parent || 'root';
    const list = temp[parent] || [];
    list.push(menu);
    temp[parent] = list;
  });

  function getTreeNodeList(parent,result = []){
    toAry(temp[parent]).map((item) => {
      result.push(item);
      getTreeNodeList(item.menu_id,result);
    });
    return result;
  }
  const {page_num,page_size} = req.body;
  const totalList = getTreeNodeList(target.menu_id,[target]);
  return {
    total:totalList.length,
    list:totalList.slice((page_num - 1) * page_size,page_num * page_size),
  };
}

/**
 * 创建
 * @param req
 * @param res
 */
async function create(req,res){
  return createMenu(req.body);
}

/**
 * 更新
 * @param req
 * @param res
 */
async function update(req,res){
  return updateMenu(req.body);
}

/**
 * 删除
 * @param req
 * @param res
 */
async function deleteFunc(req,res){
  return deleteMenu(req.body.menu_id);
}

/**
 * 菜单树节点
 * @param req
 * @param res
 */
async function menuTree(req,res){
  const menus = await queryMenuList();
  const temp = {};
  menus.forEach((menu) => {
    const parent = menu.parent || 'root';
    const list = temp[parent] || [];
    list.push(menu);
    temp[parent] = list;
  });

  function getTreeNodeList(parent){
    if(!temp[parent]){
      return null;
    }
    return toAry(temp[parent]).map((item) => {
      return {
        ...item,
        children:getTreeNodeList(item.menu_id),
        text:item.menu_name,
        value:item.menu_id,
      };
    });
  }
  return getTreeNodeList('root');
}
