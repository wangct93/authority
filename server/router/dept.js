const {sendRes} = require("../@wangct/node-util/express");
const {deleteDept} = require("../db/dept");
const {updateDept} = require("../db/dept");
const {createDept} = require("../db/dept");
const {queryDeptList} = require("../db/dept");
const {toAry} = require("@wangct/util/lib/arrayUtil");

module.exports = {
  search,
  create,
  update,
  delete:deleteFunc,
  deptTree,
};

/**
 * 查询
 * @param req
 * @param res
 */
async function search(req,res){
  const totalPro = await queryDeptList({
    ...req.body,
    page_size:0,
  }).then((data) => data.length);
  const listPro = await queryDeptList(req.body);
  const [total,list] = await Promise.all([totalPro,listPro]);
  return {
    total,
    list,
  };
}

/**
 * 创建
 * @param req
 * @param res
 */
async function create(req,res){
  return createDept(req.body);
}

/**
 * 更新
 * @param req
 * @param res
 */
async function update(req,res){
  return await updateDept(req.body);
}

/**
 * 删除
 * @param req
 * @param res
 */
async function deleteFunc(req,res){
  return deleteDept(req.body.dept_id);
}

/**
 * 部门树节点
 * @param req
 * @param res
 */
async function deptTree(req,res){
  const depts = await queryDeptList();
  const temp = {};
  depts.forEach((dept) => {
    const parent = dept.parent || 'root';
    const list = temp[parent] || [];
    list.push(dept);
    temp[parent] = list;
  });

  function getTreeNodeList(parent){
    if(!temp[parent]){
      return null;
    }
    return toAry(temp[parent]).map((item) => {
      return {
        ...item,
        children:getTreeNodeList(item.dept_id),
        text:item.dept_name,
        value:item.dept_id,
      };
    });
  };
  return getTreeNodeList('root');
}
