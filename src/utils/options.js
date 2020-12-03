// 弹窗类型
export enum ModalType {
  add,
  read,
  edit,
}

export enum GetHandType {
  default,// 默认，目前没有用
  get,// 领用
  addOn,// 追加
  affairDeal,// 乘客事务
  handIn,  // 上交
}

// 设备类型列表
export enum deviceType {
  default,// 默认，目前没有用
  AGM,
  BOM,
  TVM,
}

// 库存单据状态
export enum BillStatus {
  untreated = 1,  // 未处理
  pass = 3,  // 审核通过
  nopass = 4,  // 审核不通过
  out = 5, //  出库方已出库
  in = 6, //  入库方已入库
  cancel = 9,// 撤销
}

// 现金单据状态
export enum CashBillStatus {
  untreated = 1,  // 未处理
  sure = 7,   // 已确认
  cancel = 9,// 撤销
  down = 14,  // 已下发
  supplement = 15,  // 已补款
}

// TVM审核状态
export enum TvmCheckStatus {
  checked = 17,  // 已核对
}

// TVM核对单据状态
export enum TvmCheckStatus {
  noCheck = 11,  // 未审核
  partCheck = 10,  // 部分审核
  diffCheck = 12,  // 差异审核
  allCheck = 13,  // 完全审核
}

// 节点类型
export enum NodeType {
  ACC, // ACC
  LC,  // 线路
  SC, // 车站
}

// TVM收益标记位
export enum TvmProfitMark {
  auto = 1, // 自动
  artificial = 0,  // 手工
}

// TVM钱箱类型
export enum TvmCashBoxType {
  coin = 1, // 硬币
  note = 2,  // 纸币
}

// 票柜启用标志
export enum StorageEnableFlag {
  enable = 1, // 在用
}

// 短款类型
export enum ShortType {
  bom = 1,
}

/**
 * 登录点是否配置IP映射
 * @author wangchuitong
 */
export enum LoginNodeIfValid{
  true = 0,   // 配置
  false = 1,  // 不配置
}