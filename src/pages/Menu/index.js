import React  from 'react';
import DefineComponent  from "../../components/DefineComponent";
import Input from "../../components/Input";
import {TableSearch} from "../../components/Table";
import {alertSucInfo, openModal} from "../../utils/frameUtil";
import {TreeSelect} from "../../components/Select";
import {menuCreate, menuDelete, menuSearch, menuTreeSearch, menuUpdate} from "../../services/menu";
import {colTimeWidth} from "../../utils/columns";
import css from './index.less';

/**
 * 菜单
 */
export default class MenuPage extends DefineComponent {

  state = {
    filterOptions: [
      {
        title: '菜单编号',
        field: 'menu_id',
        component: Input,
      },
      {
        title: '菜单名称',
        field: 'menu_name',
        component: Input,
      },
    ],
    columns: [
      {
        title: '菜单编号',
        field: 'menu_id',
      },
      {
        title: '上级菜单编号',
        field: 'parent',
      },
      {
        title: '菜单名称',
        field: 'menu_name',
      },
      {
        title: '更新时间',
        field: 'update_time',
        width: colTimeWidth,
      },
      {
        title: '创建时间',
        field: 'create_time',
        width: colTimeWidth,
      },
      {
        title: '操作',
        field: 'op',
        width: 100,
        render: (v, row) => {
          return <div className="op-box">
            <a onClick={this.doUpdate.bind(this, row)}>编辑</a>
            <a onClick={this.doDelete.bind(this, row)}>删除</a>
          </div>;
        }
      },
    ],
  };

  doDelete = (row) => {
    menuDelete(row.menu_id).then(() => {
      alertSucInfo('删除成功');
      this.tableReload();
    });
  };

  doUpdate = (row) => {
    openModal({
      title: '编辑',
      options: getFormOptions(false),
      onOk: (data) => {
        return menuUpdate(data).then(() => {
          alertSucInfo('编辑成功');
          this.tableReload();
        });
      },
      value: row,
    });
  };

  doCreate = () => {
    openModal({
      title: '新增',
      options: getFormOptions(),
      onOk: (data) => {
        return menuCreate(data).then(() => {
          alertSucInfo('新增成功');
          this.tableReload();
        });
      }
    });
  };

  getTableBtn() {
    return [
      {
        title: '新增',
        onClick: this.doCreate,
      },
      'search',
      'reset',
    ];
  }


  render() {
    const {state} = this;
    return <TableSearch
      columns={state.columns}
      filterOptions={state.filterOptions}
      btnOptions={this.getTableBtn()}
      loadData={menuSearch}
      ref={this.setTable}
      defaultSearch
    />;
  }
}

/**
 * 获取表单配置项
 * @param isCreate
 * @returns {*[]}
 */
function getFormOptions(isCreate = true){
  return [
    {
      title:'上级菜单',
      field:'parent',
      component:TreeSelect,
      props:{
        loadData:menuTreeSearch,
      }
    },
    {
      title: '菜单编号',
      field: 'menu_id',
      component: Input,
      required: true,
      props:{
        disabled:!isCreate,
      },
    },
    {
      title: '菜单名称',
      field: 'menu_name',
      component: Input,
      required: true,
    },
  ];
}
