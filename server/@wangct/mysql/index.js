/**
 * Created by wangct on 2018/12/1.
 */


const fs = require('fs');
const mysql = require('mysql');
const {resolve,toAry,isDef,isObj,mkdir,log,isStr} = require('@wangct/node-util');
const BaseClass = require('./BaseClass');
const {isAry} = require("@wangct/util/lib/typeUtil");
const {toStr} = require("@wangct/util/lib/stringUtil");
const {objForEach} = require("@wangct/util/lib/objectUtil");
const {objMap} = require("@wangct/util/lib/objectUtil");

/**
 * 默认配置
 * @type {{password: string, database: string, port: string, host: string, user: string}}
 */
const defaultConfig = {
  host:'localhost',
  port:'3306',
  user:'root',
  password:'123456',
  database:'book'
};

class Mysql extends BaseClass{
  constructor(option = {}) {
    super();
    this.init(option);
  }

  init(option) {
    this.setProp({
      fileMaxSize: 8 * 1024 * 1024,
      logDirname: resolve('logs/mysql'),
      log:true,
      ...defaultConfig,
      ...option,
    });
  }

  query(sql) {
    return new Promise((cb,eb) => {
      if(!sql){
        return eb({message:'未获取到sql'});
      }
      console.log('执行sql：',sql);
      const timer = +new Date();
      const {host, port, user, password, database} = this.props;
      const target = mysql.createConnection({
        host,
        port,
        user,
        password,
        database
      });
      target.connect();
      target.query(sql, (err, data) => {
        const timeMsg = `\n用时：${(+new Date() - timer) / 1000}s`;
        if (err) {
          logInfo(resolve(this.getProp('logDirname'),'error.txt'),err + timeMsg);
          eb(err);
        } else {
          logInfo(resolve(this.getProp('logDirname'),'success.txt'),sql + timeMsg);
          cb(data);
        }
      });
      target.end();
    })
  }

  search(options = {}){
    const {limit,table,where,orderField,orderDesc,fields = []} = options;
    if(!table){
      return null;
    }
    const selectField = fields.length === 0 ? '*' : fields.map((field) => {
      if(isStr(field)){
        return field;
      }
      const data = field;
      field = data.field;
      const {value = field,isTime} = data;
      if(isTime){
        return `date_format(${value},"%Y-%m-%d %H:%i:%s") ${field}`;
      }
      return field;
    }).join(',');
    const sql = `select ${selectField} from ${table} ${getWhere(where)} ${getDesc(orderField,orderDesc)} ${getLimit(limit)} ${getGroup(options.group)}`;
    return this.query(sql);
  }

  update(options = {}){
    const {table,data = {},where} = options;
    if(!table){
      return null;
    }
    const setSql = Object.keys(data).map((key) => {
      return `${key}=${getValue(data[key])}`;
    }).join(',');
    const sql = `update ${table} set ${setSql} ${getWhere(where)}`;
    return this.query(sql);
  }

  insert(options = {}){
    const {table} = options;
    let {fields = [],data = {}} = options;
    data = toAry(data);
    if(!table || data.length === 0){
      return null;
    }
    if(fields.length === 0){
      fields = Object.keys(data[0]);
    }
    const values = toAry(data).map(item => {
      return `(${fields.map(field => formatValue(item[field])).join(',')})`
    }).join(',');
    const sql = `insert ${table}(${fields.join(',')}) values${values}`;
    return this.query(sql);
  }

  delete(options = {}){
    const {table,where} = options;
    if(!table){
      return null;
    }
    const sql = `delete from ${table} ${getWhere(where)}`;
    return this.query(sql);
  }

}

module.exports = Mysql;

/**
 * 格式化sql
 * @param data
 * @returns {string}
 */
function formatValue(data){
  if(isDef(data)){
    if(isObj(data)){
      return Object.keys(data).map(key => {
        return `${key}=${formatValue(data[key])}`;
      }).join(' and ')
    }else{
      return `'${toStr(data).replace(/[\\'"]/g,(match) => '\\' + match)}'`;
    }
  }else{
    return `''`;
  }
}

/**
 * 获取wheresql
 * @param data
 * @returns {string}
 */
function getWhere(data = []){
  let where;
  if(isAry(data)){
    where = toAry(data).filter((item) => item.value != null || item.sql).map((item,index) => {
      const {and,value,key,leftBracket,rightBracket} = item;
      const sep = index ? and  ? 'and' : 'or' : '';
      const keySep = item.isLike ? 'like' : '=';
      const sql = item.sql ? item.sql : `${key} ${keySep} ${getValue(value)}`;
      return `${leftBracket ? '(' : ''}${sep} ${sql}${rightBracket ? ')' : ''}`;
    }).join(' ');
  }else{
    where = Object.keys(data).filter((key) => data[key] != null).map((key) => {
      return `${key}=${getValue(data[key])}`;
    }).join(' and ');
  }
  if(!where){
    return '';
  }
  return ` where ${where}`;
}

/**
 * 获取分页
 * @param limit
 * @returns {string}
 */
function getLimit(limit){
  const [start,size] = toAry(limit);
  if(!limit){
    return '';
  }
  return ` limit ${start},${size}`;
}

/**
 * 获取分组
 * @param group
 * @returns {string}
 */
function getGroup(group){
  if(group){
    return ' group by ' + group;
  }
  return '';
}

/**
 * 获取排序
 * @param orderField
 * @param orderDesc
 * @returns {string}
 */
function getDesc(orderField,orderDesc){
  if(!orderField){
    return '';
  }
  return ` order by ${orderField} ${orderDesc ? 'desc' : ''}`;
}

/**
 * 日志
 * @param filePath
 * @param msg
 */
function logInfo(filePath,msg){
  try{
    if(!isStr(msg)){
      msg = JSON.stringify(msg);
    }
    mkdir(require('path').dirname(filePath));
  }catch(e){}
  msg = '\n*******************************************\n' + msg;
  log(msg);
  require('fs').appendFileSync(filePath, msg);
}

/**
 * 获取值
 */
function getValue(value){
  value = toStr(value);
  const sep = '$';
  const hideMarks = value[0] === sep && value[value.length - 1] === sep;
  if(hideMarks){
    return value.substr(1,value.length - 2);
  }
  return '"' + value + '"';
}
