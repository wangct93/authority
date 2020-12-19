const express = require('express');
const {deleteRole} = require("../db/role");
const {updateRole} = require("../db/role");
const {createRole} = require("../db/role");
const {queryRoleList} = require("../db/role");
const {toAry} = require("@wangct/util/lib/arrayUtil");
const router = express.Router();

module.exports = router;

module.exports = {
  roleList,
};

/**
 * 角色列表
 */
async function roleList(req,res) {
  const list = await queryRoleList();
  res.send({
    code:0,
    data:list,
  });
}
