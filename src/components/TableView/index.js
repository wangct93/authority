import React from 'react';
import './index.less';
import {Button, message} from "antd";
import Table from "../Table";
import QueryBox from "../QueryBox";
import Pagination from '../Pagination';
import {
  showLoading,
  getProps,
  isString,
  isDef,
  callFunc,
  isFunc, classNames, isObject, aryToObject, toPromise, proParse, objFind
} from 'wangct-util';

export default class TableView extends React.PureComponent{

  state = {
    filterOptions:[],
    pagination:{
      current:1,
      pageSize:20,
      total:330,
      pageSizeOptions:['10','20','50','100','1000'],
      ...this.props.pagination
    },
    bordered:true,
    fitHeight:true,
    pageNumField:'pageNum',
    pageSizeField:'pageSize'
  };

  initFilterValues(value){
    proParse(value).then(parseValue => {
      this.setState({
        filterValues:parseValue,
        defaultFilterValues:parseValue
      })
    })
  }

  filterChange = (value) => {
    this.setState({
      filterValues:value
    })
  };

  loadData(params){
    showLoading(close => {
      toPromise(this.props.loadData,params).finally(close).then(data => {
        const {afterLoad,pagination} = getProps(this);
        const {current,pageSize} = pagination;
        data = isFunc(afterLoad) ? afterLoad(data) : data;
        const {total = 0,list = []} = data;
        const maxPage = Math.ceil(total / pageSize);
        if(current > maxPage && maxPage){
          this.pageChange(maxPage,pageSize);
        }else{
          this.setState({
            oldParams:params,
            dataSource:list,
            pagination:{
              ...pagination,
              total,
            }
          });
        }
      });
    },'正在查询中，请稍候...');
  }

  doSearch = () => {
    this.filterTarget.validate().then(params => {
      const {beforeLoad,pagination} = getProps(this);
      const queryParams = isFunc(beforeLoad) ? beforeLoad(params) : params;
      if(!queryParams){
        return;
      }
      this.setState({
        pagination:{
          ...pagination,
          current:1
        }
      });
      this.loadData({
        ...queryParams,
        ...this.getPageParams(1,pagination.pageSize)
      });
    }).catch(err => {
      const {validable} = getProps(this);
      if(!validable){
        const target = objFind(err,value => !!value);
        message.info(target);
      }
    })
  };

  doReset = (e) => {
    const props = getProps(this);
    this.setState({
      filterValues:props.defaultFilterValue,
      dataSource:[],
      pagination:{
        ...props.pagination,
        total:0
      }
    });
    callFunc(props.onReset,e,this);
  };

  pageChange = (pageNum,pageSize,noLoadData) => {
    const {pagination} = getProps(this);
    this.setState({
      pagination:{
        ...pagination,
        current:pageNum,
        pageSize
      }
    });
    if(!noLoadData){
      this.loadData({
        ...this.state.oldParams,
        ...this.getPageParams(pageNum,pageSize)
      });
    }
  };

  getPageParams(pageNum,pageSize){
    const {pageNumField,pageSizeField} = getProps(this);
    return {
      [pageNumField]:pageNum,
      [pageSizeField]:pageSize
    }
  }

  getSearchBtn = () => {
    return <Button type="primary" onClick={this.doSearch}>查询</Button>;
  };

  getResetBtn = () => {
    return <Button type="primary" onClick={this.doReset}>重置</Button>;
  };

  getBtnItem(item){
    if(React.isValidElement(item)){
      return item;
    }
    if(isString(item)){
      const btns = {
        search:this.getSearchBtn,
        reset:this.getResetBtn,
      };
      return callFunc(btns[item]) || item;
    }
    if(isObject(item) && item.title && item.onClick){
      return <Button type="primary" onClick={item.onClick}>{item.title}</Button>;
    }
  }

  getBtn(){
    const {btn} = this.props;
    const btnList = callFunc(btn) || btn || ['search','reset'];
    const content = React.isValidElement(btnList) ? btnList : btnList.map((item,index) => <React.Fragment key={index}>{this.getBtnItem(item)}</React.Fragment>);
    return <div className="wct-filter-btn-box">{content}</div>
  }

  setFilter = (ref) => {
    this.filterTarget = ref;
  };

  rowClassName = (row,index) => {
    const {selectedKey,rowClassName,rowKey = 'key'} = getProps(this);
    return classNames(isDef(selectedKey) && row[rowKey] === selectedKey && 'selected',callFunc(rowClassName,row,index) || rowClassName)
  };

  getTableContent = () => {
    return <div className="wct-table-view-content">
      <Table
        {...getProps(this,['filterOptions','oldParams','filterValues','className'])}
        rowClassName={this.rowClassName}
        pagination={false}
      />
      <Pagination {...getProps(this).pagination} onChange={this.pageChange} />
    </div>;
  };

  getContent(){
    const {content} = this.props;
    return content ? content(this.getTableContent) : this.getTableContent();
  }

  render() {
    const props = getProps(this);
    const {fitHeight = true} = props;
    return <div className={classNames('wct-table-view',props.className,fitHeight && 'wct-table-view-fit')} style={props.style}>
      <QueryBox ref={this.setFilter} validable={props.validable} btn={this.getBtn()} value={props.filterValues} onChange={this.filterChange} options={props.filterOptions} />
      {this.getContent()}
    </div>
  }
}
