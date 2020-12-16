/**
 * Created by wangct on 2018/12/30.
 */
const Mysql = require('../@wangct/mysql');
const {objClone} = require("@wangct/util/lib/objectUtil");
const {getPageLimit} = require("../utils/utils");
const mysqlConfig = require('../config/mysql');
const moment = require('moment');
const {isAry} = require("@wangct/util/lib/typeUtil");
const toAry = require("@wangct/util/lib/arrayUtil").toAry;
const toStr = require("@wangct/util/lib/stringUtil").toStr;
const mysql = new Mysql(mysqlConfig);

module.exports = {
  queryDeptList,
  createDept,
  deleteDept,
  updateDept,
};

/**
 * 获取用户列表
 * @param params
 * @returns {Promise<any>}
 */
async function queryDeptList(params = {}){
  return mysql.search({
    table: 'dept',
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
    where:objClone(params,['dept_id','dept_name']),
  });
}

/**
 * 获取用户列表
 * @param params
 * @returns {Promise<any>}
 */
async function createDept(params){
  return mysql.insert({
    table:'dept',
    data:{
      ...formatDeptData(params),
      create_time:moment().format('YYYY-MM-DD HH:mm:ss'),
      update_time:moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  });
}

/**
 * 删除用户
 * @returns {Promise<any>}
 */
async function deleteDept(dept_id){
  return mysql.delete({
    table:'dept',
    where:[
      {
        value:dept_id,
        key:'dept_id',
      }
    ],
  });
}

/**
 * 修改用户
 * @returns {Promise<any>}
 */
async function updateDept(params){
  return mysql.update({
    table:'dept',
    where:[
      {
        value:params.dept_id,
        key:'dept_id',
      }
    ],
    data:{
      ...formatDeptData(params),
      update_time:moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  });
}

/**
 * 格式化用户数据
 * @param data
 * @returns {{}}
 */
function formatDeptData(data){
  return objClone(data,['dept_id','dept_name','parent','create_time','update_time']);
}
