import {getProps} from 'wangct-util';


export function getItemText(target,item){
  return item && item[getProps(target).textField];
}

export function getItemValue(target,item){
  return item && item[getProps(target).valueField];
}
