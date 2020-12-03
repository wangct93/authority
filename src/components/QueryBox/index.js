
import React, {PureComponent} from 'react';


import css from './index.less';
import {Checkbox,Form} from "antd";
import {
  aryToObject,
  callFunc,
  classNames,
  getProps,
  isDef,
  isFunc,
  isString,
  objFilter, objMap,
  objSome,
  toNum
} from 'wangct-util';

const ErrorFormItem = Form.Item;

export default class QueryBox extends PureComponent {
  state = {
    value:{},
    error:{},
    itemWidth:'33.33%'
  };

  onChange = (key,keyValue) => {
    let extValue = key === 'multiple' ? keyValue : {[key]:keyValue};
    const options = this.getOptions().filter(opt => isDef(extValue[opt.field]));
    this.validate(options);
    extValue = this.formatValue(extValue,options);
    const value = {
      ...this.getValue(),
      ...extValue
    };
    this.setState({
      value
    });
    callFunc(this.props.onChange,value,key,keyValue);
    options.forEach(opt => {
      callFunc(opt.onChange,value[opt.field],value);
    });
  };

  formatValue(value,options){
    const values = this.getValue();
    return objMap(value,(value,key) => {
      const target = options.find(opt => opt.field === key);
      return target && target.formatter ? target.formatter(value,values[key]) : value;
    })
  }

  getValue(){
    return getProps(this).value || {}
  }

  getOptions(){
    return this.props.options || []
  }

  getCheckedField(item){
    const field = isString(item) ? item : item.field;
    return field + '_checked';
  }

  getCheckedValue(){
    const value = this.getValue();
    const props = getProps(this);
    const {options} = getProps(this);
    const hasChecks = aryToObject(options,'field',({hasCheck = props.hasCheck}) => hasCheck);
    return objFilter(value,(value,key,obj) => {
      return (!hasChecks[key] || obj[this.getCheckedField(key)]) && value !== '';
    });
  }

  async validate(options = this.getOptions()){
    const value = objFilter(this.getCheckedValue(),(value,key) => {
      return options.find(item => item.field === key);
    });
    const {validable} = this.props;
    if(!validable){
      return value;
    }
    const error = validatorOptions(options,value);
    this.setState({
      error:{
        ...this.state.error,
        ...error
      }
    });
    if(objSome(error,(value) => !!value)){
      throw error;
    }
    return value;
  }

  getBtnWidth(){
    const props = getProps(this);
    const options = this.getOptions();
    let prefixWidth = 0;
    options.forEach(opt => {
      const {width = props.itemWidth} = opt;
      const widthNum = toNum(width);
      prefixWidth += widthNum;
      if(prefixWidth > 100){
        prefixWidth = widthNum;
      }
    });
    const btnWidth = 100 - prefixWidth;
    return btnWidth > 10 ? btnWidth + '%' : '100%';
  }

  render(){
    const value = this.getValue();
    const props = getProps(this);
    const {error} = props;
    return <div className={classNames(props.validable && 'wct-query-box-validate','wct-query-box','wct-form-box')}>
      {
        this.getOptions().map(item => {
          const {field,component:Com,width = props.itemWidth,hasCheck = props.hasCheck,parent} = item;
          let {props:itemProps = {}} = item;
          const checkField = this.getCheckedField(item);
          const checked = hasCheck ? value[checkField] : true;
          if(parent){
            itemProps = {
              ...itemProps,
              params:{
                ...itemProps.params,
                parent:value[parent]
              }
            }
          }
          return <FormItem error={error[field]} hasCheck={hasCheck} required={item.required} onCheckChange={this.onChange.bind(this,checkField)} checked={checked} style={{width}} key={field} title={item.title}>
            {
              <Com title={item.title} disabled={!checked} value={value[field]} onChange={this.onChange.bind(this,field)} {...itemProps} />
            }
          </FormItem>
        })
      }
      <div className="wct-query-btn-box" style={{width:this.getBtnWidth()}}>
        {props.btn}
      </div>
    </div>
  }
}

class FormItem extends PureComponent {

  checkChange = (e) => {
    callFunc(this.props.onCheckChange,e.target.checked);
  };

  getTitle(){
    const {required,title} = getProps(this);
    return <span>
      {
        required ? <span style={{color:'red'}}>*</span> : ''
      }
      <span>{title}：</span>
    </span>
  }

  getValidateStatus(){
    return this.getHelp() ? 'error' : 'success';
  }

  getHelp(){
    const props = getProps(this);
    return !props.hasCheck || props.checked ? props.error : '';
  }

  render(){
    const props = getProps(this);
    return <div className="wct-form-item" style={props.style}>
      <div className="wct-form-label">
        {
          props.hasCheck ? <Checkbox checked={props.checked} onChange={this.checkChange}>{this.getTitle()}</Checkbox> : this.getTitle()
        }
      </div>
      <div className="wct-form-value">
        <ErrorFormItem validateStatus={this.getValidateStatus()} help={this.getHelp()}>{props.children}</ErrorFormItem>
      </div>
    </div>
  }
}



export function formValidator(validator,data){
  return objMap(validator,(value,key) => callFunc(value,data[key],key,data));
}

export function validatorOptions(options,data){
  const validators = {};
  options.forEach((opt) => {
    const {required} = opt;
    let {validator} = opt;
    if(required && !validator){
      validator = (v) => v || v === 0 ? '' : `${opt.title}不能为空`;
    }
    validators[opt.field] = validator;
  });
  return formValidator(validators,data);
}
