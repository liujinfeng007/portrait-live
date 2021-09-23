/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 通用返回结构
 */
export interface IResponse {
  code: number;
  message: string;
  sessionId: string;
  data: any;
}

export interface IResponseT<T> {
  code: number;
  message: string;
  sessionId: string;
  data: T;
}

export interface IWXResponse extends IResponse {
  data: string;
}

/** 唤醒APP信息 */
export interface IShareInfo {
  /** 顶图	 */
  shareBg: string;
  /** 分享图标	 */
  shareLogo: string;
  /** 客户端名字	 */
  appName: string;
  /** 客户端下载地址	 */
  downloadUrl: string;
  /** 底图 */
  shareClose: string;
  /** scheme */
  schemeUrl: string;
}
/** 获取唤醒APP信息 */
export interface IGetShareInfo extends IResponse {
  data: IShareInfo;
}

export interface IWXConfig {
  /** 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。 */
  debug: boolean;
  /** 公众号的唯一标识 */
  appId: string;
  /** 生成签名的时间戳 */
  timestamp: number;
  /** 生成签名的随机串 */
  nonceStr: string;
  /**签名*/
  signature: string;
  /** Js */
  jsApiList: string[];
}

/**
 * 获取直播详情
 */
export interface IGetDetail extends IResponse {
  data: IDetail;
}

export interface IHosts extends IResponse {
  data: {
    /** 主持人ID */
    id: number;
    /** 主持人所属app名 */
    hostAppName: string;
    /** 主持人头像 */
    avatarUrl: string;
  }[];
}

/**
 * 详情
 */
export interface IDetail {
  appId: string;
  /** 摘要 */
  synopsis: string;
  /** 标题 */
  title: string;
  /** 广告位图片 */
  bannerImg: null;
  /** 直播时间 */
  onlineTime: string;
  /** 视频类型 */
  videoType: string;
  /** video链接 */
  qkVideoUrl: null;
  /** iframe 链接 */
  qkIframeUrl: null;
  /** 视频 */
  bannerVideo: string;
  /** 浏览量 */
  viewCount: string;
  sourceType: string;
  /** 是否显示浏览量 */
  isShowViewNum: null;
  informationId: string;
  /** 是否显示聊天室 */
  isShowChat: number;
  /** 是否显示直播间{0:不显示，1：显示} */
  isShowLiveRoom: number;
  /** 直播间图标 */
  liveRoomIcon: string;
  /** 聊天室图标 */
  chatIcon: null;
  /** 直播间图标未选中 */
  liveRoomDarkIcon: string;
  /** 聊天室图标未选中 */
  chatDarkIcon: string;
  /** 是否显示弹幕 */
  isShowBulletScreen: number;
  /** 是否显示弹幕用户名 */
  isShowBulletScreenName: number;
  /** 是否允许评论点赞 */
  isCommentPraise: number;
  /** 是否接受礼物 */
  isGift: number;
  /** 是否允许评 */
  commentType: number;
  /** 点赞量 */
  praiseCount: number;
  /** 是否点赞 */
  isPraise: boolean;
  /** 轮询间隔 */
  pollTime: number;
  /** 服务器时间 */
  serverTime: string;
  /** 直播状态 {0:未开始,1:直播中,2:直播结束} */
  status: 0 | 1 | 2;
}

/**
 * 获取礼物列表
 */
export interface IGetLiveList extends IResponse {
  data: {
    pageResults: IGiftItem[];
  };
}

/**
 * 礼物列表项
 */
export interface IGiftItem {
  /** 礼物id */
  id: number;
  /** 礼物名称 */
  giftName: string;
  /** 礼物图片 */
  giftImg: string;
  /** 所需积分数 */
  pointSum: number;
  /** 排序号 */
  sortNo: number;
  /** 状态 */
  status: number;
  /** 礼物动画  */
  giftGif: string;
  /** 动画展示时间 */
  showTime: number;
}

/**
 * 获取用户可用积分
 */
export interface IGetLivePoint extends IResponse {
  data: number;
}

/**
 * 获取礼物兑换记录
 */
export interface IGetGiftRecord extends IResponse {
  data: {
    pageResults: IGiftRecord[];
  };
}
/**
 * 礼物兑换记录
 */
export interface IGiftRecord {
  id: number;
  /** 用户ID */
  userId: number;
  /** 消耗积分*/
  point: number;
  /** 礼物名称*/
  description: string;
  /** 创建时间*/
  createTime: string;
  /** 直播标题*/
  title: string;
}

/**
 * 获取聊天室列表
 */
export interface IGetChatRoom extends IResponse {
  data: IChatRoomItem[];
}

/**
 * 聊天室列表项
 */
export interface IChatRoomItem {
  /** 评论id */
  id: number;
  /** 评论用户名 */
  replyUserName: string;
  /** 评论匿名 */
  anonymousName: string;
  sourceType: string;
  name: string;
  nickname: string;
  replyUserId: string;
  /** 评论头像 */
  replyUserUrl: string;
  /** 评论内容 */
  content: string;
  /** 评论图片 */
  imageUrl: string;
  /** 点赞数 */
  praise: number;
  /** 回复源标题（内容） */
  sourceTitle: string;
  /** 被回复人id */
  passiveReplyId: string;
  /** 被回复人名称 */
  passiveReplyName: string;
  /** 评论时 */
  createTime: string;
  /** 是否已经点赞 */
  isPraise: boolean;
  /** 类型{0:正常回复,1:匿名,2:游客回复,3:官方回复} */
  type: number;
}

/**
 * 点赞接口
 */
export interface IDoPraise extends IResponse {
  data: boolean;
}

/**
 * 获取直播列表
 */
export interface IGetLiveRoom extends IResponse {
  data: ILiveRoomItem[];
}

/**
 * 直播列表项
 */
export interface ILiveRoomItem {
  id: number;
  /** 主持人id */
  compereId: number;
  informationId: string;
  /** 主持人头像 */
  avatar: string;
  /** 主持人名称 */
  compereName: string;
  /** 创建时间 */
  createTime: string;
  /** 内容 */
  content: string;
  /** 是否已经点赞 */
  isPraise: boolean;
  /** 点赞数 */
  praiseCount: number;
  /** 排序号 */
  sortNo: number;
  sourceType: string;
  /** 图文直播间是否允许评论点赞{0:否,1:是} */
  isCommentPraise: boolean;
  /** 图片及超链接 */
  imageHyperLink: {
    /** 图片 */
    image: string;
    /** 超链接 */
    hyperLink: string;
  }[];
  /** 是否红包{0:否,1:是} */
  isRedpacket: number;
  /** 红包ID */
  redpacketId: number;
  liveRedpacketDto: {
    /** 类型{1:现金红包,2:积分红包} */
    type: number;
    /** 红包留言 */
    message: string;
  };
  /** 视频 */
  video: string;
  /** 视频封面 */
  videoImg: string;
  /** 关联的新闻 */
  newsUrls: {
    /** 标题 */
    title: string;
    /** 链接 */
    url: string;
  }[];
  commentDtoList: ICommentItem[];
}
/**
 * 评论项
 */
export interface ICommentItem {
  /** 评论昵称 */
  nickname: string;
  /** 评论头像 */
  replyUserUrl: string;
  /** 评论内容 */
  content: string;
}

/**
 * 获取红包状态
 */
export interface IGetLiveRedpacket extends IResponse {
  data: ILiveRedpacket;
}

/**
 * 红包状态
 */
export interface ILiveRedpacket {
  /** 状态{0:未登录,1:已领取,2:未领完,3:已领完,4:已过期 }	*/
  redpacketStatus: number;
  /** 领取额	*/
  quota: string;
  /** 兑奖状态{0:可兑换,1:已兑换,2:已过期}	*/
  awardStatus: number;
  /** 新闻id	*/
  liveDetailId: number;
  /** 类型{1:现金红包,2:积分红包}',	*/
  type: number;
  /** 头像	*/
  img: string;
  /** 标语	*/
  message: string;
  /** 名称	*/
  name: string;
  /** 微信公众号名称	*/
  accName: string;
  /** 兑换码*/
  code: string;
}

/**
 * 获取评论列表（弹幕）
 */
export interface ILiveReply extends IResponse {
  data: IChatRoomItem[];
}

/**
 * 用户赠送礼物接口
 */
export interface ILiveExchange extends IResponse {
  data: boolean;
}

/**
 * 其他用户展示的礼物接口
 */
export interface IGiftTips extends IResponse {
  data: IGiftTipsItem[];
}

/**
 * 其他用户展示的礼物项
 */
export interface IGiftTipsItem {
  id: number;
  userId: number;
  /** 礼物名称 */
  giftName: string;
  /** 赠送时间 */
  createTime: string;
  /** 赠送的用户昵称 */
  nickname: string;
  informationId: number;
  /** 总数个数 */
  sum: number;
  /** 礼物图片 */
  giftImg: string;
  /** 礼物动画  */
  giftGif: string;
  giftId: number;
  compereIds: string;
}

/**
 * 浮窗列表项
 */
interface IAdverInfoListItem {
  id: number;
  /** 广告分组id */
  adverGroupId: number;
  /** 链接图标 */
  linkIcon: string;
  /** 跳转地址 */
  linkUrl: string;
  /**  链接内容 */
  linkContent: string;
  status: number;
  createTime: string;
  creatorId: number;
  creator: string;
  updateTime: string;
  updatorId: number;
  updator: string;
}

/**
 * 浮窗列表
 */
interface IFloating {
  /** id */
  id: number;
  /** 分组名 */
  groupName: string;
  /** 分组图标 */
  groupIcon: string;
  /** 状态 */
  status: number;
  /** 创建时间  */
  createTime: string;
  /** isJump  意思是是否评论后跳转  0:不需要验证评论就跳转，1:需要验证评论才跳转*/
  isJump: number;
  creatorId: number;
  creator: string;
  updateTime: string;
  updatorId: number;
  updator: string;
  adverInfoList: IAdverInfoListItem[];
}

/**
 * 获取浮窗列表
 */
interface IGetFloating extends IResponse {
  data: IFloating;
}

/**
 * 获取分享信息
 */
interface IGetLiveShare extends IResponse {
  data: ILiveShare;
}

/**
 * 分享信息
 */
interface ILiveShare {
  appId: number;
  appName: string;
  logo: string;
  downloadUrl: string;
  appstoreUrl: string;
  schemeUrl: string;
  shareTitle: string;
  title: string;
  synopsis: string;
  reqUrl: string;
  contextTypeAmend: number;
  id: number;
  sourceId: number;
  sourceType: number;
  detailViewType: number;
  commentType: number;
  redirectUrl: string;
  shareUrl: string;
  shareImgUrl: string;
  isTopic: string;
}

/** 竖屏直播轮循直播信息 */
// 最新的主持人信息 字段根据后端取名
export type IClassify = {
  avatar: string;
  commentDtoList: string[];
  compereId: number;
  compereName: string;
  content: string;
  createTime: string;
  id: string;
  imageHyperLink?: string;
  informationId: number;
  isCommentPraise?: string;
  isPraise: boolean;
  isRedpacket: number;
  liveRedpacketDto?: string;
  newsUrls?: string;
  praiseCount: number;
  redpacketId?: string;
  sortNo: number;
  sourceType: number;
  userId?: string;
  video?: string;
  videoImg?: string;
};

// 弹幕列表
export type IReplyItem = {
  appId: string;
  commentTime: string;
  content: string;
  createTime: string;
  headerImg: string;
  imageUrl: string;
  isHot?: number;
  isPraised?: number;
  isProblemUser?: number;
  isRefined?: number;
  passiveReplyContent: "直播呱呱呱";
  passiveReplyImageUrl: string;
  passiveReplyName?: string;
  passiveReplyUserId?: string;
  place?: string;
  praiseCount: number;
  replyCount: number;
  replyId: string;
  sourceId?: string;
  type?: string;
  userId: string;
};

// 轮循直播信息
export interface ILiveInfo {
  /** 自动刷新频率 */
  autoRefreshFrequency: number;
  /** 主持人轮播最新 */
  classifyList: IClassify[];
  /** 悬浮窗 */
  floating: IFloating[];
  /** 礼物 */
  giftRecordList: IGiftRecord[];
  /** 红包 */
  redPocketList: ILiveRedpacket[];
  redPocketNumber: number;
  /** 弹幕列表 */
  replyList: IReplyItem[];
}
