import { IBarrageElement } from "./type";
class Barrage {
  private list: IBarrageElement[] = [];
  private trajectory!: HTMLElement;
  private topOrBottom!: HTMLElement;
  private animationTimer?: number;
  /**
   * 初始化弹幕
   * @param list 弹幕集合
   * @param trajectory 弹幕轨迹元素（right 类型弹幕显示的父元素）
   * @param topOrBottom 上下型弹幕元素（top , bottom类型弹幕显示的父元素）
   */
  init(
    list: IBarrageElement[],
    trajectory: HTMLElement,
    topOrBottom: HTMLElement
  ) {
    this.list = list;
    this.trajectory = trajectory;
    this.topOrBottom = topOrBottom;
    this.list.forEach(item => {
      if (!item.element) {
        this.createBarrageElement(item);
      }
    });
    this.animationTimer = setInterval(() => {
      this.showAnimation();
    }, this.getRandom(0, 1500));
  }

  /**
   * 新增弹幕
   * @param list 新增的弹幕集合
   */
  addList(list: IBarrageElement[]) {
    list.forEach(item => {
      if (!item.element) {
        this.createBarrageElement(item);
        this.list.push(item);
      }
    });
  }

  private createBarrageElement(item: IBarrageElement) {
    const div = document.createElement("div");
    const style = item.style || {};
    div.innerHTML = item.content;
    div.style.position = "absolute";
    div.style.fontWeight = "bold";
    div.style.whiteSpace = "pre";
    div.style.zIndex = "3000";
    div.style.lineHeight = "1";
    div.style.color = (item.isSelf ? style.selfColor : style.color) || "#fff";
    div.style.fontSize =
      (item.isSelf ? style.selfSize : style.size) || "0.24rem";
    item.element = div;
  }

  private getRandom(start: number, end: number, fixed = 0) {
    const differ = end - start;
    const random = Math.random();
    return Number((start + differ * random).toFixed(fixed));
  }

  private showAnimation() {
    const containerPos = this.trajectory.getBoundingClientRect();
    const { width: containerWidth, height: containerHeight } = containerPos;
    for (let index = 0; index < this.list.length; index++) {
      const item = this.list[index];
      if (item.element) {
        if (!item.appended) {
          const fontSize = this.remToPx(item.element!.style.fontSize);
          const row = Math.floor(containerHeight / fontSize);
          const rowHeight = containerHeight / row;
          const channel = this.getChannel(row);
          if (channel !== 0) {
            item.row = channel;
            item.element.style.left =
              containerWidth +
              item.element.getBoundingClientRect().width +
              "px";
            item.element.style.top = rowHeight * channel - fontSize + "px";
            item.element.style.transition = `transform 5s linear 0s`;
            item.element.addEventListener("transitionend", () => {
              this.trajectory.removeChild(item.element!);
              this.list.splice(this.list.indexOf(item), 1);
            });
            this.trajectory.appendChild(item.element);
            item.element.style.transform = `translateX(-${containerWidth +
              item.element.getBoundingClientRect().width * 2 +
              2}px)`;
            item.appended = true;
            return;
          } else {
            return;
          }
        }
      }
    }
  }

  private getChannel(maxRow: number): number {
    for (let index = 1; index < maxRow + 1; index++) {
      const rowList = this.list.filter(item => item.row === index);
      if (rowList.length > 0) {
        if (
          rowList.lastChild.element!.getBoundingClientRect().right * 1.5 <
          this.trajectory.getBoundingClientRect().right
        ) {
          return index;
        }
      } else {
        return index;
      }
    }
    return 0;
  }

  private remToPx(fontSize: string) {
    if (fontSize.includes("rem")) {
      return (
        Number(fontSize.split("rem")[0]) *
        Math.round(window.innerWidth * 0.1333333333333333)
      );
    }
    return Number(fontSize.split("px")[0]);
  }

  destroy() {
    clearInterval(this.animationTimer);
  }
}
export default new Barrage();
