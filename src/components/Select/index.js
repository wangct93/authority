
import React, {PureComponent} from 'react';
import {  Select} from 'antd';

import {toPromise, validateArray, equal, getProps, callFunc, toArray} from "wangct-util";
import {getItemText, getItemValue} from "../common/util";

export class QuerySelect extends PureComponent {
  state = {
    options:[],
    allowClear:true,
    placeholder:'请选择' + (this.props.title || ''),
    value:this.props.defaultValue,
    loadEndDefaultSelected:true
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    this.checkParams(prevProps);
  }

  checkParams(prevProps){
    if(!equal(this.getParams(),this.getParams(prevProps)) || this.props.loadData !== prevProps.loadData){
      this.loadData();
    }
  }

  getParams(props = this.props){
    return props.params
  }

  loadData(){
    const {loadData} = this.props;
    if(!loadData){
      return;
    }
    toPromise(loadData,this.getParams()).then((data) => {
      validateArray(data);
      const {valueField} = getProps(this);
      data = data.map(item => {
        return {
          ...item,
          [valueField]:getItemValue(this,item) + ''
        }
      });
      this.setState({
        options:data
      });
      const props = getProps(this);
      if(props.loadEndDefaultSelected){
        this.onChange(getItemValue(this,data[0]))
      }
    });
  }

  isMultiple(){
    return this.props.mode === 'multiple';
  }

  onChange = (key,opt) => {
    key = this.isMultiple() ? toArray(key) : key;
    opt = this.isMultiple() ? toArray(opt) : opt;
    callFunc(this.props.onChange,key,opt);
    this.setState({
      value:key
    })
  };

  getOptions(){
    return getProps(this).options || [];
  }

  formatText(text,item){
    const {textFormatter} = getProps(this);
    return textFormatter ? textFormatter(text,item) : text;
  }

  getSelectProps(){
    return getProps(this,['title','loadData','textField','valueField','loadEndDefaultSelected'])
  }

  render(){
    return <Select
      {...this.getSelectProps()}
      onChange={this.onChange}
    >
      {
        this.getOptions().map(item => {

          return <Select.Option data={item} key={getItemValue(this,item)}>{this.formatText(getItemText(this,item),item)}</Select.Option>
        })
      }
    </Select>
  }
}
