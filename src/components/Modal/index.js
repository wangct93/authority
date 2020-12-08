import React from 'react';
import {Modal as ModalMod} from 'antd';
import {getProps, callFunc, classNames} from "@wangct/util";
import './index.less';
import DefineComponent from "../DefineComponent";
import {toPromise} from "@wangct/util/lib/promiseUtil";

/**
 * 弹窗
 */
export default class Modal extends DefineComponent {

  state = {
    maskClosable:true,
  };

  onOk = (...args) => {
    this.setState({
      confirmLoading:true
    });
    return toPromise(this.props.onOk,...args).finally(() => {
      this.setState({
        confirmLoading:false
      });
    });
  };

  render() {
    const props = getProps(this);
    return <ModalMod
      {...props}
      wrapClassName={classNames('w-modal',this.props.wrapClassName)}
      onOk={props.onOk && this.onOk}
    >
      this.props.children
    </ModalMod>
  }
}
