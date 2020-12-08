import React  from 'react';
import css from './index.less';
import DefineComponent  from "../../components/DefineComponent";
import Input from "../../components/Input";
import Flex, {FlexItem} from "../../components/Flex";
import Table, {TableSearch} from "../../components/Table";
import Tree from "../../components/Tree";
import {openModal} from "../../utils/frameUtil";

/**
 * 菜单
 */
export default class MenuPage extends DefineComponent {

    state = {
      filterOptions:[
        {
          title: '菜单编号',
          field: 'menu_id',
          component: Input,
          props: {
            allowClear: true,
          },
        },
        {
          title: '菜单名称',
          field: 'menu_name',
          component: Input,
        },
      ],
      columns:[
        {
          title: '菜单编号',
          field: 'menu_id',
        },
        {
          title: '上级菜单编号',
          field: 'parent_id',
        },
        {
          title: '菜单名称',
          field: 'menu_name',
        },
        {
          title: '菜单URL',
          field: 'menu_url',
        },
        {
          title: '菜单类型',
          field: 'menu_type',
        },
        {
          title: '排序号',
          field: 'order_num',
        },
        {
          title: '菜单按钮',
          field: 'menu_icon',
        },
        {
          title: '创建时间',
          field: 'create_time',
        },
        {
          title: '操作',
          field: 'op',
          width:100,
          render:() => {
            return <div className="op-box">
              <a>编辑</a>
              <a>删除</a>
            </div>;
          }
        },
      ],
    };

  getTableBtn(){
    return [
      {
        title:'新增',
        onClick:() => {
          openModal({
            options:[

            ]
          })
        },
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
          // btnOptions={this.getTableBtn()}
        />;
    }
}

function getFormOptions(isCreate){
  return [
    {
      title:'上级菜单',
      field:'parent_id',
      component:AfcTreeSelect,
      props:{
        options:this.props.menuTreeData,
      },
    },
    {
      title: '菜单编号',
      field: 'menu_id',
      component: FilterInput,
      props: {
        disabled: isRead || this.isEdit(),
      },
      required: true,
    },
    {
      title: '菜单名称',
      field: 'menu_name',
      component: FilterInput,
      props: {
        disabled: isRead,
      },
      required: true,
    },
    {
      title: '菜单类型',
      field: 'menu_type',
      component: 'select',
      props: {
        disabled: isRead,
        loadData: DbDic.getMenuTypeList,
      },
      required: true,
    },
  ];
}
