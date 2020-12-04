/**
 * Created by wangct on 2019/3/9.
 */
import React, {PureComponent} from 'react';
import {Icon as IconMod} from 'antd';
import {setCache,getCache} from '@wangct/util';

/**
 * 图标
 */
export default class Icon extends PureComponent {

  getIcon() {
    const {scriptUrl} = this.props;
    return scriptUrl ? getIconfont(scriptUrl) : IconMod;
  }

  render() {
    const Com = this.getIcon();
    return <Com {...this.props} />;
  }
}

/**
 * 获取iconfont
 * @param scriptUrl
 * @returns {DOMPoint | SVGNumber | string | SVGTransform | SVGLength | SVGPathSeg | any}
 */
function getIconfont(scriptUrl){
  let Iconfont = getCache(scriptUrl);
  if(!Iconfont){
    Iconfont = Icon.createFromIconfontCN({
      scriptUrl,
    });
    setCache(scriptUrl,Iconfont);
  }
  return Iconfont;
}
