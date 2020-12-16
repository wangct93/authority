/**
 * Created by wangct on 2018/12/30.
 */
const Mysql = require('../@wangct/mysql');
const {objClone} = require("@wangct/util/lib/objectUtil");
const {getPageLimit} = require("../utils/utils");
const mysqlConfig = require('../config/mysql');
const moment = require('moment');
const mysql = new Mysql(mysqlConfig);

module.exports = {
  queryMenuList,
  createMenu,
  deleteMenu,
  updateMenu,
};

/**
 * 获取菜单列表
 * @param params
 * @returns {Promise<any>}
 */
async function queryMenuList(params = {}){
  return mysql.search({
    table: 'menu',
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
    where:objClone(params,['menu_id','menu_name']),

  });
}

/**
 * 获取菜单列表
 * @param params
 * @returns {Promise<any>}
 */
async function createMenu(params){
  return mysql.insert({
    table:'menu',
    data:{
      ...formatMenuData(params),
      create_time:moment().format('YYYY-MM-DD HH:mm:ss'),
      update_time:moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  });
}

/**
 * 删除菜单
 * @returns {Promise<any>}
 */
async function deleteMenu(menu_id){
  return mysql.delete({
    table:'menu',
    where:[
      {
        value:menu_id,
        key:'menu_id',
      }
    ],
  });
}

/**
 * 修改菜单
 * @returns {Promise<any>}
 */
async function updateMenu(params){
  return mysql.update({
    table:'menu',
    where:[
      {
        value:params.menu_id,
        key:'menu_id',
      }
    ],
    data:{
      ...formatMenuData(params),
      update_time:moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  });
}

/**
 * 格式化菜单数据
 * @param data
 * @returns {{}}
 */
function formatMenuData(data){
  return objClone(data,['menu_id','menu_name','parent','create_time','update_time']);
}
