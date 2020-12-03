/**
 * Created by wangct on 2019/3/9.
 */
import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import {Cache} from 'wangct-util';

const cache = new Cache();

export default class IconCap extends PureComponent {

  getIcon() {
    const {scriptUrl} = this.props;
    return scriptUrl ? getIconfont(scriptUrl) : Icon;
  }

  render() {
    const Icon = this.getIcon();
    return <Icon {...this.props} />
  }
}

/**
 * 获取iconfont
 * @param scriptUrl
 * @returns {DOMPoint | SVGNumber | string | SVGTransform | SVGLength | SVGPathSeg | any}
 */
function getIconfont(scriptUrl){
  let Iconfont = cache.getItem(scriptUrl);
  if(!Iconfont){
    Iconfont = Icon.createFromIconfontCN({
      scriptUrl
    });
    cache.setItem(scriptUrl,Iconfont);
  }
  return Iconfont;
}
