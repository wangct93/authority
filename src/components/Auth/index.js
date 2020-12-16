/**
 * Created by wangct on 2018/11/3.
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {toAry} from "@wangct/util/lib/arrayUtil";

/**
 * 权限控制
 */
@connect(({user = {}}) => ({
  authMap:user.authMap
}))
export default class Auth extends PureComponent{
  check(){
    let {authMap = {},auth,or,and = auth,check} = this.props;
    if(check){
      return check(authMap);
    }
    and = toAry(and);
    or = toAry(or);
    console.log(and,or);
    const andBol = and.length === 0 || and.every(item => authMap[item]);
    const orBol = or.length === 0 || or.some(item => authMap[item]);
    return andBol && orBol;
  }

  getNoAuth(){
    const {noAuth:NoAuth = null} = this.props;
    return NoAuth && <NoAuth />;
  }

  render(){
    return this.check() ? this.props.children : this.getNoAuth();
  }
}

/**
 * 权限修饰器
 */
function auth(options = {}){
    return (Com) => {
      return (props) => {
        return <Auth {...options}>
          <Com {...props} />
        </Auth>
      };
    }
}

Auth.auth = auth;
