const express = require('express');
const {toAry} = require("@wangct/util/lib/arrayUtil");
const {deleteMenu} = require("../db/menu");
const {updateMenu} = require("../db/menu");
const {createMenu} = require("../db/menu");
const {queryMenuList} = require("../db/menu");
const router = express.Router();

module.exports = router;

router.post('/search',search);
router.post('/create',create);
router.post('/update',update);
router.post('/delete',deleteFunc);
router.post('/menuTree',menuTree);

/**
 * 查询
 * @param req
 * @param res
 */
async function search(req,res){
  const totalPro = await queryMenuList({
    ...req.body,
    page_size:0,
  }).then((data) => data.length);
  const listPro = await queryMenuList(req.body);
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
  const data = await createMenu(req.body);
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
  const data = await updateMenu(req.body);
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
  const data = await deleteMenu(req.body.menu_id);
  res.send({
    code:0,
    data:data.insertId,
  });
}

/**
 * 菜单树节点
 * @param req
 * @param res
 */
async function menuTree(req,res){
  const menus = await queryMenuList();
  const temp = {};
  menus.forEach((menu) => {
    const parent = menu.parent || 'root';
    const list = temp[parent] || [];
    list.push(menu);
    temp[parent] = list;
  });

  function getTreeNodeList(parent){
    return toAry(temp[parent]).map((item) => {
      return {
        ...item,
        children:getTreeNodeList(item.menu_id),
        text:item.menu_name,
        value:item.menu_id,
      };
    });
  };

  res.send({
    code:0,
    data:getTreeNodeList('root'),
  });

}
