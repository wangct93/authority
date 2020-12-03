
import React, {PureComponent} from 'react';
import { Input} from 'antd';

import {getProps,callFunc} from "wangct-util";


export default class InputCap extends PureComponent {

  state = {
    placeholder: '请输入' + (this.props.title || ''),
    allowClear:true
  };

  onChange = (e) => {
    callFunc(this.props.onChange,this.formatValue(e.target.value));
  };

  formatValue(value){
    const props = getProps(this);
    const {formatter} = props;
    return formatter ? formatter(value,props.value,this) : value;
  }

  getInputProps(){
    return getProps(this,['format','title']);
  }

  render(){
    return <Input {...this.getInputProps()} onChange={this.onChange} />
  }
}
