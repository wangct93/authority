import React from 'react';

// @ts-ignore
import css from './index.less';
import  DefineComponent from "../../components/DefineComponent";
import {AfcUpload, DelConfirm, TableView} from "afc-basic-element-browser";
import {
  colTimeWidth, FilterInput,
  getDicStateRender, getFormatter,
  getTestLoadData, getUserInfo,
  setDicOptions, showEditPassword,
  showLoading, textOverflowRender,
  UserInput
} from "afc-basic-element-browser";
import EditDrawer, {roleListDic} from "./EditDrawer";
import * as userApi from '../../db/user';
import {Button, Dropdown, Menu, message} from "antd";
import {toAry,aryToObject,isDef} from "@wangct/util";
import {userNameFormatter} from "../../utils/formatter";
import {AuthButton} from "afc-basic-element-browser";
import ResetPswDrawer from "./ResetPswDrawer";
import auths from "../../json/auths";
import {ModalType} from "../../utils/options";
import * as dicApi from "../../db/dic";
import {colUserIdWidth, colUserNameWidth} from "../../utils/columns";

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
        dataIndex:'status',
        render:getDicStateRender(this,'userEnableMark'),
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        width:colTimeWidth,
      },
      {
        title:'更新时间',
        dataIndex:'update_time',
        width:colTimeWidth,
      },
      {
        title: '操作',
        dataIndex: 'op',
        width:100,
        render:(v,row) => {
          return <AuthButton auth={auths.userUpdate} render={(props) => {
          return <a onClick={this.doEdit.bind(this,row)}>{props.title || '编辑'}</a>;
          }
          } />;
        },
      },
    ],
    filterOptions: [
      {
        title:'用户编号',
        field:'user_id',
        component:UserInput,
      },
      {
        title:'用户名称',
        field:'user_name',
        component:FilterInput,
        formatter:userNameFormatter,
      },
    ],
    drawer:{},
    resetPswDrawer:{},
    rowSelection:{
      onChange:this.rowSelectionChange.bind(this),
      type:'radio',
    },
  };

  doEdit = (row) => {
    const pro = Promise.all([roleListDic()]);
    showLoading(pro).then(([roleDic]) => {
      const roleMap = aryToObject(roleDic,'text');
      const roleIds = toAry(row.role_name_list).map((item) => {
        const target = roleMap[item];
        return target && target.value;
      }).filter((item) => isDef(item));
      this.updateField('drawer',{
        visible:true,
        isCreate:false,
        data:{
          ...row,
          role_list:roleIds,
        },
      });
    });

  };

  componentDidMount(): void {
    setDicOptions(this,['userEnableMark']);
  }

  getImportMenu(){
    return <Menu className={css.dropdown_import_content}>
      <Menu.Item>
        <AuthUpload title="增量导入" onChange={this.doImport} function={auths.userImport} />
      </Menu.Item>
      <Menu.Item>
        <AuthUpload title="全量导入" onChange={this.doAllImport} function={auths.userImportAll} />
      </Menu.Item>
    </Menu>;
  }

  getBtn(){
    return [
      {
        title: '新增',
        function:auths.userCreate,
        onClick:this.openDrawer,
      },
      // {
      //   title: '编辑',
      //   function:auths.userUpdate,
      //   onClick:this.openDrawer.bind(this,false),
      //   props:{
      //     disabled:!this.hasSelect(),
      //   },
      // },
      {
        title: '重置密码',
        function:auths.userResetPsw,
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

  getSelectedRow(){
    return this.getSelectedRows()[0];
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
   * 导出方法
   * @author wangchuitong
   */
  doExport(){
    showLoading(userApi.doExport()).then(() => {
      message.success('导出成功');
    });
  }

  /**
   * 导入方法
   * @author wangchuitong
   */
  doImport = (file) => {
    const formData = new FormData();
    formData.append('file',file);
    showLoading(userApi.doImport(formData)).then(() => {
      message.success('导入成功');
      this.tableReload();
    });
  };

  /**
   * 全量导入方法
   * @author wangchuitong
   */
  doAllImport = (file) => {
    const formData = new FormData();
    formData.append('file',file);
    showLoading(userApi.doImportAll(formData)).then(() => {
      message.success('导入成功');
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
 * 导入权限组件
 * @author wangchuitong
 */
class AuthUpload extends DefineComponent {
  state = {};

  contentRender(props){
    return <AfcUpload {...props}>
      <a type="primary">{props.title}</a>
    </AfcUpload>;
  }

  render() {
    return <AuthButton {...this.props} render={this.contentRender} />;
  }
}
