const express = require('express');
const {deleteUser} = require("../db/user");
const {updateUser} = require("../db/user");
const {createUser} = require("../db/user");
const {queryUserList} = require("../db/user");
const {toAry} = require("@wangct/util/lib/arrayUtil");
const router = express.Router();

module.exports = router;

router.post('/search',search);
router.post('/create',create);
router.post('/update',update);
router.post('/delete',deleteFunc);

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
