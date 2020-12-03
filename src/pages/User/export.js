
import {downloadBlob} from "../../utils/export";
import {isDef,loop} from "afc-browser-util";
import {aryToObject, showLoading} from "afc-basic-element-browser";
import {toAry} from "afc-browser-util";

const colWidths = {
  trafficker_name:30,
  oper_name_cn:30,
  line_name_cn:30,
  station_name_cn:30,
  station_name_en:30,
};

function getColWidth(field = 'normal'){
  return colWidths[field] || 10;
}

/**
 * 导出用户
 * @author wangchuitong
 */
export default async function exportUser(data){
  // @ts-ignore
  const Excel = await import('exceljs');
  const wb = new Excel.Workbook();
  await showLoading(new Promise((cb) => {
    setTimeout(() => {
      createUserSheet(wb,data.export_user_details,data);
      createRoleSheet(wb,data.sys_role_details);
      // createLoginNodeSheet(wb,data.landing_node_details);
      createDeptSheet(wb,data.sys_dept_details);
      downloadExcel(wb,'用户数据.xlsx');
      cb();
    },30);
  }),'正在导出数据，请稍候...');
};

function downloadExcel(wb,filename){
  wb.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data],{type:'xlsx'});
    downloadBlob(blob,filename);
  });
}

function getColumns(columns){
  return formatColumnsWidth(columns);
}

function formatColumnsWidth(columns){
  return columns.map((col) => {
    return {
      ...col,
      width:col.width || getColWidth(col.key),
    };
  });
}

function createUserSheet(wb,data,allData){
  const sheet = wb.addWorksheet('用户表');
  const columns = getColumns([
    {
      header:'用户编号',
      key:'user_id',
    },
    {
      header:'角色列表(以","分隔)',
      key:'role_list',
      render:(v) => toAry(v).join(','),
    },
    {
      header:'用户名称',
      key:'user_name',
    },
    {
      header:'密码',
      key:'user_md5_pwd',
    },
    {
      header:'部门编号(不可空)',
      key:'dept_id',
    },
    {
      header:'用户类型(1:超级管理员;2.系统管理员;3.普通用户)',
      key:'user_type',
    },
    {
      header:'是否启用(0.启用;1.禁用)',
      key:'status',
    },
    {
      header:'启用日期(可空)',
      key:'validity_period',
    },
    {
      header:'有效日期',
      key:'effect_date_time',
    },
    {
      header:'用户生日(可空)',
      key:'user_birthday',
    },
    {
      header:'用户卡(可空)',
      key:'user_id_card',
    },
    {
      header:'用户地址(可空)',
      key:'user_address',
    },
    {
      header:'备注',
      key:'remark',
    },
  ]);
  sheet.columns = columns;
  columns.forEach((col,colIndex) => {
    sheet.getColumn(colIndex + 1).width = col.width;
  });
  data.forEach((item,rowIndex) => {
    columns.forEach((col,colIndex) => {
      setCellValueByCol(sheet,rowIndex + 2,colIndex + 1,col,item);
    });
  });
  const dropdownMapData = {
    dept_id:[`=部门!$A$2:$A$${getDicLength(allData.sys_dept_details) + 1}`],
  };
  addDropdownConfig(sheet,columns,dropdownMapData);
}

/**
 * 设置单元格的值
 * @author wangchuitong
 */
function setCellValueByCol(sheet,rowIndex,colIndex,col,item){
  setCellValue(sheet,rowIndex,colIndex,getCellValue(col,item));
}

/**
 * 设置单元格的值
 * @author wangchuitong
 */
function setCellValue(sheet,rowIndex,colIndex,value){
  if(isDef(value)){
    sheet.getCell(rowIndex,colIndex).value = value;
  }
}

/**
 * 获取单元格的值
 * @author wangchuitong
 */
function getCellValue(col,data){
  const value = data[col.key];
  const renderValue = col.render ? col.render(value,data) : value;
  return isDef(renderValue) ? renderValue + '' : null;
}

function createRoleSheet(wb,data){
  const sheet = wb.addWorksheet('角色表');
  const columns = getColumns([
    {
      header:'角色编号',
      key:'role_id',
    },
    {
      header:'角色名称',
      key:'role_name',
    },
    {
      header:'角色描述',
      key:'role_desc',
    },
  ]);
  sheet.columns = columns;
  columns.forEach((col,colIndex) => {
    sheet.getColumn(colIndex + 1).width = col.width;
  });
  data.forEach((item,rowIndex) => {
    columns.forEach((col,colIndex) => {
      setCellValueByCol(sheet,rowIndex + 2,colIndex + 1,col,item);
    });
  });
}

function createLoginNodeSheet(wb,data){
  const sheet = wb.addWorksheet('登录点');
  const columns = getColumns([
    {
      header:'登录点编号',
      key:'node_id',
    },
    {
      header:'登录点名称',
      key:'node_name',
    },
    {
      header:'登录点类型（0.清分中心;1.线网;2.车站）',
      key:'node_type',
    },
  ]);
  sheet.columns = columns;
  columns.forEach((col,colIndex) => {
    sheet.getColumn(colIndex + 1).width = col.width;
  });
  data.forEach((item,rowIndex) => {
    columns.forEach((col,colIndex) => {
      setCellValueByCol(sheet,rowIndex + 2,colIndex + 1,col,item);
    });
  });
}

function createDeptSheet(wb,data){
  const sheet = wb.addWorksheet('部门');
  const columns = getColumns([
    {
      header:'部门编号',
      key:'dept_id',
    },
    {
      header:'部门名称',
      key:'dept_name',
    },
    {
      header:'上级部门',
      key:'parent_id',
    },
  ]);
  sheet.columns = columns;
  columns.forEach((col,colIndex) => {
    sheet.getColumn(colIndex + 1).width = col.width;
  });
  data.forEach((item,rowIndex) => {
    columns.forEach((col,colIndex) => {
      setCellValueByCol(sheet,rowIndex + 2,colIndex + 1,col,item);
    });
  });
}

function getDicLength(data){
  return Math.max(toAry(data).length,1);
}

export function addDropdownConfig(sheet,columns,dropdownMapData,length = 1000){
  const indexMapData = aryToObject(columns,'key',(item,index) => index);
  const dropdownList = Object.keys(dropdownMapData).map((key) => {
    return {
      index:indexMapData[key],
      formulae:dropdownMapData[key],
    };
  }).filter((item) => isDef(item.index));

  loop(length,(item,index) => {
    dropdownList.forEach((dropdownItem) => {
      sheet.getCell(index + 2,dropdownItem.index + 1).dataValidation = {
        type: 'list',
        formulae: dropdownItem.formulae,
        showErrorMessage:true,
      };
    });
  });
}
