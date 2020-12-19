const express = require('express');
const {deleteRole} = require("../db/role");
const {updateRole} = require("../db/role");
const {createRole} = require("../db/role");
const {queryRoleList} = require("../db/role");
const {toAry} = require("@wangct/util/lib/arrayUtil");
const router = express.Router();

module.exports = router;

module.exports = {
  search,
  create,
  update,
  delete:deleteFunc,
};

/**
 * 查询
 * @param req
 * @param res
 */
async function search(req,res){
  const totalPro = await queryRoleList({
    ...req.body,
    page_size:0,
  }).then((data) => data.length);
  const listPro = await queryRoleList(req.body);
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
  const data = await createRole(req.body);
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
  const data = await updateRole(req.body);
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
  const data = await deleteRole(req.body.role_id);
  res.send({
    code:0,
    data:data.insertId,
  });
}
