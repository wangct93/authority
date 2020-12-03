import React  from 'react';
import css from './index.less';
import DefineComponent  from "../../components/DefineComponent";
import Input from "../../components/Input";
import Flex, {FlexItem} from "../../components/Flex";
import Table from "../../components/Table";
import Tree from "../../components/Tree";

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
          width: 200,
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
        },
      ],
    };


    render() {
        const { state } = this;
        return <Flex className={css.container}>
          <div className={css.tree_box}>
            <Tree />
          </div>
          <FlexItem>
            <Table
              columns={state.columns}
              filterOptions={state.filterOptions}
            />
          </FlexItem>
        </Flex>;
    }
}
