import React  from 'react';
import DefineComponent  from "../../components/DefineComponent";
import Input from "../../components/Input";
import {TableSearch} from "../../components/Table";
import {alertSucInfo, openModal} from "../../utils/frameUtil";
import {colTimeWidth} from "../../utils/columns";
import {dicRoleList} from "../../services/dic";
import {userCreate, userDelete, userSearch, userUpdate} from "../../services/user";
import {TreeSelect} from "../../components/Select";
import {deptTreeSearch} from "../../services/dept";
import {toAry} from "@wangct/util";
import Auth from "../../components/Auth";
import {auths} from "../../json/auths";

/**
 * 用户
 */
export default class UserPage extends DefineComponent {

  state = {
    filterOptions:[
      {
        title: '用户编号',
        field: 'user_id',
        component: Input,
      },
      {
        title: '用户名称',
        field: 'user_name',
        component: Input,
      },
    ],
    columns:[
      {
        title: '用户编号',
        field: 'user_id',
      },
      {
        title: '用户名称',
        field: 'user_name',
      },
      {
        title: '角色列表',
        field: 'role_list',
        render:(v,row) => toAry(v).join(','),
      },
      {
        title: '部门',
        field: 'dept_id',
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
            <Auth auth={auths.userUpdate}>
              <a onClick={this.doUpdate.bind(this,row)}>编辑</a>
            </Auth>
            <Auth auth={auths.userDelete}>
              <a onClick={this.doDelete.bind(this,row)}>删除</a>
            </Auth>
          </div>;
        }
      },
    ],
  };

  doDelete = (row) => {
    userDelete(row.user_id).then(() => {
      alertSucInfo('删除成功');
      this.tableReload();
    });
  };

  doUpdate = (row) => {
    openModal({
      title:'编辑',
      options:getFormOptions(false),
      onOk:(data) => {
        return userUpdate(data).then(() => {
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
        return userCreate(data).then(() => {
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
        auth:auths.userCreate,
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
      loadData={userSearch}
      ref={this.setTable}
      defaultSearch
      searchAuth={auths.userSearch}
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
      title: '用户编号',
      field: 'user_id',
      component: Input,
      required: true,
    },
    {
      title: '用户名称',
      field: 'user_name',
      component: Input,
      required: true,
    },
    {
      title: '用户密码',
      field: 'user_password',
      component: Input,
      props:{
        type:'password',
      },
      required: true,
    },
    {
      title: '角色列表',
      field: 'role_list',
      component: 'select',
      props:{
        loadData:dicRoleList,
        mode:'multiple',
      },
      // required: true,
    },
    {
      title: '部门',
      field: 'dept_id',
      component:TreeSelect,
      props:{
        loadData:deptTreeSearch,
      },
      required: true,
    }
  ];
}
