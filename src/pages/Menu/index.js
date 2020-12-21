import React  from 'react';
import DefineComponent  from "../../components/DefineComponent";
import Input from "../../components/Input";
import {TableSearch} from "../../components/Table";
import {alertSucInfo, openModal} from "../../utils/frameUtil";
import {TreeSelect} from "../../components/Select";
import {menuCreate, menuDelete, menuNodeSearch, menuSearch, menuTreeSearch, menuUpdate} from "../../services/menu";
import {colTimeWidth} from "../../utils/columns";
import css from './index.less';
import {auths} from "../../json/auths";
import Auth from "../../components/Auth";
import Flex, {FlexItem} from "../../components/Flex";
import Tree from "../../components/Tree";
import {Icon} from "antd";
import {toAry} from '@wangct/util';

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
            <Auth auth={auths.menuUpdate}>
              <a onClick={this.doUpdate.bind(this, row)}>编辑</a>
            </Auth>
            <Auth auth={auths.menuDelete}>
              <a onClick={this.doDelete.bind(this, row)}>删除</a>
            </Auth>
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
        auth:auths.menuCreate,
      },
      {
        title:'查询',
        onClick:this.doSearch,
        auth:auths.menuSearch,
      },
      'reset',
    ];
  }

  doSearch = () => {
    this.searchMode = SearchMode.search;
    this.setSelectedKey(null);
    this.tableSearch();
  };

  treeSelect = (keys,e) => {
    const key = e.node.props.data.value;
    this.searchMode = SearchMode.node;
    this.tableSearch({parent:key});
    this.setSelectedKey(key);
  };

  loadData = (params) => {
    const func = this.searchMode === SearchMode.node ? menuNodeSearch : menuSearch;
    return func(params);
  };

  render() {
    const {state} = this;
    return <Flex className={css.container}>
      <Left onChange={this.treeSelect} value={this.getSelectedKey()} />
      <FlexItem>
        <TableSearch
          columns={state.columns}
          filterOptions={state.filterOptions}
          btnOptions={this.getTableBtn()}
          loadData={this.loadData}
          ref={this.setTable}
          searchAuth={auths.menuSearch}
          defaultSearch
        />
      </FlexItem>
    </Flex>;
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

/**
 * 左侧树
  */
class Left extends DefineComponent {
  render() {
    return <Flex column className={css.left_box}>
      <div className={css.header}>
        <Icon type="appstore" />
        菜单树
      </div>
      <FlexItem className={css.tree_box}>
        <Tree selectedKeys={this.getValue()} onSelect={this.onChange} loadData={menuTreeSearch} />
      </FlexItem>
    </Flex>
  }
}

/**
 * 查询模式
 * @type {{node: string, search: string}}
 */
const SearchMode = {
  node:'1',
  search:'2',
};
