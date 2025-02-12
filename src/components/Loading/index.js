import React from 'react';
import {Spin} from 'antd';

import './index.less';
import DefineComponent from "../DefineComponent";
import {classNames, getProps} from "@wangct/util";

/**
 * 加载中组件
 */
export default class Loading extends DefineComponent {

  state = {
    global:true,
  };

  isGlobal(){
    return this.getProp('global');
  }

  render() {
    const {props} = this;
    return props.loading ? <div className={classNames('w-loading',this.isGlobal() && 'w-loading-global')}>
      <div className="w-loading-content">
        <Spin size="large" spinning tip={props.title} />
      </div>
    </div> : null
  }
}
