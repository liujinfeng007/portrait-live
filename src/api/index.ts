import axios from "@/common/request";
import {
  IDoPraise,
  IGetChatRoom,
  IGetDetail,
  IGetFloating,
  IGetGiftRecord,
  IGetLiveList,
  IGetLivePoint,
  IGetLiveRedpacket,
  IGetLiveRoom,
  IGetShareInfo,
  IGiftTips,
  ILiveExchange,
  ILiveReply,
  IGetLiveShare,
  IResponse,
  IHosts
} from "./types";
import store from "@/store";

class RequestIndex {
  private get appId() {
    return store.state.appId;
  }

  private get token() {
    return store.state.token;
  }

  private get sessionId() {
    return store.state.sessionId;
  }

  /**
   * 获取直播详情
   * @param infoClassifyId infoClassifyId
   */
  detail(infoClassifyId: string): Promise<IGetDetail> {
    return axios.get(`/live/detail/${infoClassifyId}.html`, {
      params: {
        token: this.token
      }
    });
  }

  /**
   * 获取主持人列表
   * @param infoClassifyId
   */
  getHosts(infoClassifyId: string): Promise<IHosts> {
    return axios.post("/live/hosts.html", {
      appId: this.appId,
      infoClassifyId
    });
  }

  /**
   * 获取礼物列表
   */
  giftList(): Promise<IGetLiveList> {
    return axios.post("/live/live_list.html", {
      appId: this.appId
    });
  }

  /**
   * 用户可用总积分接口
   */
  livePoint(): Promise<IGetLivePoint> {
    return axios.post("/live/live_point.html", {
      appId: this.appId,
      token: this.token,
      sessionId: this.sessionId
    });
  }

  /**
   * 获取唤醒app信息接口
   */
  getShareInfo(): Promise<IGetShareInfo> {
    return axios.post("/getShareInfo.html", {
      appId: this.appId
    });
  }

  /**
   * 获取兑奖记录
   * @param lastId 最后一条记录的ID
   */
  getGiftRecord(lastId: string): Promise<IGetGiftRecord> {
    return axios.post("/live/live_records.html", {
      lastId,
      token: this.token
    });
  }

  /**
   * 直播间列表
   * @param infoClassifyId 资讯ID
   * @param lastReplyId 最后的评论id
   * @param lastId lastId
   * @param lastSortNo 最后一条数据的排序号
   * @param lastCreateTime 最后一条数据时间
   * @param hostIds 筛选主持人
   * @param sort 不为空 升序  默认降序
   */
  getLiveRoom(
    infoClassifyId: string,
    lastReplyId?: number,
    lastId?: number,
    lastSortNo?: number,
    lastCreateTime?: string,
    hostIds?: string[],
    sort = "desc"
  ): Promise<IGetLiveRoom> {
    return axios.post("/live/live_room.html", {
      appId: this.appId,
      token: this.token,
      infoClassifyId,
      lastReplyId,
      lastId,
      lastSortNo,
      lastCreateTime,
      hostIds,
      sort: sort
    });
  }

  /**
   * 聊天室列表
   * @param infoClassifyId 资讯ID
   * @param lastReplyId 最后的评论id
   * @param lastCreateTime 最后的评论时间
   */
  getChatRoom(
    infoClassifyId: string,
    lastCreateTime: string,
    lastReplyId?: number
  ): Promise<IGetChatRoom> {
    return axios.get("/live/chat_room.html", {
      params: {
        infoClassifyId,
        appId: this.appId,
        lastReplyId,
        lastCreateTime,
        token: this.token
      }
    });
  }

  /**
   * 点赞
   * @param userId 被点赞用户 id
   * @param title 资讯标题/评论内容
   * @param infoClassifyId 资讯ID
   */
  doPraise(
    userId: string,
    title: string,
    infoClassifyId: string,
    type: number,
    sourceType = 50
  ): Promise<IDoPraise> {
    return axios.post("/doPraise.html", {
      appId: this.appId,
      sessionId: this.sessionId,
      token: this.token,
      userId,
      title,
      v: 1,
      type,
      sourceId: infoClassifyId,
      sourceType
    });
  }

  /**
   * 判断红包状态接口
   * @param id id
   * @param nickname 当前红包主持人名称
   * @param avatar 当前红包主持人头像
   */
  liveRedpacket(
    id: string,
    nickname: string,
    avatar: string
  ): Promise<IGetLiveRedpacket> {
    return axios.post("/live/live_redpacket/status.html", {
      liveDetailId: id,
      token: this.token,
      nickname,
      avatar
    });
  }

  /**
   * 开启红包
   * @param liveDetailId ID
   */
  openRedpacket(liveDetailId: string): Promise<IGetLiveRedpacket> {
    return axios.post("/live/live_redpacket/openRedpacket.html", {
      liveDetailId,
      token: this.token
    });
  }

  /**
   * 获取评论列表（弹幕）
   * @param infoClassifyId 新闻id
   * @param lastId 最新评论 和 下拉都必须传最后一条id
   */
  liveReply(infoClassifyId: string, lastId?: number): Promise<ILiveReply> {
    return axios.post("/live/live_reply.html", {
      infoClassifyId,
      desc: true,
      lastId
    });
  }

  /**
   * 用户赠送礼物接口
   * @param giftId 礼物id
   * @param sum 礼物送的数量
   * @param informationId 新闻详情id
   * @param titile 新闻标题
   */
  liveExchange(
    giftId: number,
    sum: number,
    informationId: number,
    titile: string
  ): Promise<ILiveExchange> {
    return axios.post("/live/live_exchange.html", {
      token: this.token,
      giftId,
      sum,
      informationId,
      titile
    });
  }

  /**
   * 其他用户展示的礼物
   * @param informationId 新闻ID
   * @param interval 间隔
   */
  giftTips(informationId: string, interval: number): Promise<IGiftTips> {
    return axios.post("/live/gift_tips.html", {
      token: this.token,
      informationId,
      interval
    });
  }

  /**
   * 浮窗列表
   * @param infoClassifyId infoClassifyId
   */
  floating(infoClassifyId: string): Promise<IGetFloating> {
    return axios.post("/live/floating.html", {
      infoClassifyId
    });
  }

  /**
   * 直播分享
   */
  liveShare(infoClassifyId: string): Promise<IGetLiveShare> {
    return axios.post("/live/live_share.html", {
      infoClassifyId,
      appId: this.appId
    });
  }

  /**
   * 分享点赞
   * @param id id
   * @param title 标题
   * @param sourceType sourceType
   */
  doPraiseShare(
    id: string,
    title: string,
    sourceType: number
  ): Promise<IResponse> {
    return axios.post("/doPraiseShare.html", {
      appId: this.appId,
      title: title,
      v: "1",
      type: "0", //0点赞1评论(暂不支持评论)
      sourceId: id,
      sourceType: sourceType //短视频41
    });
  }

  /**
   * 用户评论状态
   * @param id id
   * @param sourceType sourceType
   */
  replyUserStatus(id: string, sourceType: string): Promise<IResponse> {
    console.log(id, sourceType);
    return axios.post("/reply/user/status.html", {
      appId: this.appId,
      token: this.token,
      sourceId: id,
      sourceType: sourceType
    });
  }
}
export default new RequestIndex();
