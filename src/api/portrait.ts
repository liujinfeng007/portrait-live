/** 竖版直播的接口，单独好区分 */
import axios from "@/common/request";
import { bindState } from "@/common/decorator";
import {
  IGetChatRoom,
  IGetDetail,
  IGetLiveRoom,
  ILiveInfo,
  IResponseT
} from "./types";

class Request {
  @bindState
  appId!: string;
  /**
   * 获取直播详情
   * @param infoClassifyId infoClassifyId
   */
  getLiveDetail(infoClassifyId: string): Promise<IGetDetail> {
    return axios.get(`/live/detail/${infoClassifyId}.html`);
  }

  /**
   * 获取直播间轮训用详情
   * @param params
   * @returns
   */
  getLiveInfo(params: {
    appId: string;
    sourceType: string;
    sourceId: string;
    lastReplyId?: string;
    classifyId?: string;
  }): Promise<IResponseT<ILiveInfo>> {
    return axios.post(`/live/get_live_infos.html`, {
      ...params
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
  getLiveRoom(params: {
    infoClassifyId: string;
    lastReplyId?: number;
    lastId?: number;
    lastSortNo?: number;
    lastCreateTime?: string;
    hostIds?: string[];
    sort: "desc" | "asc";
  }): Promise<IGetLiveRoom> {
    return axios.post("/live/live_room.html", {
      appId: this.appId,
      ...params
    });
  }

  /**
   * 聊天室列表
   * @param infoClassifyId 资讯ID
   * @param lastReplyId 最后的评论id
   * @param lastCreateTime 最后的评论时间
   */
  getChatRoom(params: {
    infoClassifyId: string;
    lastCreateTime: string;
    lastReplyId?: number;
  }): Promise<IGetChatRoom> {
    return axios.get("/live/chat_room.html", {
      params: {
        appId: this.appId,
        ...params
      }
    });
  }

  /** 浮窗列表 */
  getFloatList(infoClassifyId: string) {
    return axios.post(`/live/floating.html`, { infoClassifyId });
  }
}

export default new Request();
