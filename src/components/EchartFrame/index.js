import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {callFunc, getProps} from "wangct-util";

@connect(({global}) => ({
  resizeSign:global.resizeSign,
}))
export default class EchartFrame extends PureComponent {

  componentDidMount() {
    this.drawEchart();
  }

  componentDidUpdate(prevProps, prevState) {
    this.drawEchart();
  }

  drawEchart(){
    const chart = this.getChart();
    if(!chart){
      return;
    }
    callFunc(this.props.draw,chart,getProps(this).data,this.getElem());
    chart.resize();
  }

  getChart(){
    const {chart} = this;
    if(chart){
      return chart;
    }
    const elem = this.getElem();
    const {echarts} = getProps(this);
    if(!elem || !echarts){
      return;
    }

    this.chart = echarts.init(elem);
    return this.chart;
  }

  setElem = (ref) => {
    this.elem = ref;
  }

  getElem(){
    return this.elem;
  }

  getDivProps(){
    return getProps(this,['echarts','draw','resizeSign','dispatch']);
  }

  render(){
    return <div ref={this.setElem} {...this.getDivProps()} />;
  }
}
