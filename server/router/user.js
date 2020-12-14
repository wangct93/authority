const express = require('express');
const {toStr} = require("@wangct/util/lib/stringUtil");
const {deleteUser} = require("../db/user");
const {updateUser} = require("../db/user");
const {createUser} = require("../db/user");
const {queryUserList} = require("../db/user");
const {toAry} = require("@wangct/util/lib/arrayUtil");
const {encode,decode} = require('@wangct/node-util');
const router = express.Router();

module.exports = router;

router.post('/search',search);
router.post('/create',create);
router.post('/update',update);
router.post('/delete',deleteFunc);
router.post('/login',login);
router.post('/queryUserInfo',queryUserInfoByCookie);

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
  res.send({
    code:0,
    data:{
      total,
      list,
    },
  });
}

/**
 * 创建
 * @param req
 * @param res
 */
async function create(req,res){
  const data = await createUser(req.body);
  res.send({
    code:0,
    data:data.insertId,
  });
}

/**
 * 更新
 * @param req
 * @param res
 */
async function update(req,res){
  const data = await updateUser(req.body);
  res.send({
    code:0,
    data:data.insertId,
  });
}

/**
 * 删除
 * @param req
 * @param res
 */
async function deleteFunc(req,res){
  const data = await deleteUser(req.body.user_id);
  res.send({
    code:0,
    data:data.insertId,
  });
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
    res.send({
      code:0,
      data:userInfo,
    });
  }else{
    res.send({
      code:500,
      message:'用户名或者密码错误',
    });
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
 * 登录
 * @returns {Promise<void>}
 */
async function queryUserInfoByCookie(req,res){
  const {token} = req.cookies;
  if(token){
    try{
      const params = JSON.parse(decode(toStr(token)));
      const userInfo = await queryUserInfo(params);
      if(userInfo){
        res.send({
          code:0,
          data:userInfo,
        });
      }else{
        res.send({
          code:500,
        });
      }
    }catch(e){
      res.send({
        code:500,
      });
    }
  }else{
    res.send({
      code:500,
    });
  }
}
