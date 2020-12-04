/**
 * 显示表单抽屉
 * @author wangchuitong
 */
import {callFunc, classNames, random} from "@wangct/util/lib/util";
import {isStr} from "@wangct/util/lib/typeUtil";
import React from "react";
import Form from "../components/Form";
import {Modal} from "antd";


export function showModal(options = {}) {
  options = {
    width: 400,
    ...options,
  };
  const close = () => {
  };

  function onOk() {
    const contentElem = getElem();
    if(!contentElem){
      return;
    }
    let pro;
    if (contentElem.validator) {
      pro = contentElem.validator().then(options.onOk);
    } else {
      const value = contentElem.getValue && contentElem.getValue();
      pro = callFunc(options.onOk, value);
    }
    Promise.resolve(pro).then(close).catch((msg) => {
      if (isStr(msg)) {
        message.error(msg);
      }
    });
  }

  const { component,content: Com = component} = options;
  let elem = null;
  function setElem(com) {
    elem = com;
  }

  function getElem() {
    return elem;
  }

  const content = Com
    ? <Com targetRef={setElem} contentRef={setElem} ref={setElem} {...options.contentProps} />
: <Form
  ref={setElem}
  {...options.formProps}
  options={options.options}
  defaultValue={options.value}
  />;
  const extProps = {};
  if(options.okText){
    extProps.okText = options.okText;
  }
  const viewTarget = <Modal
  title={options.title}
  visible
  onCancel={close}
  width={options.width}
  key={random()}
  onOk={options.onOk && onOk}
  className={options.className}
  {...extProps}
  {...options.modalProps}
>
  {content}
</Modal>;
  addFragment()

  updateViewList([...fragViewList, viewTarget]);
  return {
    close,
  };
}
