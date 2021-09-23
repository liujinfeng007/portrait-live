// 根据所有数据类型原型链上的toString进行准确判断并给出TS中的类型保护
const toString = Object.prototype.toString;

// 耦合较低的判断
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

// 非falsy值判断
export function isTruely(value: unknown): value is boolean {
  return !!value || value === 0;
}

// 变量是否定义
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== "undefined";
};

export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val);
};

export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, "Object");
};

export function isDate(val: unknown): val is Date {
  return is(val, "Date");
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNumber(val: unknown): val is number {
  return is(val, "Number");
}

export const isFunction = (val: unknown): val is Function =>
  typeof val === "function";

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return (
    is(val, "Promise") &&
    isObject(val) &&
    isFunction(val.then) &&
    isFunction(val.catch)
  );
}

export function isString(val: unknown): val is string {
  return is(val, "String");
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, "Boolean");
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, "RegExp");
}

export function isArray(val: unknown): val is any[] {
  return !!val && Array.isArray(val);
}

export const isClient = () => {
  return typeof window !== "undefined";
};

export const isWindow = (val: any): val is Window => {
  return typeof window !== "undefined" && is(val, "Window");
};

export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName;
};

export function isImageDom(o: Element) {
  return o && ["IMAGE", "IMG"].includes(o.tagName);
}

// 函数工具，类型保护解决索引类型报错问题
export function isOwnKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}
