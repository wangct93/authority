import React, {PureComponent} from "react";
import './index.less';
import {getProps, callFunc, classNames, aryToObject, objMap, objFilter} from "wangct-util";
import DefineComponent from "../DefineComponent";
import {toAry} from "@wangct/util/lib/arrayUtil";
import {toStr} from "@wangct/util/lib/stringUtil";

/**
 * 表单
 */
export default class Form extends DefineComponent {
  state = {
    options:[],
    error:{},
    value:this.props.defaultValue
  };

  getValue(){
    return this.getProp('value') || {};
  }

  onFieldChange = (opt,fieldValue) => {
    const oldValue = this.getValue();
    const {formatter,field} = opt;
    if(formatter){
      fieldValue = formatter(fieldValue,oldValue[field]);
    }
    const value = {
      ...oldValue,
      [field]:fieldValue,
    };
    this.validator(value);
    this.onChange(value);
  };

  validator(value){
    let options = this.getOptions();
    if(value){
      options = options.filter((opt) => opt.field in value);
    }else{
      value = this.getValue();
    }
    const extError = validatorOptions(options,value);
    const error = objFilter({...this.state.error, ...extError,},value => !!value);
    this.setState({
      error,
    });
    return Object.keys(error).length ? Promise.reject(error) : Promise.resolve(value);
  }

  render(){
    const value = this.getValue();
    const props = getProps(this);
    return <div className={classNames('w-form',props.className)} style={props.style}>
      {
        this.getOptions().map(opt => {
          const {field,readOnly = props.readOnly,component:Com = 'div'} = opt;
          const {title} = opt;
          return <FormItem required={opt.required} title={title} key={field} error={this.state.error[field]}>
            <Com disabled={readOnly} title={title} value={value[field]} onChange={this.onFieldChange.bind(this,opt)} {...opt.props} />
          </FormItem>
        })
      }
    </div>;
  }
}

/**
 * 表单单项
 */
export class FormItem extends PureComponent{

  render(){
    const {props} = this;
    return <div className="w-form-line">
      <div className="w-form-label">
        {
          props.required && <span style={{color:'red'}}>*</span>
        }
        <span>{props.title}{props.sep === false ? '' : props.sep || '：'}</span>
      </div>
      <div className="w-form-value">
        {props.children}
      </div>
    </div>
  }
}


export function validatorOptions(options,data){
  const validators = aryToObject(options,'field',(opt) => {
    const {required,needRequiredValidator = true,component} = opt;
    const validatorAry = [opt.validator];
    if(required && needRequiredValidator){
      validatorAry.unshift((v) => {
        if(v === '' || toAry(v).length === 0){
          return opt.title + '不能为空';
        }
      });
    }
    if(component && component.validator){
      validatorAry.push(component.validator);
    }
    return (...args) => {
      return aryFindResult(validatorAry,(validFunc) => validFunc && validFunc(...args));
    };
  });
  const optTemp = aryToObject(options,'field');
  return objMap(validators,(value,key) => {
    const msg = value && value(data[key],key,data);
    if(!msg){
      return;
    }
    const target = optTemp[key];
    const title = target && target.title;
    return target.errorSkipTitle || toStr(msg).startsWith(title) ? msg : title + msg;
  });
}

/**
 * 获取数组中结果为true的一项，并返回结果
 * @param ary
 * @param func
 */
export function aryFindResult(ary,func){
  let result = null;
  toAry(ary).find((item,index) => {
    result = callFunc(func,item,index,ary);
    return !!result;
  });
  return result;
}
