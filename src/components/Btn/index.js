import React from 'react';
import {Button} from 'antd';
import {getProps, toPromise} from "@wangct/util";
import DefineComponent from "../DefineComponent";
import Auth from "../Auth";
import {isObj, isStr} from "@wangct/util/lib/typeUtil";

/**
 * 按钮
 */
export default class Btn extends DefineComponent{

  state = {
    loading:false,
  };

  onClick = (e) => {
    this.setState({
      loading:true
    });
    toPromise(this.props.onClick,e).finally(() => {
      this.setState({
        loading:false
      });
    });
  };

  getAuth(){
    const auth = this.getProp('auth');
    if(isStr(auth)){
      return {
        and:auth,
      };
    }
    if(isObj(auth)){
      return auth;
    }
    return {};
  }

  render() {
    return <Auth {...this.getAuth()}>
      <Button {...getProps(this)} auth={null} onClick={this.onClick} />
    </Auth>;
  }
}
