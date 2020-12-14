/**
 * Created by wangct on 2018/12/30.
 */
const Mysql = require('../modules/mysql');
const {objClone} = require("@wangct/util/lib/objectUtil");
const {getPageLimit} = require("../utils/utils");
const mysqlConfig = require('../config/mysql');
const moment = require('moment');
const {isAry} = require("@wangct/util/lib/typeUtil");
const toAry = require("@wangct/util/lib/arrayUtil").toAry;
const toStr = require("@wangct/util/lib/stringUtil").toStr;
const mysql = new Mysql(mysqlConfig);

module.exports = {
  queryRoleList,
  createRole,
  deleteRole,
  updateRole,
};

/**
 * 获取角色列表
 * @param params
 * @returns {Promise<any>}
 */
async function queryRoleList(params = {}){
  return mysql.search({
    table: 'role',
    limit: getPageLimit(params.page_num, params.page_size),
    fields: [
      '*',
      {
        field: 'create_time',
        isTime: true,
      },
      {
        field: 'update_time',
        isTime: true,
      }],
    orderField:'update_time',
    orderDesc:true,
    where:objClone(params,['role_id','role_name']),
  }).then((data) => {
    return data.map((item) => ({
      ...item,
      menu_list:toStr(item.menu_list).split(','),
    }))
  });
}

/**
 * 获取角色列表
 * @param params
 * @returns {Promise<any>}
 */
async function createRole(params){
  return mysql.insert({
    table:'role',
    data:{
      ...formatRoleData(params),
      create_time:moment().format('YYYY-MM-DD HH:mm:ss'),
      update_time:moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  });
}

/**
 * 删除角色
 * @returns {Promise<any>}
 */
async function deleteRole(role_id){
  return mysql.delete({
    table:'role',
    where:[
      {
        value:role_id,
        key:'role_id',
      }
    ],
  });
}

/**
 * 修改角色
 * @returns {Promise<any>}
 */
async function updateRole(params){
  return mysql.update({
    table:'role',
    where:[
      {
        value:params.role_id,
        key:'role_id',
      }
    ],
    data:{
      ...formatRoleData(params),
      update_time:moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  });
}

/**
 * 格式化角色数据
 * @param data
 * @returns {{}}
 */
function formatRoleData(data){
  const roleData = objClone(data,['role_name','create_time','update_time']);
  if(data.role_id){
    roleData.role_id = data.role_id;
  }
  return {
    ...roleData,
    menu_list:toAry(data.menu_list).join(','),
  };
}
