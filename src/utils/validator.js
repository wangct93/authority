import {getFormatter} from "afc-basic-element-browser";
//角色编号
export function roleIdValidator(v,ov){
    return getFormatter({
        length:19,
        number: true
    })(v,ov);
  }
//角色名称
  export function roleNameValidator(v,ov){
    return getFormatter({
        length:32,
    })(v,ov);
  }

//排序号
export function orderNumValidator(v,ov){
  return getFormatter({
      length:5,
      number: true
  })(v,ov);
}
//部门名称
export function organizeNameValidator(v,ov){
    return getFormatter({
        length:20,
    })(v,ov);
  }


//角色描述
export function roleDescValidator(v,ov){
    return getFormatter({
        length:100,
    })(v,ov);
  }
//备注
export function remarkValidator(v,ov){
    return getFormatter({
        length:150,
    })(v,ov);
  }

//菜单URL
export function menuURLValidator(v,ov){
    return getFormatter({
        length:30,
    })(v,ov);
  }

//菜单按钮
export function menuIconLValidator(v,ov){
    return getFormatter({
        enLang:true,
        length: 15,
    })(v,ov);
  }