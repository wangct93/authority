/**
 * Created by wangct on 2019/1/19.
 */
import React, {PureComponent} from 'react';

import {callFunc, classNames, getProps, isDef} from "wangct-util";
import {Button, Upload} from "antd";
import './index.less';

export default class UploadCap extends PureComponent {

  state = {
    listType:'picture'
  };

  onChange = (opt) => {
    let {fileList} = opt;
    const {limit} = this.props;
    if(isDef(limit)){
      fileList = fileList.slice(-limit);
    }
    this.setState({
      value:fileList
    });
    callFunc(this.props.onChange,fileList,opt);
  };

  getValue(){
    return getProps(this).value;
  }

  getUploadProps(){
    return getProps(this,['value']);
  }

  getTriggerTarget(){
    const {children} = getProps(this);
    return isDef(children) ? children : <Button type="primary" icon="upload">上传图片</Button>
  }

  render() {
    return <Upload
      {...this.getUploadProps()}
      className={classNames('wct-upload-box',this.props.className)}
      onChange={this.onChange}
      fileList={this.getValue()}
    >
      {this.getTriggerTarget()}
    </Upload>
  }
}
