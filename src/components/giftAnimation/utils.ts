let notice = (url: string, num: number, time?: number) => {};
export function reSet(url: string, num: number, time?: number) {
  notice(url, num, time);
}

export function setNotice(
  callBack: (url: string, num: number, time?: number) => void
) {
  notice = callBack;
}
