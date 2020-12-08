
import React, {PureComponent} from 'react';
import {Icon, Select} from 'antd';

import {toPromise, validateArray, equal, getProps, callFunc, toArray} from "@wangct/util";
import DefineComponent from "../DefineComponent";
import {toAry} from "@wangct/util/lib/arrayUtil";
import {toStr} from "@wangct/util/lib/stringUtil";
import {isUndef} from "@wangct/util/lib/typeUtil";
import {classNames} from "@wangct/util/lib/util";


/**
 * 下拉框
 */
export default class FilterSelect extends DefineComponent {
  state = {
    options: [],
    allowClear: true,
    showSelectAll: true,
    dropdownRender: this.dropdownRender.bind(this),
    defaultValueIndex: 0,
  };

  componentDidMount() {
    this.initValue();
    this.loadOptions();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.checkParams(prevProps);
  }

  initValue() {
    const {initValue} = this.props;
    if (initValue !== false && util.isDef(initValue)) {
      this.onChange(initValue, null);
    }
  }

  checkParams(prevProps) {
    if (!util.equal(this.getParams(), this.getParams(prevProps)) || this.props.loadData !== prevProps.loadData) {
      const valueChanged = !strEqual(this.props.value, prevProps.value);
      const keep = this.props.keepOnEmptyParent && !isDef(this.getParent());
      this.loadOptions(keep ? true : valueChanged);
    }
  }

  checkAllChange = (checked, e) => {
    const options = this.getOptions().slice(0);
    const rows = checked ? options : [];
    this.onChange(rows.map((row) => row.value), rows);
  };

  dropdownRender(menu) {
    const props = getProps(this);
    if (props.showSelectAll && this.isMultiple()) {
      const value = toAry(this.getValue());
      const options = this.getOptions();
      const temp = aryToObject(value, (item) => item, () => 1);
      const checked = options.every((opt) => temp[opt.value]) && value.length;
      return <div onMouseDown={preventDefault}>
        <div style={{padding: '5px 10px', border: '1px solid #ddd'}}>
          <span style={{cursor: 'pointer'}} onClick={this.checkAllChange.bind(this, !checked)}>
            <Checkbox checked={checked} indeterminate={!checked && value.length}/>
            <span>全选</span>
          </span>
        </div>
        {menu}
      </div>;
    }
    return menu;
  }

  getParams(props = this.props) {
    return props.params;
  }

  loadOptions() {
    const params = this.getParams();
    toPromise(this.props.loadData,params).then((options) => {
      options = toAry(options).map((opt) => ({
        ...opt,
        value:toStr(opt.value),
      }));
      this.setState({
        options,
      });
      if(!this.getValue() && this.getProp('initValue') && options.length){
        const data = options[0];
        const key = data.value;
        if(this.isMultiple()){
          this.onChange([key],[data]);
        }else{
          this.onChange(key,data);
        }
      }
    });
  }

  getValue() {
    const value = this.getProp('value');
    if (isUndef(value)) {
      return undefined;
    }
    if (this.isMultiple()) {
      return toAry(value).map((item) => toStr(item));
    }
    return toStr(value);
  }

  isMultiple() {
    return this.props.mode === 'multiple';
  }

  filterOption(input, option) {
    return option.props.children.toLowerCase().includes(input.toLowerCase());
  }

  getFilterOption() {
    return this.props.showSearch ? this.filterOption : undefined;
  }

  getPlaceholder() {
    return this.props.disabled ? '' : this.getProp('placeholder');
  }

  render() {
    return <Select
      filterOption={this.getFilterOption()}
      placeholder={this.getPlaceholder()}
      {...this.props}
      value={this.getValue()}
      onChange={this.onChange}
      className={classNames('w-select',this.props.className)}
      ref={this.setTarget}
    >
      {
        this.getOptions().map((item) => {
          const {value} = item;
          if(value == null){
            return null;
          }
          return <Select.Option text={item.text} data={item} key={item.value}>{getText(this, item)}</Select.Option>;
        })
      }
    </Select>;
  }
}

/**
 * 下拉树选择
 */
export class TreeSelect extends DefineComponent {
  state = {};

  renderTreeSelectNode = (data) => {
    if (!data || data.length === 0) {
      return [];
    }
    return data.map(item => {
      if (item.sub_nodes && item.menu_type !== 3 && item.sub_nodes.length !== 0) {
        return (
          <TreeSelect.TreeNode title={item.menu_name} key={item.menu_id} value={item.menu_id} disabled={item.menu_id === -1}>
            {this.renderTreeSelectNode(item.sub_nodes)}
          </TreeSelect.TreeNode>
        );
      }
      else if (item.sub_nodes && item.menu_type !== 3 && item.sub_nodes.length === 0) {//如果是上级结点类型，但是该节点下没有子节点。
        return <TreeSelect.TreeNode title={item.menu_name} key={item.menu_id} value={item.menu_id} />
      }
      else {
        return null;
      }
    }).filter((item) => !!item);
  }

  render() {
    return <TreeSelect
      {...this.props}
      showSearch
      allowClear
      filterTreeNode={(str, node) => { return node.props.title.indexOf(str) > -1 }}
      placeholder="请选择上级菜单"
      treeDefaultExpandAll
      suffixIcon={<Icon type="caret-down" />}
    >{
      this.renderTreeSelectNode(this.getOptions())
    }
    </TreeSelect>;
  }
}
