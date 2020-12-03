/**
 * Created by wangct on 2019/1/19.
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PathToRegExp from 'path-to-regexp';
import {classNames, getProps} from "wangct-util";

export default @connect(({global}) => ({
  pathname:global.pathname,
  history:global.history
}))
class Link extends PureComponent {

  state = {
    activeName:'active'
  };

  onClick = () => {
    const {props} = this;
    props.history.push(props.to)
  };

  isActive(){
    const {to,pathname} = this.props;
    return PathToRegExp(to).test(pathname);
  }

  getClassName(){
    const props = getProps(this);
    return classNames(props.className,this.isActive() && props.activeName);
  }

  render() {
    return <a className={this.getClassName()} onClick={this.onClick}>{this.props.children}</a>
  }
}
