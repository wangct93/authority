import {
  AfcDrawer, aryToObject,
  BaseEditDrawer, DateStringPicker,
  FilterInput, FilterRadio,
  FilterSelect, FilterTextarea, getFormatter, getSessionUser, getUserId, reduxConnect, strEqual, textOverflowRender,
  UserInput, userPswFormatter,
} from "afc-basic-element-browser";
// @ts-ignore
import css from "./index.less";
import {PswInput} from "./EditDrawer";

/**
 * 用户编辑弹窗
 */
export default class ResetPswDrawer extends BaseEditDrawer {
  state = {
    options: [
      {
        title: '用户编号',
        field: 'user_id',
        component:UserInput,
        props:{
          disabled:true,
        },
      },
      {
        title: '用户名称',
        field: 'user_name',
        component:FilterInput,
        props:{
          disabled:true,
        },
      },
      {
        title: '新密码',
        field: 'user_psw_new',
        component:PswInput,
        required:true,
        formatter:userPswFormatter,
      },
      {
        title: '新密码确认',
        field: 'user_psw_val',
        component:PswInput,
        required:true,
        formatter:userPswFormatter,
        validator:pswValidator,
        errorSkipTitle:true,
      },
    ],
  };

  getClassName(): string {
    return css.edit_drawer;
  }

  getWidth(): number {
    return 600;
  }

  getTitle(): string {
    return '重置密码';
  }

}

/**
 * 密码确认校验
 * @author wangchuitong
 */
function pswValidator(v,field,data){
  if(v && data.user_psw_new !== v){
    return '确认密码与新密码不一致';
  }
  return null;
}
