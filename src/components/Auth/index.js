/**
 * Created by wangct on 2018/11/3.
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

export default @connect(({user = {}}) => ({
  auths:user.auths
}))
class Auth extends PureComponent{
  check(){
    const {auths = [],or,and,check} = this.props;
    return check ? check(auths) : (!and || and.every(item => auths.includes(item))) && (!or || or.some(item => auths.includes(item)));
  }

  getNoAuth(){
    const {noAuth:NoAuth = null} = this.props;
    return NoAuth && <NoAuth />;
  }

  render(){
    return this.check() ? this.props.children : this.getNoAuth()
  }
}

Auth.auth = (option) => (Com) => {
  return (props) => <Auth {...option}>
    <Com {...props} />
  </Auth>
};
