import React from 'react';
import { Tree as BaseTree} from 'antd';
import { getProps} from "@wangct/util";
import DefineComponent from "../DefineComponent";
import {toAry} from "@wangct/util/lib/arrayUtil";

const {TreeNode} = BaseTree;

/**
 * 树
 */
export default class Tree extends DefineComponent {

  state = {
    options:[],
    textField:'text',
    valueField:'value',
    childrenField:'children'
  };


  getTreeNodes(list,parent = null){
    return toAry(list).map((item) => {
      if (!item) {
        return null;
      }
      const textFormatter = this.getProp('textFormatter');
      const valueFormatter = this.getProp('valueFormatter');
      const textField = this.getProp('textField');
      const valueField = this.getProp('valueField');
      const childrenField = this.getProp('childrenField');
      const childNodes = this.getTreeNodes(item[childrenField],item);
      const title = textFormatter ? textFormatter(item[textField],item,parent) : item[textField];
      const value = valueFormatter ? valueFormatter(item[valueField],item,parent) : item[valueField];
      return <TreeNode title={title} key={value}>{childNodes}</TreeNode>;
    });
  }

  render() {
    const options = this.getOptions();
    return <BaseTree
      {...getProps(this)}
    >
      {this.getTreeNodes(options)}
    </BaseTree>;
  }
}
