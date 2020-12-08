import DefineComponent from "../DefineComponent";
import React from "react";
import moment from "moment";
import {isStr} from "@wangct/util/lib/typeUtil";

/**
 * 时间
 */
export default class DateView extends DefineComponent {
  state = {
    value:moment(),
    format:'YYYY-MM-DD HH:mm:ss',
  };

  componentDidMount() {
    this.setInterval();
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  setInterval(){
    this.clearInterval();
    this.timer = setInterval(() => {
      this.setState({
        value:moment(),
      });
    },1000);
  }

  clearInterval(){
    clearInterval(this.timer);
  }

  getView(){
    const format = this.getProp('format');
    if(isStr(format)){
      return this.getValue().format(format);
    }
    return format(this.getValue());
  }

  render() {
    return <span>{this.getView()}</span>;
  }
}
