import GiftAnimation from "./GiftAnimation.vue";
import { reSet } from "./utils";
let mask: HTMLDivElement | null;
let notice = () => {};
/**
 * 开启动画
 * @param url 礼物图片
 * @param num 礼物数量
 * @param time 动画时长
 */
export function createAnimation(
  url: string,
  num: number,
  time?: number
): Promise<void> {
  return new Promise(resolve => {
    if (!mask) {
      notice = () => {
        resolve();
      };
      mask = document.createElement("div");
      const child = document.createElement("div");
      mask.appendChild(child);
      const sv = new GiftAnimation({
        propsData: { url, num, time }
      });
      sv.$mount(child);
      document.body.appendChild(mask);
    } else {
      reSet(url, num, time);
      notice = () => {
        resolve();
      };
    }
  });
}

/**
 * 关闭动画
 */
export function closeAnimation(call = true) {
  call && notice();
  mask!.remove();
  mask = null;
}
