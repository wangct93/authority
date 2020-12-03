import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import {callFunc, classNames, getProps, toArray} from 'wangct-util';
import './index.less';


export default class Swiper extends PureComponent {
  state = {
    value:0,
    animate:true,
    interval:3000,
    left:0,
    duration:500
  };

  componentDidMount() {
    this.setInterval();
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.valueChange({...prevState,...prevProps});
  }

  valueChange(prevProps){
    const prevValue = this.getValue(prevProps);
    const value = this.getValue();
    if(prevValue === value){
      return;
    }
    this.setState({
      endLeft:this.getLeft()
    },() => {
      this.startMove();
    })
  }

  startMove(){
    this.stopMove();
    const {duration} = getProps(this);
    const {left,endLeft} = this.state;
    const dl = (endLeft - left) / duration * 30;
    this.durationTimer = setInterval(() => {
      const {left,endLeft} = this.state;
      let current = left + dl;
      if(dl > 0 && current > endLeft || dl < 0 && current < endLeft){
        this.stopMove();
        current = endLeft;
      }
      this.setState({
        left:current
      });
    },30);
  }

  stopMove(){
    clearInterval(this.durationTimer);
  }

  getValue(props = getProps(this)){
    return props.value;
  }

  getLeft(value = this.getValue()){
    return -value * this.contentElem.offsetWidth;
  }

  setInterval(){
    this.clearInterval();
    this.timer = setInterval(() => {
      this.toRight();
    },getProps(this).interval);
  }

  clearInterval(){
    clearInterval(this.timer);
  }

  toLeft = () => {
    let value = this.getValue();
    if(value === 0){
      const content = this.getContent();
      this.setState({
        left:this.getLeft(content.length - 1)
      });
      value = content.length - 2;
    }else{
      value--;
    }
    this.onChange(value);
  };

  toRight = () => {
    let value = this.getValue();
    const content = this.getContent();
    if(value === content.length - 1){
      value = 1;
      this.setState({
        left:0
      });
    }else{
      value++;
    }
    this.onChange(value);
  };

  onChange(value){
    this.setState({
      value
    });
    callFunc(this.props.onChange,value);
  }

  getContent(){
    const children = toArray(this.props.children);
    return [...children,children[0]];
  }

  setElem = ref => {
    this.contentElem = ref;
  };

  mouseEnter = () => {
    this.clearInterval();
  };

  mouseLeave = () => {
    this.setInterval();
  };

  render() {
    const {state,props} = this;
    return <div onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} className={classNames('wct-swiper',props.className)} style={props.style}>
      <Icon type="left" onClick={this.toLeft} />
      <div className="wct-swiper-view" ref={this.setElem}>
        <div className="wct-swiper-content" style={{left:state.left}}>{this.getContent()}</div>
      </div>
      <Icon type="right" onClick={this.toRight} />
    </div>
  }
}
