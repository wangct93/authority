import React from 'react';
import { Input as BaseInput} from 'antd';
import {toStr} from "@wangct/util/lib/stringUtil";
import DefineComponent from "../DefineComponent";

/**
 * 输入框
 */
export default class Input extends DefineComponent {

  state = {
    placeholder: '请输入' + toStr(this.props.title),
    allowClear:true,
  };

  render(){
    return <BaseInput {...this.getProps()} onChange={this.onChange} />
  }
}
