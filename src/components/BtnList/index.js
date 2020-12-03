import DefineComponent from "../DefineComponent";
import React from "react";
import Btn from "../Btn";

/**
 * 按钮列表
 */
export default class BtnList extends DefineComponent {
  render() {
    return <div className="w-btn-list">
      {
        this.getOptions().map((opt,index) => {
          if(React.isValidElement(opt)){
            return <React.Fragment key={index}>{opt}</React.Fragment>
          }
          return <Btn {...opt} key={index}>{opt.title}</Btn>;
        })
      }
    </div>
  }
}
