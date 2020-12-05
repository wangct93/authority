import {
  AfcDrawer, aryToObject,
  DateStringPicker,
  FilterInput, FilterRadio,
  FilterSelect,  getFormatter, reduxConnect, strEqual,
  UserInput, userPswFormatter,
  BaseEditDrawer,
} from "afc-basic-element-browser";
// @ts-ignore
import css from "./index.less";
import * as dicApi from '../../db/dic';
import * as roleApi from '../../db/authorityRole';
import {Button,  Input, Transfer, TreeSelect} from "antd";
import * as React from "react";
import {callFunc} from "@wangct/util";
import {getProps} from "@wangct/util";
import {toAry} from "@wangct/util";
import moment from 'moment';
import {userNameFormatter} from "../../utils/formatter";
import {toPromise} from "@wangct/util";
import DefineComponent from "../../components/DefineComponent";

/**
 * 用户编辑弹窗
 */
@reduxConnect(({global}) => ({
  resizeSign:global.resizeSign,
}))
export default class EditDrawer extends BaseEditDrawer {
  state = {
    options: [],
  };

  getOptions(): any[] {
    const isCreate = this.isCreate();
    return [
      {
        title: '用户编号',
        field: 'user_id',
        component:UserInput,
        props:{
          disabled:!isCreate,
        },
        required:isCreate,
      },
      {
        title: '用户名称',
        field: 'user_name',
        component:FilterInput,
        formatter:userNameFormatter,
        required:true,
      },
      {
        title: '用户密码',
        field: 'user_pwd',
        component:PswInput,
        required:true,
        formatter:userPswFormatter,
        show:() => this.isCreate(),
      },
      {
        title: '用户类型',
        field: 'user_type',
        component:FilterSelect,
        props:{
          loadData:dicApi.userType,
          initValueAfterFirstLoad:true,
        },
        required:true,
      },
      {
        title: '组织机构',
        field: 'dept_id',
        component:DeptSelect,
        required:true,
      },
      {
        title: '有效日期',
        field: 'effect_date_time',
        component:DateStringPicker,
        props:{
          showTime:true,
          defaultValue:moment().add(10,'years').format('YYYY-MM-DD HH:mm:ss'),
        },
        required:true,
      },
      {
        title: '是否启用',
        field: 'status',
        component:FilterRadio,
        props:{
          loadData:dicApi.userEnableMark,
          initValueAfterFirstLoad:true,
        },
        required:true,
      },
      {
        title: '出生年月',
        field: 'user_birthday',
        component:DateStringPicker,
        props:{
          showTime:true,
        },
      },
      {
        title: '用户地址',
        field: 'user_address',
        component:FilterInput,
        formatter:getFormatter({
          length:30,
        }),
        width:'100%',
      },
      {
        title: '角色选择',
        field: 'role_list',
        component:TransferDrawerSelect,
        props:{
          loadData:roleListDic,
          selectComponent:RoleSelect,
          title:'选择角色',
        },
        // required:true,
        width:'100%',
        // className:css.tranfer_line,
      },
      // {
      //   title: '登录点选择',
      //   field: 'node_list',
      //   component:TransferDrawerSelect,
      //   props:{
      //     loadData:dicApi.loginNodeDic,
      //     selectComponent:NodeSelect,
      //     title:'选择登录点',
      //   },
      //   // required:true,
      //   width:'100%',
      //   // className:css.tranfer_line,
      // },
    ];
  }

  getFormProps() {
    return {
      itemWidth: '50%',
    };
  }

  getClassName(): string {
    return css.edit_drawer;
  }

  getWidth(): number {
    return 800;
  }

  getTitle(): string {
    return this.isCreate() ? '新增' : '编辑';
  }

  onOk = (data) => {
    callFunc(this.props.onOk,{
      ...data,
      menu_node:undefined,
    });
  }

}

/**
 * 角色选择框
 * @author wangchuitong
 */
class RoleSelect extends DefineComponent {
  state = {
    dataSource:[],
    // dataSource:loop(10,(item) => {
    //   return {
    //     key:item.toString(),
    //     title:'角色用户_' + item,
    //   };
    // }),
  };

  componentDidMount(): void {
    roleApi.doGetRolesByUserId().then((data) => {
      const list = toAry(data).map((item) => {
        return {
          title:item.role_name,
          key:item.role_id,
        };
      });
      this.setState({
        dataSource:list,
        loading:false,
      });
    });
  }

  getTargetKeys(){
    return toAry(this.getValue());
  }

  itemRender(item){
    return item.title;
  }

  render() {
    const {state} = this;
    return <Transfer
      dataSource={state.dataSource}
      onChange={this.props.onChange}
      targetKeys={this.getTargetKeys()}
      render={this.itemRender}
      filterOption={transferFilter}
      className={css.flex_transfer}
      showSearch
      listStyle={{
        height:getTransferHeight(),
      }}
    />;
  }
}

/**
 * 角色列表字典
 * @author wangchuitong
 */
export function roleListDic(){
    return roleApi.doGetRolesByUserId().then((data) => {
      return toAry(data).map((item) => {
        return {
          text:item.role_name,
          value:item.role_id,
        };
      });
    });
}

/**
 * 获取穿梭框高度
 * @author wangchuitong
 */
function getTransferHeight(){
  return (window.innerHeight - 200);
}

// /**
//  * 获取穿梭框高度
//  * @author wangchuitong
//  */
// function getTransferHeight(){
//     return Math.max((window.innerHeight - 52 * 5 - 188) / 2,240);
// }

/**
 * 运营点选择
 * @author wangchuitong
 */
class NodeSelect extends DefineComponent {
  state = {
    // dataSource:loop(10,(item) => {
    //   return {
    //     key:item.toString(),
    //     title:'运营点_' + item,
    //   };
    // }),
    dataSource:[],
    loading:true,
  };

  componentDidMount(): void {
    dicApi.loginNodeDic().then((data) => {
      const list = data.map((item) => {
        return {
          title:item.text,
          key:item.value,
        };
      });
      this.setState({
        dataSource:list,
        loading:false,
      });
    });
  }

  getTargetKeys(){
    return toAry(this.getValue());
  }

  itemRender(item){
    return item.title;
  }

  render() {
    const {state} = this;
    return <Transfer
      dataSource={state.dataSource}
      onChange={this.props.onChange}
      targetKeys={this.getTargetKeys()}
      render={this.itemRender}
      filterOption={transferFilter}
      className={css.flex_transfer}
      showSearch
      listStyle={{
        height:getTransferHeight(),
      }}
    />;
  }
}

/**
 * 穿梭框筛选过滤方法
 * @author wangchuitong
 */
function transferFilter(value,opt){
    return opt.title.includes(value);
}

/**
 * 组织机构选择框
 * @author wangchuitong
 */
class DeptSelect extends DefineComponent {
  state = {
    treeData:[
      // {
      //   title:'节点1',
      //   value:'0',
      //   children:[
      //     {
      //       title:'节点1 - 1',
      //       value:'1',
      //     },
      //     {
      //       title:'节点1 - 2',
      //       value:'2',
      //     },
      //     {
      //       title:'节点1 - 3',
      //       value:'3',
      //     },
      //   ]
      // },
    ],
    showSearch:true,
    placeholder:'请选择组织机构',
    filterTreeNode:this.filterTreeNode,
  };

  componentDidMount(): void {
    this.loadOptions();
  }

  loadOptions(){
    dicApi.deptDicTree().then((data) => {
      const formatData = (list) => {
        return toAry(list).map((item) => {
          return {
            ...item,
            title:item.dept_name,
            value:item.dept_id,
            children:item.sub_nodes && formatData(item.sub_nodes),
          };
        });
      };
      this.updateField('treeData',formatData(data));
    });
  }

  filterTreeNode(inputValue,node){
    return node.props.title.includes(inputValue);
  }

  render() {
    return <TreeSelect {...getProps(this)} />;
  }
}

/**
 * 密码输入框
 * @author wangchuitong
 */
export class PswInput extends DefineComponent {
  state = {};

  onChange = (e) => {
    callFunc(this.props.onChange,e.target.value);
  };

  render() {
    return <Input.Password placeholder="请输入密码" {...getProps(this,['parentField'])} onChange={this.onChange} />;
  }
}

/**
 * 穿梭框窗口
 * @author wangchuitong
 */
class TransferDrawerSelect extends DefineComponent {
  state = {
    drawer:{},
    viewValue:null,
    mapData:{},
  };

  componentDidMount(): void {
    this.setDic();
  }

  setDic(){
    const {props} = this;
    if(props.loadData){
      toPromise(props.loadData).then((data) => {
        this.updateField('mapData',aryToObject(toAry(data),'value'));
      });
    }
  }

  selectChange = (value) => {
    this.updateField('viewValue',value);
  };

  onChange = () => {
    const {viewValue} = this.state;
    callFunc(this.props.onChange,viewValue);
    this.closeDrawer();
  };

  // @ts-ignore
  openDrawer = (e) => {
    this.setState({
      drawer:{
        visible:true,
      },
      viewValue:this.getValue(),
    });
  };

  doDelete = (id) => {
    const value = this.getValue();
    const newValue = toAry(value).filter((item) => strEqual(item,id));
    callFunc(this.props.onChange,newValue);
  };

  getViewContent(){
    const {mapData} = this.state;
    const value = this.getValue();
    return toAry(value).length ? <div className={css.view_content}>
      {
        toAry(value).map((item) => {
          const target = mapData[item];
          return target ? target.text : item;
        }).join('、')
      }
    </div> : null;
  }

  getSelectComponent(){
    return this.props.selectComponent || null;
  }

  render() {
    const {state,props} = this;
    const Com = this.getSelectComponent();
    return <div className={css.tranfer_drawer_select}>
      <Button onClick={this.openDrawer}>{props.title}</Button>
      {
        this.getViewContent()
      }
      <AfcDrawer
        {...state.drawer}
        width={600}
        title={props.title}
        onOk={this.onChange}
        onClose={this.closeDrawer}
        showDefaultFooter
      >
        <div style={{padding:20,height:'100%'}}>
          {
            Com && <Com value={state.viewValue} onChange={this.selectChange} />
          }
        </div>
      </AfcDrawer>
    </div>;
  }
}
