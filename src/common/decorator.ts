/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, Toast } from "vant";
import { ToastOptions } from "vant/types/toast";
import native from "@/common/Native";
import store from "@/store";

/**
 * 检验端方法是否可运行(如果在端内则调用交互js，如果在端外则跳转下载页 - 开发环境会返回预设的值)
 * @param someValue 一些在你开发环境中需要用到的返回值
 */
export function executable<T extends object>(someValue?: string | object) {
  return (target: T, propertyKey: string, descriptor: PropertyDescriptor) => {
    descriptor.value = new Proxy(descriptor.value, {
      // 拦截被装饰方法的调用时
      apply(proxyTarget, thisArg, argumentsList) {
        // 如果在手机端打开
        if (window.ZWY_CLOUD.isOpenInApp()) {
          return Reflect.apply(proxyTarget, thisArg, argumentsList);
        } else {
          // 如果是测试环境
          if (process.env.NODE_ENV === "development") {
            // 如果设置了默认返回值
            if (someValue) {
              return Reflect.apply(
                () =>
                  new Promise(resolve => {
                    resolve(someValue);
                  }),
                thisArg,
                argumentsList
              );
            }
          } else {
            if (store.state.downloadUrl) {
              location.href = store.state.downloadUrl;
            }
          }
        }
      }
    });
  };
}

let isOver = false;

/**
 * 防抖
 * @param interval 间隔
 */
export function antiShake<T extends object>(interval = 500) {
  return function(
    target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = new Proxy(descriptor.value, {
      // 拦截被装饰方法的调用时
      apply(proxyTarget, thisArg, argumentsList) {
        if (!isOver) {
          isOver = true;
          setTimeout(() => {
            isOver = false;
          }, interval);
          return Reflect.apply(proxyTarget, thisArg, argumentsList);
        }
      }
    });
  };
}
/**
 * 标识当前操作需要Token
 * @param required 是否必须使用token,true的话未登录时会强制进入登录页
 * @param needPhone 是否必须使用手机号登录,必须在required == true 时才有效
 */
export function needToken<T extends object>(
  required: boolean,
  needPhone = false
) {
  return function(
    target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = new Proxy(descriptor.value, {
      // 拦截被装饰方法的调用时
      apply(proxyTarget, thisArg, argumentsList) {
        if (store.state.token) {
          return Reflect.apply(proxyTarget, thisArg, argumentsList);
        }
        if (
          process.env.NODE_ENV === "development" ||
          window.ZWY_CLOUD.isOpenInApp()
        ) {
          return new Promise(resolve => {
            if (required) {
              native.goToken().then(info => {
                if (needPhone && !info.phone) {
                  Dialog.alert({
                    title: "提示",
                    message: "必须使用手机号登陆"
                  }).then(() => {
                    native.goToken(2).then(() => {
                      if (location && location.reload) {
                        location.reload();
                      }
                    });
                  });
                } else {
                  store.commit("SET_STATE", info);
                  resolve(Reflect.apply(proxyTarget, thisArg, argumentsList));
                }
              });
            } else {
              native.getUserInfo().then(info => {
                store.commit("SET_STATE", info);
                resolve(Reflect.apply(proxyTarget, thisArg, argumentsList));
              });
            }
          });
        } else {
          if (required && store.state.downloadUrl) {
            location.href = store.state.downloadUrl;
          } else {
            return Reflect.apply(proxyTarget, thisArg, argumentsList);
          }
        }
      }
    });
  };
}

/**
 * @param options
 * @description 为非Vue文件类属性绑定state值，修改值后也可以同步到vuex，但不建议修改
 * @attention 属性装饰器无法直接修改值，修改的值会在对象原型上(__proto__)，
 * 但可以利用原型链的特点，在类中定义undefined属性。
 */
const bindQueue: string[] = [];
export function bindState(options: { stateKey?: string }): any;
export function bindState(target: any, attr: string): any;
export function bindState(options: { stateKey?: string } = {}) {
  // 找到原型的倒数第二层，即Object层
  const findObjectProto = (
    object: Record<string, any>,
    target: Record<string, any>
  ) => {
    const proto = Object.getPrototypeOf(object);
    if (proto.constructor.name === "Object") {
      Object.setPrototypeOf(object, target);
    } else {
      findObjectProto(proto, target);
    }
  };

  const SyncState = function(target: any, attr: string) {
    const { stateKey = attr } =
      options.constructor?.name !== "Object" ? { stateKey: attr } : options;
    if (stateKey in store.state) {
      !bindQueue.includes(stateKey) && bindQueue.push(stateKey);

      const pureObject = Object.create({}),
        descriptorMap: { [k: string]: PropertyDescriptor } = {};

      bindQueue.forEach(key => {
        descriptorMap[key] = {
          get() {
            // console.log(`来自${key}属性的访问器：`, store.state);
            return store.state[key as keyof typeof store.state];
          },
          // TODO: 为保证数据的单一流向，是否要去掉可修改的功能？
          set(value: unknown) {
            store.commit("SET_STATE", {
              [stateKey]: value
            });
          }
        };
      });
      const getter = Object.defineProperties(pureObject, descriptorMap);
      // TODO: 目前的方案是找到Object原型 将其替换为重写的访问器
      // 存在的问题是如果是链式继承会存在属性重名后被覆盖的问题
      findObjectProto(target, getter);
    } else {
      throw TypeError(`state中没有键为${stateKey}的属性！`);
    }
  };

  // eslint-disable-next-line prefer-rest-params
  const args = [...arguments] as [any, string];
  return options.constructor?.name !== "Object"
    ? SyncState.apply(null, [...args])
    : SyncState;
}

/**
 * 装饰接口调用函数，在指定时间未返回结果时弹出loading效果
 * @param options Toast选项以及等待时间和@property条件执行回调或布尔值
 * @returns void
 */
export function toastWithDelay(
  options: ToastOptions & {
    wait?: number;
    condition?: boolean | ((...args: any[]) => boolean);
  }
) {
  return function(
    _target: unknown,
    _key: string,
    descriptor: PropertyDescriptor
  ) {
    const fn = descriptor.value;
    descriptor.value = async function(...args: unknown[]) {
      const timer = setTimeout(() => {
        let flag: boolean;
        if (typeof options.condition === "function") {
          flag = options.condition(...args);
        } else if (typeof options.condition === "boolean") {
          flag = options.condition;
        } else {
          flag = true;
        }
        flag && Toast.loading(options);
      }, options.wait || 1000);
      await fn.apply(this, args);
      clearTimeout(timer);
      Toast.clear();
    };
  };
}
