/**
 * Created by wangct on 2018/12/30.
 */
const Mysql = require('../@wangct/mysql');
const {objClone} = require("@wangct/util/lib/objectUtil");
const {getPageLimit} = require("../utils/utils");
const mysqlConfig = require('../config/mysql');
const moment = require('moment');
const aryRemoveRepeat = require("@wangct/util/lib/arrayUtil").aryRemoveRepeat;
const queryRoleList = require("./role").queryRoleList;
const queryUserList = require("./user").queryUserList;
const mysql = new Mysql(mysqlConfig);

module.exports = {
  queryMenuList,
  createMenu,
  deleteMenu,
  updateMenu,
  queryMenuListByUserId,
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

/**
 * 根据用户编号获取菜单列表
 * @returns {Promise<any>}
 */
async function queryMenuListByUserId(userId){
  const userList = await queryUserList({user_id:userId});
  const userInfo = userList[0];
  if(!userInfo){
    return [];
  }
  const roleList = await queryRoleList({
    role_id:userInfo.role_list[0],
  });
  return aryRemoveRepeat(roleList.reduce((pv,item) => {
    return pv.concat(item.menu_list);
  },[]));
}
