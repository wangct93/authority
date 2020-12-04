import React,{PureComponent} from 'react';
import {callFunc, getProps} from '@wangct/util';

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
    this.checkScrollElem(prevProps,prevState);
  }

  checkScrollElem(prevProps){
    const oldScrollElem = this.getScrollElem(prevProps);
    if(oldScrollElem !== this.getScrollElem()){
      this.removeEvent(oldScrollElem);
      this.addEvent();
    }
  }

  addEvent(elem = this.getScrollElem()){
    this.removeEvent(elem);
    elem.addEventListener('scroll',this.scrollEvent);
  }

  removeEvent(elem = this.getScrollElem()){
    elem.removeEventListener('scroll',this.scrollEvent);
  }

  scrollEvent = (e) => {
    const {top,left,right,bottom} = this.getElem().getBoundingClientRect();
    if(!(right < 0 || bottom < 0 || left > window.innerWidth || top > window.innerHeight)){
      this.removeEvent();
      callFunc(this.props.onShow,e);
    }
  };

  getScrollElem(props = this.props){
    return props.scrollElem || window;
  }

  render() {
    const {props} = this;
    return <div className={props.className} style={props.style} ref={this.setElem}>{props.children}</div>;
  }
}
