import React, {PureComponent} from 'react';
import { Tree,Input} from 'antd';
import {callFunc, getProps, toPromise, validateArray} from "wangct-util";

const {TreeNode} = Tree;

export default class WctTree extends PureComponent {

  state = {
    options:[],
    textField:'text',
    valueField:'value',
    childrenField:'children'
  };

  componentDidMount() {
    this.loadData();
  }

  loadData(){
    const {loadOptions} = getProps(this);
    if(!loadOptions){
      return;
    }
    toPromise(loadOptions).then(options => {
      validateArray(options);
      this.setState({
        options,
        allOptions:options
      });
    });
  }

  getTreeNodes(list = [],parent){
    return list.map((item) => {
      if (!item) {
        return null;
      }
      const {textFormatter,valueFormatter,textField,valueField,childrenField} = getProps(this);
      const childNodes = this.getTreeNodes(item[childrenField] || [],item);
      const title = textFormatter ? textFormatter(item[textField],item,parent) : item[textField];
      const value = valueFormatter ? valueFormatter(item[valueField],item,parent) : item[valueField];
      return <TreeNode title={title} key={value}>{childNodes}</TreeNode>
    });
  }

  inputChange = (e) => {
    const {value:inputValue} = e.target;
    callFunc(this.props.onCheck,[]);
    const {childrenField,textField,valueField,allOptions} = getProps(this);
    const isChecked = (item,func) => {
      if(func(item)){
        return true;
      }
      const children = item[childrenField] || [];
      return children.find(subItem => isChecked(subItem,func));
    };

    const getOptions = (options = []) => {
      return options.filter(item => {
        return isChecked(item,(item) => {
          const text = item[textField] + '';
          const value = item[valueField] + '';
          return text.includes(inputValue) || value.includes(inputValue);
        })
      }).map(item => ({
        ...item,
        [childrenField]:getOptions(item[childrenField] || [])
      }))
    };

    this.setState({
      options:inputValue ? getOptions(allOptions) : allOptions
    });
  };

  getOptions(){
    return getProps(this).options;
  }

  render() {
    const props = getProps(this);
    const options = this.getOptions();
    return <div>
      {
        props.showSearch && <Input.Search style={{ marginBottom: 8 }} placeholder="请输入节点名称" onChange={this.inputChange} />
      }
      {
        !!options.length && <Tree
          {...getProps(this,['options','realOptions','showSearch'])}
        >
          {this.getTreeNodes(options,null)}
        </Tree>
      }
    </div>;
  }
}
