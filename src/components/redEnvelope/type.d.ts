/**
 * 弹框
 */
export interface IDialog {
  open: (parms: IOpen) => Promise<unknown>;

  success: (parms: ISuccess) => Promise<unknown>;
  /** 失败 */
  fail: (parms: { text: string }) => Promise<unknown>;
}
/** 中奖*/
export interface ISuccess {
  /** 兑换码 */
  code: string;
  /** 兑换码状态 */
  codeStatus: number;
  /** 微信公众号名称 */
  wechatName: string;
  /** 金额 */
  sum: string;
  /** 红包类型 {1:现金红包,2:积分红包} */
  type: number;
}
/** 打开红包*/
export interface IOpen {
  /** 主持人名称 */
  name: string;
  /** 主持人头像 */
  img: string;
  /** 红包留言 */
  text: string;
  /** 红包类型 {1:现金红包,2:积分红包} */
  type: number;
}
