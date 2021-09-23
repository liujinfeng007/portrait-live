import { executable } from "./decorator";
interface ShareConfig {
  /** 分享标题 */
  title: string;
  /** 分享内容 */
  content: string;
  /** 分享图标 */
  icon: string;
  /** 分享地址 */
  url: string;
  /** 分享类型 */
  sourceType: number;
}
class Native {
  /** App分享内容 */
  private shareConfig = {};

  /**  iOS：苹果   Android：安卓  "":其他  */
  @executable()
  getOS() {
    return window.ZWY_CLOUD.getOS();
  }

  /** 手机端-关闭当前页面 */
  @executable()
  close() {
    window.ZWY_CLOUD.appCloseWeb({ type: 0 });
  }

  /** 获取token */
  @executable({
    token: "",
    sessionId: "fd028b66dffe47b680d9f319c91c13cb",
    phone: "13399844444"
  })
  goToken(
    type = 1
  ): Promise<{ token: string; sessionId: string; phone: string }> {
    const result = this.callBack("tokenBack");
    window.ZWY_CLOUD.appSessionToken({
      loginType: type,
      callback: "tokenBack"
    });
    return result;
  }

  /** 获取token */
  @executable({
    token: "",
    sessionId: "fd028b66dffe47b680d9f319c91c13cb",
    phone: "13399844444"
  })

  /** 强制去除token获取登录信息 */
  goForceToken(): Promise<{ token: string; sessionId: string; phone: string }> {
    const result = this.callBack("tokenBack2");
    window.ZWY_CLOUD.appForceToken({
      loginType: "1",
      callback: "tokenBack2"
    });
    return result;
  }

  /**
   * 获取用户登录信息
   */
  @executable({
    token: "",
    sessionId: "fd028b66dffe47b680d9f319c91c13cb",
    phone: "13399844444"
  })
  getUserInfo(): Promise<{ phone: string; sessionId: string; token: string }> {
    return new Promise(resolve => {
      resolve(window.ZWY_CLOUD.getUserInfo());
    });
  }

  /**
   * 设置APP顶部状态栏
   * @param isShow 是否显示APP顶部状态栏 0 or 1
   */
  @executable()
  setTopBar(isShow = 0) {
    window.ZWY_CLOUD.topBarConfig({
      isShowTop: isShow,
      isShowBackBtn: 0,
      isShowTitle: "江南巧",
      isShowMoreBtn: "0"
    });
  }

  /**
   * 设置APP底部状态栏
   * @param isShow 是否显示APP顶部状态栏 0 or 1
   * 原生评论框评论后回调函数(callBack_replyList app 根据这个参数是否传值，区分是直播新闻还是其它新闻，如果评论不需审核，没传值会跳原生评论列表页面)
   */
  @executable()
  setBottomBar(isShow = 0): Promise<any> {
    const result = this.callBack("callBackReplyList");
    /* eslint-disable @typescript-eslint/camelcase */
    window.ZWY_CLOUD.bottomBarConfig({
      isShowBottom: isShow,
      callBack_replyList: "callBackReplyList"
    });
    return result;
  }

  /**
   * 调动APP分享 - 调用之前必须调用 setShareConfig 设置APP分享内容
   */
  @executable()
  shareApp() {
    window.ZWY_CLOUD.share(this.shareConfig as ShareConfig);
  }

  /**
   * 拨打电话(需要webview配合)
   * @param tel 电话号码
   */
  @executable()
  call(tel: string) {
    location.href = `tel:${tel}`;
  }

  /**
   * 设置APP分享内容
   * @param title 分享标题
   * @param content 分享内容
   * @param icon 分享图标地址
   * @param path 分享地址
   */
  setShareConfig(params: ShareConfig) {
    this.shareConfig = params;
  }

  /**
   * 查看单条直播新闻全部评论
   * @param max
   */
  @executable()
  showLiveNewsComment(params: {
    sourceId: number;
    sourceType: number;
    callBackFun: string;
  }) {
    window.ZWY_CLOUD.showLiveNewsComment(params);
  }

  //打开App页面
  @executable()
  pushToController(params: {
    iOS: string;
    Android: string;
    par: {
      id: string;
      informationId: string;
      sourceType: string;
      newsCommentType: string;
    };
  }) {
    window.ZWY_CLOUD.pushToController(params);
  }
  /**
   * 原生消息提示(点击确定按钮消失)  appAlert
   */
  appAlert(params: { message: string }) {
    window.ZWY_CLOUD.appAlert(params);
  }

  /**
   * 图片预览
   */
  @executable()
  viewImageContent(params: {
    array: Array<{ imgUrl: string; desc: string }>;
    index: number;
  }) {
    window.ZWY_CLOUD.viewImageContent(params);
  }

  /** 查看原生页面 */
  @executable()
  showNativeView(
    androidFun: string, // 方法名
    iosFun: string, // 方法名
    par: Record<string, any>
  ) {
    window.ZWY_CLOUD.showNativeView({
      Android: androidFun,
      iOS: iosFun,
      par: par
    });
  }
  /**
   * 上传图片
   * @param max 最大数量
   */
  @executable(
    "http://192.168.6.136:8084/images/common/app_10/serverb16f7322f78a4a70985e0547b863a952_200x200.jpg"
  )
  appUpload(max: number): Promise<string> {
    const result = this.callBack("uploadBack");
    window.ZWY_CLOUD.appUpload({
      callback: "uploadBack",
      num: max
    });
    return result;
  }

  /**
   * 是否在APP中打开
   */
  isOpenInApp() {
    return window.ZWY_CLOUD.isOpenInApp();
  }
  /**
   * 打开原生Webview
   * @param url 跳转URL
   */
  @executable()
  openWebBrowser(params: {
    id: string;
    sourceId: string;
    detailViewType: string;
    sourceType: string;
    commentType: string;
    contextType: string;
    isShowTop: string;
    isShowBottom: string;
    isShowMore: string;
    url: string;
    shareUrl: string;
    title: string;
    synopsis: string;
    shareImgUrl: string;
  }) {
    window.ZWY_CLOUD.redirectUrl(params);
  }

  OpenSystemWeb(url: string) {
    window.ZWY_CLOUD.OpenSystemWeb({ url });
  }

  /**
   * 打开原生评论
   * @param par 参数
   */
  @executable()
  openComment(par: {
    sourceType: string;
    /** sourceid */
    id: string;
    /** 被回复评论id */
    replyId: string;
    /** 被回复人名称 */
    passiveReplyName: string;
    /** 被回复人id */
    passiveReplyId: string;
    myissue: string;
  }) {
    const obj = {
      iOS: "openCommentPage",
      Android: "openCommentPage",
      par
    };
    window.ZWY_CLOUD.showNativeView(obj);
  }

  /**
   * 设置回调函数
   * @param funcName 回调函数名
   */
  private callBack(funcName: string): Promise<any> {
    return new Promise(resolve => {
      (<any>window)[funcName] = (result: string | JSON) => {
        if (typeof result === "string") {
          try {
            result = JSON.parse(result);
            resolve(result);
          } catch {
            resolve(result);
          }
        }
      };
    });
  }
}
export default new Native();
