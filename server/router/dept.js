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
  const data = await createDept(req.body);
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
  const data = await updateDept(req.body);
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
  const data = await deleteDept(req.body.dept_id);
  res.send({
    code:0,
    data:data.insertId,
  });
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
    return toAry(temp[parent]).map((item) => {
      return {
        ...item,
        children:getTreeNodeList(item.dept_id),
        text:item.dept_name,
        value:item.dept_id,
      };
    });
  };

  res.send({
    code:0,
    data:getTreeNodeList('root'),
  });

}
