import React, {PureComponent} from 'react';
import {Modal} from 'antd';
import {getProps, callFunc, classNames} from "wangct-util";
import './index.less';

export default class WctModal extends PureComponent {

  state = {
    maskClosable:false
  };

  onOk = (...args) => {
    this.setState({
      confirmLoading:true
    });
    Promise.resolve(callFunc(this.props.onOk,...args)).finally(() => {
      this.setState({
        confirmLoading:false
      })
    });
  };

  render() {
    return <Modal
      {...getProps(this,['children'])}
      wrapClassName={classNames('wct-modal-wrap',this.props.wrapClassName)}
      onOk={this.onOk}
    >
      <div className="wct-modal-content" style={{maxHeight:window.innerHeight - 300}}>{this.props.children}</div>
    </Modal>
  }
}
