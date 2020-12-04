import React, {PureComponent} from 'react';
import {Header} from '../../components';

import css from './index.less';
import {Button} from "antd";
import {pathTo, reduxConnect} from "wangct-react-entry";
import {random} from "@wangct/util";

@reduxConnect(({global}) => (({
  global,
})))
export default class Layout extends PureComponent {
  render() {
    return <div className={css.container}>
      <Header />
      <div className={css.body}>
        {
          this.props.children
        }
      </div>
    </div>
  }
}
