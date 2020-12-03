import React from 'react';

import './index.less';
import {Pagination} from 'antd';
import {connect} from 'react-redux';

import {callFunc, classNames, getProps, isDef} from 'wangct-util';

export default class PaginationCap extends React.PureComponent {
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
    return <div className="wct-pagination">
      <Pagination
        {...getProps(this)}
        onShowSizeChange={this.onChange}
        onChange={this.onChange}
      />
    </div>
  }
}
