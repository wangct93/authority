import React from 'react';
import {Button} from 'antd';
import {getProps, toPromise} from "wangct-util";
import DefineComponent from "../DefineComponent";

/**
 * 按钮
 */
export default class Btn extends DefineComponent{

  state = {
    loading:false,
  };

  onClick = (e) => {
    this.setState({
      loading:true
    });
    toPromise(this.props.onClick,e).finally(() => {
      this.setState({
        loading:false
      });
    });
  };

  render() {
    return <Button {...getProps(this)} onClick={this.onClick} />;
  }
}
