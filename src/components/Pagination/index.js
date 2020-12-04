import React from 'react';
import './index.less';
import {Pagination as PaginationMod} from 'antd';
import {callFunc, classNames, getProps, isDef} from '@wangct/util';
import DefineComponent from "../DefineComponent";

/**
 * 分页
 */
export default class Pagination extends DefineComponent {
  state = {
    current:1,
    pageSize:20,
    total:0,
    pageSizeOptions:['10','20','50','100','1000'],
    showQuickJumper:true,
    showSizeChanger:true,
    // hideOnSinglePage:true,
    showTotal:(total,range) => `当前显示第 ${range[0]} - ${range[1]} 条，总共 ${total} 条`
  };

  onChange = (num,size) => {
    this.setState({
      current:num,
      pageSize:size
    });
    callFunc(this.props.onChange,num,size);
  };

  render(){
    const props = getProps(this);
    return <PaginationMod
      {...props}
      className={classNames('w-pagination',props.className)}
      onShowSizeChange={this.onChange}
      onChange={this.onChange}
    />;
  }
}
