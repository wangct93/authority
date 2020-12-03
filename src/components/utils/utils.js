
/**
 * 判断组件是否在DOM树里
 * @param target
 * @returns {*}
 */
export function isMounted(target){
  return target.updater && target.updater.isMounted && target.updater.isMounted(target);
}
