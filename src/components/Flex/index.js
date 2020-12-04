import React from 'react';
import css from './index.less';
import {classNames} from "@wangct/util/lib/util";
import DefineComponent from "../DefineComponent";

/**
 * 布局元素
 * @author wangchuitong
 */
export default class Flex extends DefineComponent {

  state = {
  };

  render() {
    const {props} = this;
    return <div className={classNames('w-flex',props.className,props.column && 'w-flex-column')} style={props.style}>{props.children}</div>;
  }
}

/**
 * 自适应元素
 * @author wangchuitong
 */
export class FlexItem extends DefineComponent {
  state = {};

  render() {
    const {props} = this;
    return <div className={classNames('w-flex-item',props.className)} style={props.style}>{props.children}</div>;
  }
}

Flex.Item = FlexItem;
