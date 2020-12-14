import DefineComponent from "../../components/DefineComponent";
import React from "react";
import css from './index.less';
import Input from "../../components/Input";
import Form from "../../components/Form";
import Btn from "../../components/Btn";
import {userLogin} from "../../services/user";
import {pathTo} from "../../frame";

/**
 * 登录界面
 */
export default class Login extends DefineComponent {

  state = {
    options:[
      {
        title:'用户编号',
        field:'user_id',
        component:'input',
        required:true,
      },
      {
        title:'用户密码',
        field:'user_password',
        component:'input',
        required:true,
      },
    ]
  };

  doLogin = () => {
    this.getForm().validator().then((value) => {
      userLogin(value).then(() => {
        pathTo('/user');
      });
    })
  };

  render() {
    return <div className={css.container}>
      <div className={css.content}>
        <div className={css.title}>登录</div>
        <Form className={css.form_box} ref={this.setForm} options={this.getOptions()} value={this.getFormValue()} onChange={this.formChange} />
        <div>
          <Btn type="primary" block onClick={this.doLogin}>登录</Btn>
        </div>
      </div>
    </div>
  }
}
