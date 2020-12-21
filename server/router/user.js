const express = require('express');
const {catchError} = require("@wangct/util/lib/util");
const queryMenuListByUserId = require("../db/menu").queryMenuListByUserId;
const {toStr} = require("@wangct/util/lib/stringUtil");
const {deleteUser} = require("../db/user");
const {updateUser} = require("../db/user");
const {createUser} = require("../db/user");
const {queryUserList} = require("../db/user");
const {toAry} = require("@wangct/util/lib/arrayUtil");
const {encode,decode} = require('@wangct/node-util');
const router = express.Router();

module.exports = router;

module.exports = {
  search,
  create,
  update,
  delete:deleteFunc,
  login,
  queryUserInfo:queryUserInfoByCookie,
  logout,
};

/**
 * 查询
 * @param req
 * @param res
 */
async function search(req,res){
  const totalPro = await queryUserList({
    ...req.body,
    page_size:0,
  }).then((data) => data.length);
  const listPro = await queryUserList(req.body);
  const [total,list] = await Promise.all([totalPro,listPro]);
  return {
    total,
    list,
  };
}

/**
 * 创建
 * @param req
 * @param res
 */
async function create(req,res){
  return createUser(req.body);
}

/**
 * 更新
 * @param req
 * @param res
 */
async function update(req,res){
  return updateUser(req.body);
}

/**
 * 删除
 * @param req
 * @param res
 */
async function deleteFunc(req,res){
  return deleteUser(req.body.user_id);
}

/**
 * 登录
 * @returns {Promise<void>}
 */
async function login(req,res){
  const userInfo = await queryUserInfo(req.body);
  if(userInfo){
    const token = encode(JSON.stringify({user_id:req.body.user_id,user_password:req.body.user_password}));
    res.cookie('token',token);
    return userInfo;
  }else{
    throw '用户名或者密码错误';
  }
}

/**
 * 获取用户信息
 * @param data
 * @returns {Promise<void>}
 */
async function queryUserInfo(data){
  const result = await queryUserList(data);
  return result[0];
}

/**
 * 根据cookie获取用户信息
 * @returns {Promise<void>}
 */
async function queryUserInfoByCookie(req,res){
  const {token} = req.cookies;
  const params = catchError(() => {
    return JSON.parse(decode(toStr(token))) || {};
  },{});
  const userInfo = await queryUserInfo(params);
  if(userInfo){
    const menuList = await queryMenuListByUserId(userInfo.user_id);
    return {
      ...userInfo,
      menu_list:menuList,
    };
  }
  throw '获取用户信息失败';
}

/**
 * 登出
 */
function logout(req,res){
  res.cookie('token','');
}
