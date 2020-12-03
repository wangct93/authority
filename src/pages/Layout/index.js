import React, {PureComponent} from 'react';
import {Header} from '../../components';

import css from './index.less';
import {Button} from "antd";
import {random} from "@wangct/util";
import MenuPage from "../Menu";

export default class Layout extends PureComponent {
  render() {
    console.log(this.props);
    return <div className={css.container}>
      <Header />
      <div className={css.body}>
        {
          // this.props.children
        }
        <MenuPage />
      </div>
    </div>
  }
}
