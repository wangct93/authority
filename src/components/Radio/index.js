
import React, {PureComponent} from 'react';
import {Radio} from 'antd';
import {toPromise, callFunc, equal, validateArray, getProps} from "wangct-util";
import {getItemText, getItemValue} from "../common/util";


const RadioGroup = Radio.Group;

export default class QueryRadio extends PureComponent {

  state = {
    value:this.props.defaultValue,
    loadEndDefaultSelected:true,
    textField:'text',
    valueField:'value'
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
    return props.params;
  }

  loadData(){
    const {loadData} = this.props;
    if(!loadData){
      return;
    }
    toPromise(loadData,this.getParams()).then((data) => {
      validateArray(data);
      this.setState({
        options:data
      });
      const props = getProps(this);
      if(props.loadEndDefaultSelected){
        this.onChange({target:{value:getItemValue(this,data[0])}})
      }
    })
  }

  onChange = (e) => {
    const {value} = e.target;
    this.setState({
      value
    });
    callFunc(this.props.onChange,value);
  };

  getOptions(){
    return getProps(this).options || []
  }

  getGroupProps(){
    return getProps(this,['options','loadData','textField','valueField','loadEndDefaultSelected']);
  }

  render(){
    return <RadioGroup {...this.getGroupProps()} onChange={this.onChange}>
      {
        this.getOptions().map(opt => {
          const value = getItemValue(this,opt);
          const text = getItemText(this,opt);
          return <Radio value={value} key={value}>{text}</Radio>
        })
      }
    </RadioGroup>
  }
}
