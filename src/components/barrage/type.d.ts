export interface IBarrageItem {
  /** 弹幕内容 */
  content: string;
  /** 方向 默认right to left  */
  direction?: "right" | "top" | "bottom";
  /** 是否是自己发的弹幕 */
  isSelf?: boolean;
  /** 弹幕样式 */
  style?: {
    /** 弹幕颜色 */
    color?: string;
    /** 自己弹幕颜色 */
    selfColor?: string;
    /** 弹幕字体大小 */
    size?: string;
    /** 自己弹幕字体大小 */
    selfSize?: string;
  };
}

export interface IBarrageElement extends IBarrageItem {
  element?: HTMLDivElement;
  row?: number;
  appended?: boolean;
}
