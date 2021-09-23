import Native from "./Native";
import { encode } from "js-base64";
import { isArray, isTruely } from "./is";
/**
 * 复制到剪切板
 * @param value 值
 */
export function copy(value: string): boolean {
  const text = document.createElement("textarea");
  let result = true;
  try {
    text.value = value;
    document.body.appendChild(text);
    text.select();
    document.execCommand("copy");
  } catch (error) {
    result = false;
  }
  document.body.removeChild(text);
  return result;
}

/**
 * 在js中使用px时调用此函数将设计稿px转换为当前rem适用的px
 * @param px px
 */
export function toRem(px: number) {
  const key = Math.round(window.innerWidth * 0.1333333333333333);
  return (px / 100) * key;
}

export function pxToRem(px: number) {
  const key = Math.round(window.innerWidth * 0.1333333333333333);
  return px / key;
}

/**
 * 转换的px
 * @param size rem大小
 */
export function remToPx(size: string) {
  if (size.includes("rem")) {
    return (
      Number(size.split("rem")[0]) *
      Math.round(window.innerWidth * 0.1333333333333333)
    );
  }
  return Number(size.split("px")[0]);
}

/**
 * style属性的px转换成number
 * @param px dom style属性
 */
function stylePxToNumber(px: string) {
  if (px.includes("px")) {
    px = px.split("px")[0];
  }
  return Number(px);
}

/**
 * 跳转网页
 * @param url 地址
 */
export function openUrl(url: string) {
  if (window.ZWY_CLOUD && Native.isOpenInApp()) {
    Native.openWebBrowser({
      id: "",
      sourceId: "",
      detailViewType: "98",
      sourceType: "0",
      commentType: "0",
      contextType: "",
      isShowTop: "1",
      isShowBottom: "0",
      isShowMore: "0",
      url: url,
      shareUrl: url,
      title: encode(document.title),
      synopsis: "",
      shareImgUrl: ""
    });
  } else {
    window.open(url);
  }
}

/**
 * 缩放Dom的大小
 * @param scale 比例
 */
export function zoomDom(scale: number, dom: HTMLElement) {
  function execute(el: HTMLElement) {
    for (const e of el.children) {
      const temp = e as HTMLElement;
      temp.style.width &&
        (temp.style.width =
          pxToRem(stylePxToNumber(temp.style.width) * scale) + "rem");
      temp.style.height &&
        (temp.style.height =
          pxToRem(stylePxToNumber(temp.style.height) * scale) + "rem");
      temp.style.fontSize &&
        (temp.style.fontSize =
          pxToRem(stylePxToNumber(temp.style.fontSize) * scale) + "rem");
      temp.style.padding &&
        (temp.style.padding = temp.style.padding
          .split(" ")
          .map(item => pxToRem(stylePxToNumber(item) * scale) + "rem")
          .join(" "));
      temp.style.margin &&
        (temp.style.margin = temp.style.margin
          .split(" ")
          .map(item => pxToRem(stylePxToNumber(item) * scale) + "rem")
          .join(" "));
      if (temp.children) {
        execute(temp);
      }
    }
  }
  if (dom.children.length) {
    execute(dom);
  }
}

export function throttle(func: Function, wait: number) {
  let ctx: any,
    args: any[] | null = null,
    timerId: number,
    last = 0,
    returnVal: any;

  function call() {
    timerId = 0;
    last = +new Date();
    returnVal = func.apply(ctx, args);
    ctx = null;
    args = null;
  }

  return function throttled(this: any, ..._args: any[]) {
    ctx = this;
    args = _args;
    const delta = Date.now() - last;
    if (!timerId)
      if (delta >= wait) call();
      else timerId = setTimeout(call, wait - delta);
    return returnVal;
  };
}

export function generator<T = unknown>({
  value,
  delay
}: {
  value: unknown[];
  delay: number;
}): { asyncIterator: AsyncIterable<T> };
export function generator<T = unknown>({
  value,
  times,
  delay
}: {
  value: unknown;
  times: number;
  delay: number;
}): { asyncIterator: AsyncIterable<T> };
export function generator<T = unknown>({
  value,
  times,
  delay = 1000
}: {
  value: unknown;
  times?: number;
  delay: number;
}): { asyncIterator: AsyncIterable<T> } {
  const asyncIterator = {
    [Symbol.asyncIterator]() {
      return {
        n: 0,
        async next() {
          this.n += 1;
          return new Promise<{ done: boolean; value: any }>(resolve => {
            setTimeout(
              () =>
                resolve({
                  value: isArray(value) ? value[this.n] : value,
                  done:
                    this.n >
                    (!isTruely(times)
                      ? isArray(value)
                        ? value.length
                        : Number.MAX_SAFE_INTEGER
                      : times)
                }),
              delay
            );
          });
        }
      };
    }
  };
  return { asyncIterator };
}
