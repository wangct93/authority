import React  from 'react';
import DefineComponent  from "../../components/DefineComponent";
import Input from "../../components/Input";
import {TableSearch} from "../../components/Table";
import {alertSucInfo, openModal} from "../../utils/frameUtil";
import {TreeSelect} from "../../components/Select";
import {menuTreeSearch} from "../../services/menu";
import {colMenuListWidth, colTimeWidth} from "../../utils/columns";
import css from './index.less';
import {roleCreate, roleDelete, roleSearch, roleUpdate} from "../../services/role";
import {toAry} from '@wangct/util';
import {auths} from "../../json/auths";
import Auth from "../../components/Auth";
import {textOverflowRender} from "../../frame/utils/columns";

/**
 * 角色
 */
export default class RolePage extends DefineComponent {

  state = {
    filterOptions:[
      {
        title: '角色编号',
        field: 'role_id',
        component: Input,
      },
      {
        title: '角色名称',
        field: 'role_name',
        component: Input,
      },
    ],
    columns:[
      {
        title: '角色编号',
        field: 'role_id',
      },
      {
        title: '角色名称',
        field: 'role_name',
      },
      {
        title: '菜单列表',
        field: 'menu_list',
        render:(v,row) => textOverflowRender(toAry(v).join(',')),
        width:colMenuListWidth,
      },
      {
        title: '更新时间',
        field: 'update_time',
        width:colTimeWidth,
      },
      {
        title: '创建时间',
        field: 'create_time',
        width:colTimeWidth,
      },
      {
        title: '操作',
        field: 'op',
        width:100,
        render:(v,row) => {
          return <div className="op-box">
            <Auth auth={auths.roleUpdate}>
              <a onClick={this.doUpdate.bind(this,row)}>编辑</a>
            </Auth>
            <Auth auth={auths.roleDelete}>
              <a onClick={this.doDelete.bind(this,row)}>删除</a>
            </Auth>
          </div>;
        }
      },
    ],
  };

  doDelete = (row) => {
    roleDelete(row.role_id).then(() => {
      alertSucInfo('删除成功');
      this.tableReload();
    });
  };

  doUpdate = (row) => {
    openModal({
      title:'编辑',
      options:getFormOptions(false),
      onOk:(data) => {
        return roleUpdate(data).then(() => {
          alertSucInfo('编辑成功');
          this.tableReload();
        });
      },
      value:row,
    });
  };

  doCreate = () => {
    openModal({
      title:'新增',
      options:getFormOptions(),
      onOk:(data) => {
        return roleCreate(data).then(() => {
          alertSucInfo('新增成功');
          this.tableReload();
        });
      }
    });
  };

  getTableBtn(){
    return [
      {
        title:'新增',
        onClick:this.doCreate,
        auth:auths.roleCreate,
      },
      'search',
      'reset',
    ]
  }


  render() {
    const { state } = this;
    return <TableSearch
      columns={state.columns}
      filterOptions={state.filterOptions}
      btnOptions={this.getTableBtn()}
      loadData={roleSearch}
      ref={this.setTable}
      defaultSearch
      searchAuth={auths.roleSearch}
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
      title: '角色名称',
      field: 'role_name',
      component: Input,
      required: true,
    },
    {
      title: '菜单列表',
      field: 'menu_list',
      component: TreeSelect,
      props:{
        loadData:menuTreeSearch,
        treeCheckable:true,
      },
      required: true,
    }
  ];
}
