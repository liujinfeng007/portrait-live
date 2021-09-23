import wx from "weixin-js-sdk"; // 引入wx
import request from "./request";
import { IWXResponse, IWXConfig } from "@/api/types";

/** *
 * 微信分享
 * @param shareTitle 分享标题
 * @param shareDesc 分享详情，摘要，简介
 * @param shareLink 分享的链接 会到redirect.html 中去重定向到分享页面
 * @param shareImgUrl 分享图片地址
 */
export function wxChatShare(
  shareTitle: string,
  shareDesc: string,
  shareLink: string,
  shareImgUrl: string
) {
  const _url = `//actweb.cqliving.com/weixin/getsc.html?a=6&url=${encodeURIComponent(
    window.location.href.split("#")[0]
  )}`;

  request.post<any, IWXResponse>(_url).then(res => {
    const { code, data } = res;
    if (code >= 0) {
      const result: IWXConfig = JSON.parse(data);
      // 若要打印提示，则设置为true
      result.debug = false;
      wx.config(result);
      wx.ready(() => {
        // 分享到朋友圈
        wx.onMenuShareTimeline({
          title: shareTitle,
          link: shareLink,
          imgUrl: shareImgUrl
        });

        // 分享给朋友
        wx.onMenuShareAppMessage({
          title: shareTitle,
          desc: shareDesc,
          link: shareLink,
          imgUrl: shareImgUrl
        });

        // 分享到QQ
        wx.onMenuShareQQ({
          title: shareTitle,
          desc: shareDesc,
          link: shareLink,
          imgUrl: shareImgUrl
        });
      });
    }
  });
}
