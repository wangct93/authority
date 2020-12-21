const express = require('express');
const {queryRoleList} = require("../db/role");
const router = express.Router();

module.exports = router;

module.exports = {
  roleList,
};

/**
 * 角色列表
 */
async function roleList() {
  return queryRoleList();
}
