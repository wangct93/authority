import Input from "../Input";
import Select from '../Select';

/**
 * 判断组件是否在DOM树里
 * @param target
 * @returns {*}
 */
export function isMounted(target){
  return target.updater && target.updater.isMounted && target.updater.isMounted(target);
}

/**
 * 获取文本
 * @param target
 * @param data
 */
export function getText(target,data) {
  data = data || {};
  const formatter = target.getProp ? target.getProp('textFormatter') : this.props.formatter;
  if (formatter) {
    return formatter(data.text, data);
  }
  return data.text;
}

/**
 * 获取输入组件
 * @param type
 * @returns {*}
 */
export function getInputCom(type){
  const map = {
    input:Input,
    select:Select,
  };
  return map[type];
}
