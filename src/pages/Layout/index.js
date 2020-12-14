import React from 'react';
import css from './index.less';
import Flex, {FlexItem} from "../../components/Flex";
import DefineComponent from "../../components/DefineComponent";
import DateView from "../../components/DateView";
import {getPathname, pathMatch, pathTo, reduxConnect} from "../../frame";
import {classNames} from "@wangct/util/lib/util";

/**
 * 布局
 */
export default class Layout extends DefineComponent {
  render() {
    return <Flex column className={css.container}>
      <Header />
      <FlexItem>
        {
          this.props.children
        }
      </FlexItem>
    </Flex>
  }
}

/**
 * 头部
 */
class Header extends DefineComponent {
  render() {
    return <Flex className={css.header}>
      <MenuList />
      <FlexItem />
      <DateView />
    </Flex>
  }
}

/**
 * 菜单列表
 */
@reduxConnect(() => ({
  pathname:getPathname(),
}))
class MenuList extends DefineComponent {
  state = {
    options:[
      {
        title:'菜单管理',
        path:'/menu',
      },
      {
        title:'角色管理',
        path:'/role',
      },
      {
        title:'用户管理',
        path:'/user',
      },
      {
        title:'部门管理',
        path:'/dept',
      },
    ]
  };

  onClick = (opt) => {
    pathTo(opt.path);
  };

  render() {
    return <Flex className={css.menu_list}>
      {
        this.getOptions().map((opt,index) => {
          const active = pathMatch(opt.path,this.props.pathname);
          return <div onClick={this.onClick.bind(this,opt)} key={index} className={classNames(css.menu_item,active && css.active)}>{opt.title}</div>
        })
      }
    </Flex>
  }
}
