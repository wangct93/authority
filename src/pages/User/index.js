import React from 'react';
import DefineComponent from "../../components/DefineComponent";
import EditDrawer, {PswInput, roleListDic} from "./EditDrawer";
import {Button, Dropdown, Menu, message} from "antd";
import {toAry,aryToObject,isDef} from "@wangct/util";
import {userNameFormatter} from "../../utils/formatter";
import {colUserIdWidth, colUserNameWidth} from "../../utils/columns";
import css from './index.less';
import Auth from "../../components/Auth";
import {openModal, showModal} from "../../utils/frameUtil";
import {dicRoleList, dicUserEnableMark} from "../../services/dic";
import DateStringPicker from "../../components/DateStringPicker";
import moment from 'moment';
import {userUpdate} from "../../services/user";

/**
 * 用户界面
 */
export default class UserPage extends DefineComponent {
  state = {
    columns: [
      {
        title:'用户编号',
        dataIndex:'user_id',
        width:colUserIdWidth,
      },
      {
        title:'用户名称',
        dataIndex:'user_name',
        width:colUserNameWidth,
      },
      {
        title:'组织机构',
        dataIndex:'dept_name',
      },
      {
        title:'角色',
        dataIndex:'role_name_list',
        render:(v) => {
          const text = toAry(v).join('、');
          return textOverflowRender(text);
        },
        width:200,
      },
      {
        title:'是否启用',
        dataIndex:'status_name',
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
      },
      {
        title:'更新时间',
        dataIndex:'update_time',
      },
      {
        title: '操作',
        dataIndex: 'op',
        width:100,
        render:(v,row) => {
          return <Auth>
            <a onClick={this.doEdit.bind(this,row)}>编辑</a>
          </Auth>;
        },
      },
    ],
    filterOptions: [
      {
        title:'用户编号',
        field:'user_id',
        component:'input',
      },
      {
        title:'用户名称',
        field:'user_name',
        component:'input',
      },
    ],
  };

  doEdit = (row) => {
    openModal({
      title:'用户编辑',
      options:getFormOptions(false),
      value:row,
      onOk:(data) => {
        userUpdate(data).then(() => {
          message.success('编辑成功');
        });
      },
    });

  };

  getBtn(){
    return [
      {
        title: '新增',
        onClick:this.openAddModal,
      },
      {
        title: '重置密码',
        onClick:this.openResetPswDrawer,
        props:{
          disabled:!this.hasSelect(),
        },
      },
      <DelConfirm title="确认删除该数据吗？" onConfirm={this.doDelete}>
        <AuthButton disabled={!this.hasSelect()} function={auths.userDelete} title="删除" />
      </DelConfirm>,
      //
      <Dropdown overlay={this.getImportMenu()} placement="bottomLeft">
        <AuthButton disabled={!this.hasSelect()} function={(auths.userImport || auths.userImportAll) && auths.userImport + ',' + auths.userImportAll} title="导入" />
      </Dropdown>,
      {
        title: '全量导出',
        function:auths.userExport,
        onClick:this.doExport,
      },
      'search',
      'reset',
    ];
  }

  /**
   * 附加的抽屉属性
   * @author wangchuitong
   */
  getExtraDrawerProps(data,readOnly){
    if(!data){
      return null;
    }
    return showLoading(userApi.doGetInfo(data.user_id),'正在获取用户信息，请稍候...').then((result) => {
      return {
        data:result,
      };
    });
  }

  /**
   * 删除
   * @author wangchuitong
   */
  doDelete = () => {
    const row = this.getSelectedRows()[0];
    showLoading(userApi.doDelete(row.user_id)).then(() => {
      message.success('删除成功');
      this.tableReload();
    });
  };

  /**
   * 新增编辑确定
   * @author wangchuitong
   */
  doDrawerOk = (data) => {
    // @ts-ignore
    const isCreate = this.state.drawer.isCreate;
    const pro = isCreate ? userApi.doCreate(data) : userApi.doEdit(data);
    showLoading(pro).then(() => {
      message.success(isCreate ? '新建成功' : '编辑成功');
      this.closeDrawer();
      this.tableReload();
    });
  };

  openResetPswDrawer = () => {
    this.updateField('resetPswDrawer',{
      visible:true,
      data:this.getSelectedRow(),
    });
  };

  closeResetPswDrawer = () => {
    this.updateField('visible',false,'resetPswDrawer');
  };

  doResetPsw = (data) => {
    showLoading(userApi.doResetPsw({
      user_id:data.user_id,
      user_pwd_new:data.user_psw_new,
      user_pwd_val:data.user_psw_val,
    })).then(() => {
      this.closeResetPswDrawer();
      this.tableReload();
      message.success('重置密码成功');
    });
  };

  render() {
    const {state} = this;
    return <React.Fragment>
      <TableView
        columns={state.columns}
        filterOptions={state.filterOptions}
        btn={this.getBtn()}
        loadData={userApi.doSearch}
        rowSelection={state.rowSelection}
        ref={this.setTableView}
        searchFunction={auths.userSearch}
      />
      <EditDrawer {...state.drawer} onOk={this.doDrawerOk} onClose={this.closeDrawer} />
      <ResetPswDrawer {...state.resetPswDrawer} onOk={this.doResetPsw} onClose={this.closeResetPswDrawer} />
    </React.Fragment>;
  }
}

/**
 * 获取表单配置项
 * @param isCreate
 * @returns {*[]}
 */
function getFormOptions(isCreate) {
  return [
    {
      title: '用户编号',
      field: 'user_id',
      component: 'input',
      props: {
        disabled: !isCreate,
      },
      required: true,
    },
    {
      title: '用户名称',
      field: 'user_name',
      component: 'input',
      required: true,
    },
    {
      title: '用户密码',
      field: 'user_pwd',
      component: 'input',
      props: {
        type: 'password',
      },
      required: true,
      show: () => this.isCreate(),
    },
    {
      title: '有效日期',
      field: 'effect_date_time',
      component: DateStringPicker,
      props: {
        showTime: true,
        defaultValue: moment().add(10, 'years').format('YYYY-MM-DD HH:mm:ss'),
      },
      required: true,
    },
    {
      title: '是否启用',
      field: 'status',
      component: 'radio',
      props: {
        loadData: dicUserEnableMark,
        initValueAfterFirstLoad: true,
      },
      required: true,
    },
    {
      title: '角色选择',
      field: 'roleIds',
      component: 'select',
      props: {
        loadData: dicRoleList,
      },
    },
  ]
}
