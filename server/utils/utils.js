
module.exports = {
  getPageLimit,
};

/**
 * 获取分页属性
 * @param pageNum
 * @param pageSize
 * @returns {number[]}
 */
function getPageLimit(pageNum,pageSize){
  if(!pageSize){
    return null;
  }
  return [(pageNum - 1) * pageSize,pageNum * pageSize];
}
