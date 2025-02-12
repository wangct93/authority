import DefineComponent from "../DefineComponent";
import React from "react";
import {aryToObject, classNames, random, toAry, toNum, toStr} from "@wangct/util";
import Form from "../Form";
import BtnList from "../BtnList";
import {getProps, isFunc, objFind, showLoading, toPromise} from "@wangct/util";
import {message, Pagination} from "antd";
import {alertSucInfo} from "../../utils/frameUtil";

const columns = [
  {
    title:'标题1',
    field:random(),
  },
  {
    title:'标题2',
    field:random(),
  },
  {
    title:'标题3',
    field:random(),
  },
  {
    title:'标题4',
    field:random(),
    width:500,
  },
  {
    title:'标题5',
    field:random(),
    width:500,
  },
  {
    title:'标题6',
    field:random(),
    width:500,
  },
  {
    title:'标题7',
    field:random(),
    width:500,
  },
];


/**
 * 表格组件
 * @author wangchuitong
 */
export default class Table extends DefineComponent {
  state = {
    columns,
    data:getTestData(columns),
    hasScroll:false,
    fontSize:14,
  };

  componentDidMount() {
    this.checkScroll();
    this.initFontSize();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.checkScroll();
  }

  checkScroll(){
    const hasScroll = this.hasScroll();
    if(hasScroll !== this.state.hasScroll){
      this.setState({
        hasScroll,
      });
    }
  }

  initFontSize(){
    this.setState({
      fontSize:toNum(getComputedStyle(this.getElem()).fontSize),
    });
  }


  hasScroll(){
    const bodyElem = this.getElem().querySelector('.w-table-body');
    const tableElem = bodyElem && bodyElem.children[0];
    if(!tableElem){
      return false;
    }
    return tableElem.getBoundingClientRect().height > bodyElem.getBoundingClientRect().height;
  }

  getColumns(){
    return toAry(this.getProp('columns'));
  }

  getData(){
    return toAry(this.getProp('data'));
  }

  getTdStyle(col){
    const style = {};
    const width = this.getColWidth(col);
    if(width){
      style.flex = `1 0 ${getCssValue(width)}`;
    }
    return style;
  }

  isFit(){
    return this.getProp('fit');
  }

  doTest = () => {
    return;
    this.setState({
      data:getTestData(this.state.columns,Math.floor(Math.random() * 40)),
    });
  };

  bodyScroll = (e) => {
    const {target} = e;
    const header = this.getElem().querySelector('.w-table-tr');
    header.scrollLeft = target.scrollLeft;
  };

  getColWidth(col){
    const {title,width} = col;
    return width ? width : toStr(title).length * this.getFontSize() + 20;
  }

  getFontSize(){
    return this.getProp('fontSize') || 14;
  }

  render() {
    const columns = this.getColumns();
    const {state} = this;
    return <div onClick={this.doTest} ref={this.setElem} className={classNames('w-table',this.isFit() && 'w-table-fit',state.hasScroll && 'w-table-scroll')}>
      <div className="w-table-header">
        <div className="w-table-tr">
          {
            columns.map((col,index) => {
              return <div style={this.getTdStyle(col)} className="w-table-td w-table-header-td" key={index}>{col.title}</div>;
            })
          }
        </div>
      </div>
      <div onScroll={this.bodyScroll} className="w-table-body">
        <div className="w-table-content">
          {
            this.getData().map((row,rowIndex) => {
              return <div className="w-table-tr" key={rowIndex}>
                {
                  columns.map((col,index) => {
                    const {render} = col;
                    let value = row[col.field];
                    value = render ? render(value,row,index) : value;
                    return <div style={this.getTdStyle(col)} className="w-table-td" key={index}>{value}</div>;
                  })
                }
              </div>
            })
          }
        </div>
      </div>
    </div>;
  }
}

function getTestData(columns,length = 10){
  return new Array(length).fill(1).map((a,index) => {
    return aryToObject(columns,'field',(item) => item.title);
  });
}

/**
 * 获取css值
 * @author wangchuitong
 */
function getCssValue(value){
  value = toStr(value);
  return value.includes('%') ? value : value + 'px';
}

/**
 * 查询表格
 */
export class TableSearch extends DefineComponent {

  state = {
    pageNumField:'page_num',
    pageSizeField:'page_size',
    totalField:'total',
    dataField:'list',
    fit:true,
    pagination:{
      current:1,
      pageSize:20,
      total:0,
      pageSizeOptions:['10','20','50','100','1000'],
      showQuickJumper:true,
      showSizeChanger:true,
      ...this.props.defaultPagination,
    },
  };

  componentDidMount() {
    this.initSearch();
  }

  initSearch(){
    if(this.props.defaultSearch){
      this.doSearch();
    }
  }

  getBtnOptions(){
    const {btnOptions = ['search','reset']} = this.props;
    const mapData = {
      search:{
        title:'查询',
        onClick:this.doSearch,
        type:'primary',
        auth:this.getProp('searchAuth'),
      },
      reset:{
        title:'重置',
        onClick:this.doReset,
        type:'primary',
        auth:this.getProp('resetAuth'),
      },
    };
    return toAry(btnOptions).map((opt) => {
      return mapData[opt] || opt;
    });
  }

  getPageParams(pageNum,pageSize){
    return {
      [this.getProp('pageNumField')]:pageNum,
      [this.getProp('pageSizeField')]:pageSize
    };
  }

  doSearch = (extParams = {}) => {
    this.getForm().validator().then((params) => {
      params = {
        ...params,
        ...extParams,
      };
      const {beforeLoad} = this.props;
      const pagination = this.getProp('pagination');
      params = beforeLoad ? beforeLoad(params) : params;
      if(!params){
        return;
      }
      this.pageChange(1,pagination.pageSize,params);
    }).catch((err) => {
      const msg = objFind(err,value => !!value);
      message.error(toStr(msg));
    });
  };

  doReload = () => {
    return this.loadData();
  };

  doReset = () => {
    this.setState({
      data:[],
    });
    this.formChange({});
    this.updatePagination({
      total:0,
    });
  };

  updatePagination(pagination){
    this.setState({
      pagination:{
        ...this.getPagination(),
        ...pagination,
      },
    });
  }

  getPagination(){
    return this.getProp('pagination');
  }

  pageChange = (pageNum,pageSize,params = this.state.oldParams) => {
    this.updatePagination({
      current:pageNum,
      pageSize,
    });
    this.loadData({
      ...params,
      ...this.getPageParams(pageNum,pageSize)
    });
  };

  loadData(params = this.state.oldParams){
    toPromise(this.props.loadData,params).then((data = {}) => {
      const {afterLoad} = this.props;
      const pagination = this.getPagination();
      const {current,pageSize} = pagination;
      data = isFunc(afterLoad) ? afterLoad(data) : data;
      const total = data[this.getProp('totalField')];
      const list = data[this.getProp('dataField')];
      const maxPage = Math.ceil(total / pageSize);
      if(current > maxPage && maxPage){
        this.pageChange(maxPage,pageSize);
      }else{
        this.setState({
          oldParams:params,
          data:list,
        });
        this.updatePagination({
          total,
        });
        if(this.getProp('alertInfo') !== false){
          alertSucInfo(`查询到${total}条数据`);
        }
      }
    });
  }

  isFit(){
    return this.getProp('fit');
  }

  hasPagin(){
    return toNum(this.getPagination().total) > 0;
  }

  render() {
    return <div className={classNames('w-table-search',this.isFit() && 'w-table-search-fit')}>
      <div className="w-header">
        <Form className="w-table-form" itemWidth="50%" ref={this.setForm} options={this.props.filterOptions} value={this.getFormValue()} onChange={this.formChange} />
        <BtnList options={this.getBtnOptions()} />
      </div>
      <div className="w-body">
        <Table
          columns={this.getColumns()}
          data={this.getData()}
          fit={this.isFit()}
        />
      </div>
      <div className="w-footer">
        {
          this.hasPagin() && <Pagination {...this.getPagination()} onChange={this.pageChange} onShowSizeChange={this.pageChange} />
        }
      </div>
    </div>
  }
}

Table.Search = TableSearch;
