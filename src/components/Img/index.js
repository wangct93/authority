import React, {PureComponent} from 'react';
import {aryRemove, callFunc, getProps, Queue} from 'wangct-util';

const list = [];
const imgMap = new Map();
const queue = new Queue({
  list,
  func(item){
    return new Promise((cb) => {
      item.start(() => {
        imgMap.delete(item);
        cb();
      });
    });
  },
  limit:5,
});

/**
 * 添加对象到队列
 * @param item
 */
function addToQueue(item){
  if(!imgMap.get(this)){
    imgMap.set(item,true);
    list.push(item);
    queue.start();
  }
}

/**
 * 从队列删除对象
 * @param item
 */
function removeToQueue(item){
  item.next();
  aryRemove(list,item);
  imgMap.delete(item);
}

/**
 * 图片组件
 */
export default class Img extends PureComponent {
  state = {
    alt:'图片加载失败',
    status:'wait',
    src:this.props.normalSrc,
  };

  componentDidMount() {
    addToQueue(this);
  }

  componentWillUnmount() {
    removeToQueue(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.checkSrc(prevProps,prevState);
  }

  checkSrc(prevProps){
    if(prevProps.src !== this.props.src){
      removeToQueue(this);
      addToQueue(this);
    }
  }

  next(){
    callFunc(this.nextFunc);
    this.nextFunc = null;
  }

  onLoad = () => {
    this.next();
  };

  onError = () => {
    const {errorSrc} = this.props;
    if(!errorSrc || errorSrc === this.state.src){
      this.next();
    }else{
      this.setState({
        src:this.props.errorSrc,
      });
    }
  };

  start(cb){
    this.nextFunc = cb;
    this.setState({
      src:this.props.src,
    });
  }

  getSrc(){
    return this.state.src;
  }

  render() {
    return <img
      {...getProps(this,['normalSrc','errorSrc'])}
      src={this.getSrc()}
      onLoad={this.onLoad}
      onError={this.onError}
    />
  }
}
