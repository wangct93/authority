import React,{PureComponent} from 'react';
import {callFunc, getProps} from 'wangct-util';

/**
 * 异步视图（展示在界面时加载内容）
 */
export default class AsyncVisual extends PureComponent {
  state = {
    useWin:true
  };

  componentDidMount(){
    this.addEvent();
    this.scrollEvent();
  }

  componentWillUnmount() {
    this.removeEvent();
  }

  componentDidUpdate(prevProps,prevState){
    this.checkElem(prevProps,prevState);
  }

  checkElem(prevProps){
    const oldElem = this.getElem(prevProps);
    const elem = this.getElem();
    if(oldElem !== elem){
      this.removeEvent(oldElem);
      this.addEvent();
    }
  }

  getElem(props = getProps(this)){
    if(props.useWin){
      return window;
    }
    const {elem} = this;
    return elem && elem.parentNode;
  }

  addEvent(elem = this.getElem()){
    elem.addEventListener('scroll',this.scrollEvent);
  }

  removeEvent(elem = this.getElem()){
    elem.removeEventListener('scroll',this.scrollEvent);
  }

  scrollEvent = (e) => {
    const {top,left,right,bottom} = this.elem.getBoundingClientRect();
    if(!(right < 0 || bottom < 0 || left > window.innerWidth || top > window.innerHeight)){
      this.onShow(e);
    }
  };

  onShow(e){
    this.removeEvent();
    callFunc(this.props.onShow,e);
  }

  setElem = (ref) => {
    this.elem = ref;
  };

  render() {
    return <div ref={this.setElem} />
  }
}
