/**
 * Created by wangct on 2019/1/19.
 */
import React from 'react';
import DefineComponent from "../DefineComponent";
import Btn from "../Btn";

/**
 * 上传组件
  */
export default class Upload extends DefineComponent {

  state = {
  };

  getChildren(){
    const {children} = this.props;
    if(children){
      const child = React.Children.only(this.props.children);
      return React.cloneElement(child,{
        onClick:this.doClick,
      });
    }
    return <Btn onClick={this.doClick} type="primary" icon="upload">上传图片</Btn>;
  }

  inputChange = (e) => {
    const {files} = e.target;
    const value = this.isMultiple() ? Array.from(files) : files[0];
    this.onChange(value);
    e.target.value = null;
  };

  doClick = () => {
    this.getElem().click();
  };

  isMultiple(){
    return this.props.multiple;
  }

  render() {
    return <React.Fragment>
      {
        this.getChildren()
      }
      <input {...this.props} multiple={this.isMultiple()} ref={this.setElem} type="file" onChange={this.inputChange} />
    </React.Fragment>
  }
}
