<template>
  <div class="home">
    <div class="home-context">
      <AppPrompt v-if="isOpenApp" :shareInfo="shareInfo" :appId="appId" />
      <Header v-if="false && isShowHeader" />
      <GiftTips @removeGiftTips="removeGiftTips" :giftTips="giftTips" />
      <Suspension v-if="detail" />
      <VideoBox
        v-if="detail"
        :detail="detail"
        :showBarrage="showBarrage"
        :showBarrageName="showBarrageName"
        :barrageList="barrageList"
        @removeList="removeList"
      />
      <van-tabs v-model="active" sticky v-if="tabList.length > 0">
        <van-tab v-for="(item, index) in tabList" :key="index">
          <template #title>
            <img :src="getImg(item, index)" class="tab-icon" />{{ item.title }}
          </template>
          <div
            v-if="activeItem.title === '直播间'"
            class="tab__content tab__live-room"
          >
            <div class="live-room__sort">
              <div class="sort-content" @click="setSort">
                <img :src="liveRoomSortIcon" class="sort-icon" />
                <span>{{ liveRoomSorttext }}</span>
              </div>
            </div>
            <van-list
              v-model="activeItem.loading"
              :finished="activeItem.finished"
              @load="activeItem.onLoad"
              :immediate-check="false"
            >
              <LiveRoomItem
                v-for="(item, index) in liveRoomList"
                :item="item"
                @do-praise="doPraise"
                :key="index"
              />
            </van-list>
          </div>
          <div v-else class="tab__content">
            <van-list
              v-model="activeItem.loading"
              :finished="activeItem.finished"
              @load="activeItem.onLoad"
              :immediate-check="false"
            >
              <ChatRoomItem
                v-for="(item, index) in chatRoomList"
                :item="item"
                @do-praise="doPraise"
                :key="index"
              />
            </van-list>
          </div>
        </van-tab>
      </van-tabs>
      <Gift v-if="giftList.length > 0" :list="giftList" v-model="showGift" />
    </div>

    <div
      class="float-filter-button"
      @click="
        $router.push(
          `/host-filter?id=${$store.state.infoClassifyId}&hostIds=${hostIds}`
        )
      "
    >
      <span>筛选</span>
      <Icon name="filter-o" />
    </div>
    <Footer v-if="detail" :detail="detail" @item-click="footerClick" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Tab, Tabs, List, Icon, Toast } from "vant";
import AppPrompt from "@/components/AppPrompt.vue";
import Header from "@/components/Header.vue";
import VideoBox from "@/components/VideoBox.vue";
import Gift from "@/components/Gift.vue";
import Footer from "@/components/Footer.vue";
import ChatRoomItem from "@/components/ChatRoomItem.vue";
import LiveRoomItem from "@/components/LiveRoomItem.vue";
import Suspension from "@/components/Suspension.vue";
import GiftTips from "@/components/GiftTips.vue";
import request from "@/api/index";
import native from "@/common/Native";
import { wxChatShare } from "@/common/wechat";
import {
  IChatRoomItem,
  IDetail,
  IGiftItem,
  IGiftTipsItem,
  ILiveRoomItem,
  IShareInfo
} from "@/api/types";
import { needToken, toastWithDelay } from "@/common/decorator";

interface ITabItem {
  title: string;
  icon: string;
  activeIcon: string;
  loading: boolean;
  finished: boolean;
  onLoad: Function;
}
@Component({
  components: {
    AppPrompt,
    Header,
    VideoBox,
    ChatRoomItem,
    LiveRoomItem,
    Gift,
    Footer,
    Suspension,
    GiftTips,
    Icon,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List
  }
})
export default class Home extends Vue {
  detail: IDetail | null = null;
  showGift = false;
  shareInfo: IShareInfo | null = null;
  giftList: IGiftItem[] = [];
  chatRoomList: IChatRoomItem[] = [];
  liveRoomList: ILiveRoomItem[] = [];
  barrageList: IChatRoomItem[] = [];
  giftTips: IGiftTipsItem[] = [];
  showBarrage = true;
  showBarrageName = false;
  tabList: ITabItem[] = [
    {
      title: "直播间",
      icon: "",
      activeIcon: "",
      loading: false,
      finished: false,
      onLoad: () => {
        console.log(12);
        console.log(this.tabList[this.active].loading);
        this.getLiveRoom("load");
      }
    },
    {
      title: "聊天室",
      icon: "",
      activeIcon: "",
      loading: false,
      finished: false,
      onLoad: this.getChatRoomList
    }
  ];
  isOpenApp = false;
  active = 0;
  liveRoomSort = "DESC";
  taskTimer = 0;
  // 主持人筛选id
  hostIds: string[] = [];

  get isShowHeader() {
    if (!native.isOpenInApp() || native.getOS() === "iOS") {
      return false;
    }
    return true;
  }

  get liveRoomSortIcon() {
    if (this.liveRoomSort === "DESC") {
      return require("../assets/image/降序@2x.png");
    } else {
      return require("../assets/image/升序@2x.png");
    }
  }

  get liveRoomSorttext() {
    if (this.liveRoomSort === "DESC") {
      return "按时间降序";
    } else {
      return "按时间升序";
    }
  }

  get activeItem() {
    return this.tabList[this.active];
  }

  get appId() {
    return this.$store.state.appId;
  }

  get infoClassifyId() {
    return this.$store.state.infoClassifyId;
  }

  activated() {
    this.$route.query.id &&
      this.$store.commit("SET_STATE", {
        infoClassifyId: this.$route.query.id
        // infoClassifyId: 5359647
      });
    if (this.$route.query.hostIds) {
      this.hostIds = (this.$route.query.hostIds as string).split("-");
    } else {
      this.hostIds = [];
    }
    this.liveRoomList = [];
    // 2957392 3004391
    this.getDetail();
  }

  init() {
    if (this.detail!.isShowLiveRoom === 0) {
      this.tabList.splice(
        this.tabList.findIndex(item => item.title === "直播间"),
        1
      );
    }
    if (this.detail!.isShowChat === 0) {
      this.tabList.splice(
        this.tabList.findIndex(item => item.title === "聊天室"),
        1
      );
    }
    this.tabList.forEach(item => {
      if (item.title === "直播间") {
        item.icon =
          this.detail!.liveRoomDarkIcon ||
          require("../assets/image/直播间icon（未选中）@2x.png");
        item.activeIcon =
          this.detail!.liveRoomIcon ||
          require("../assets/image/直播间icon（选中）@2x.png");
      } else {
        item.icon =
          this.detail!.chatDarkIcon ||
          require("../assets/image/聊天室icon（未选中）@2x.png");
        item.activeIcon =
          this.detail!.chatIcon ||
          require("../assets/image/聊天室icon（选中）@2x.png");
      }
    });
    this.isOpenApp = !native.isOpenInApp();
    this.showBarrage = this.detail!.isShowBulletScreen === 1;
    this.showBarrageName = this.detail!.isShowBulletScreenName === 1;
    if (localStorage.getItem("barrageStatus") === "false") {
      this.showBarrage = false;
    }
    this.getLiveShareInfo();
    if (native.isOpenInApp()) {
      native.setBottomBar().then(() => {});
      // if (this.isShowHeader) {
      //   native.setTopBar();
      // }
    }
    this.getLiveRoom("mounted");
    this.getChatRoomList();
    this.getGiftList();
    this.getShareInfo();
    this.getLiveReply();
    this.taskList();
  }

  getImg(item: ITabItem, index: number) {
    if (index === this.active) {
      return item.activeIcon;
    } else {
      return item.icon;
    }
  }

  @needToken(false)
  async getDetail() {
    const result = await request.detail(this.infoClassifyId);
    if (result.code === 0) {
      this.detail = result.data;
      document.title = this.detail.title;
      this.$store.commit("SET_STATE", {
        detail: result.data,
        appId: result.data.appId || "1"
      });
      this.init();
    }
  }

  async getLiveShareInfo() {
    const result = await request.liveShare(this.infoClassifyId);
    if (native.isOpenInApp()) {
      native.setShareConfig({
        title: result.data.shareTitle,
        content: result.data.synopsis,
        icon: result.data.logo,
        url: result.data.shareUrl,
        sourceType: result.data.sourceType
      });
    } else {
      wxChatShare(
        result.data.shareTitle,
        result.data.synopsis,
        result.data.shareUrl,
        result.data.logo
      );
    }
  }

  footerClick(text: string, value?: boolean) {
    new Map([
      [
        "gift",
        () => {
          this.showGift = true;
        }
      ],
      [
        "zan",
        async () => {
          const result = await request.doPraise(
            "",
            this.detail!.title,
            this.infoClassifyId,
            0,
            1
          );
          if (result.data) {
            this.detail!.praiseCount += 1;
            this.detail!.isPraise = true;
          }
        }
      ],
      [
        "share",
        () => {
          native.shareApp();
        }
      ],
      [
        "barrage",
        () => {
          this.showBarrage = value!;
        }
      ]
    ]).get(text)!();
  }

  async getGiftList() {
    const result = await request.giftList();
    if (result.code === 0) {
      this.giftList = result.data.pageResults;
    }
  }

  async getShareInfo() {
    const result = await request.getShareInfo();
    if (result.code === 0) {
      this.shareInfo = result.data;
      this.$store.commit("SET_STATE", {
        downloadUrl: result.data.downloadUrl
      });
    }
  }

  /** 获取直播间列表 */
  @toastWithDelay({
    message: "加载中...",
    forbidClick: true,
    overlay: true,
    condition: (tag: "mounted" | "sort" | "load") => tag === "mounted"
  })
  @needToken(false)
  async getLiveRoom(tag?: "mounted" | "sort" | "load") {
    const lastItem = this.liveRoomList.lastChild || { id: "" };
    const current = this.tabList[this.active];
    const result = await request.getLiveRoom(
      this.infoClassifyId,
      lastItem.compereId || undefined,
      lastItem.id || undefined,
      lastItem.sortNo || undefined,
      lastItem.createTime || undefined,
      this.hostIds,
      this.liveRoomSort === "DESC" ? "" : "ASC"
    );
    console.log("直播间列表数据", result.data);
    if (!result.data || result.data.length === 0) {
      current.finished = true;
    } else {
      current.loading = false;
      this.liveRoomList = this.liveRoomList.concat(result.data);
    }
    if (tag === "sort" || tag === "mounted") {
      this.tabList.find(item => item.title === "直播间")!.finished = false;
    }
  }

  /** 获取聊天室列表 */
  @needToken(false)
  async getChatRoomList() {
    const lastItem = this.chatRoomList.lastChild || {};
    const current = this.tabList[this.active];
    const result = await request.getChatRoom(
      this.infoClassifyId,
      lastItem.createTime,
      lastItem.id
    );
    if (!result.data || result.data.length === 0) {
      current.finished = true;
    } else {
      current.loading = false;
      this.chatRoomList = this.chatRoomList.concat(result.data);
    }
  }

  @needToken(false)
  async addLiveRoom() {
    if (this.liveRoomSort === "ASC") {
      return;
    }
    const firstItem = this.liveRoomList[0] || { id: "" };
    const result = await request.getLiveRoom(
      this.infoClassifyId,
      firstItem.compereId,
      firstItem.id,
      firstItem.sortNo,
      firstItem.createTime,
      this.hostIds,
      "ASC"
    );
    if (result.data && result.data.length > 0) {
      result.data.forEach(item => {
        this.liveRoomList.unshift(item);
      });
    }
  }

  @needToken(false)
  async addChatRoom() {
    const result = await request.getChatRoom(
      this.infoClassifyId,
      "",
      undefined
    );
    if (result.data && result.data.length > 0) {
      // 将已点赞的数据同步到新加的数据中
      result.data.forEach(item => {
        const i = this.chatRoomList.find(i => i.id === item.id);
        if (i) {
          item.isPraise = i.isPraise;
        }
      });
      const { length } = result.data;
      // 处理最新页不满10条的特殊情况
      if (length < 10) {
        this.chatRoomList = result.data;
      } else {
        this.chatRoomList.splice(0, length);
        this.chatRoomList = result.data.concat(this.chatRoomList);
      }
    }
  }

  doPraise(id: number, type: 1 | 2) {
    if (type === 1) {
      const item = this.liveRoomList.find(item => item.id === id)!;
      item.isPraise = true;
      item.praiseCount += 1;
    } else {
      const item = this.chatRoomList.find(item => item.id === id)!;
      item.isPraise = true;
      item.praise += 1;
    }
  }

  /** 设置直播间评论升序降序排列 */
  setSort() {
    // this.tabList.find(item => item.title === "直播间")!.finished = false;
    this.liveRoomSort = this.liveRoomSort === "DESC" ? "ASC" : "DESC";
    this.liveRoomList = [];
    this.getLiveRoom("sort");
  }

  async getLiveReply(isAdd = false) {
    const lastItem = this.barrageList.lastChild || {};
    const result = await request.liveReply(this.infoClassifyId, lastItem.id);
    if (result.code === 0) {
      if (isAdd) {
        this.barrageList = this.barrageList.concat(result.data);
      } else {
        this.barrageList = result.data;
      }
    }
  }

  async getGiftTips() {
    const result = await request.giftTips(
      this.detail!.informationId,
      this.detail?.pollTime || 8000
    );
    if (result.code === 0) {
      this.giftTips = this.giftTips.concat(result.data);
    }
  }

  removeList(length: number) {
    if (this.barrageList.length > 50) {
      this.barrageList.splice(0, this.barrageList.length - length);
    }
  }

  removeGiftTips(length: number) {
    this.giftTips.splice(0, this.giftTips.length - length);
  }

  taskList() {
    const time = this.detail?.pollTime || 8000;
    this.taskTimer = setInterval(() => {
      this.getLiveReply(true);
      this.getGiftTips();
      this.addLiveRoom();
      this.addChatRoom();
    }, time);
  }

  deactivated() {
    clearInterval(this.taskTimer);
  }
}
</script>
<style lang="scss" scoped>
.home {
  .home-context {
    width: 100%;
    height: calc(100% - 1.01rem);
    overflow: auto;
    ::v-deep {
      .van-tabs__wrap {
        height: 0.86rem;
        box-shadow: 0px 0.04rem 0.16rem 0px rgba(0, 0, 0, 0.1);
        padding-bottom: 0.08rem;

        border-top: 1px solid #ebebeb;
        .van-tabs__line {
          width: 1rem;
          height: 0.04rem;
          background-color: #1266ef;
        }
        .van-tab {
          .van-tab__text {
            font-size: 0.32rem;
            line-height: 0.38rem;
            color: #56595e;
            .tab-icon {
              width: auto;
              height: 0.26rem;
              margin-right: 0.12rem;
            }
          }
        }
        .van-tab--active {
          .van-tab__text {
            color: #222222;
          }
        }
      }
    }
    .tab__content {
      margin-bottom: 0.2rem;
    }
    .tab__live-room {
      width: 100%;
      padding-left: 0.6rem;
      margin-bottom: 0;
      .live-room__sort {
        width: 100%;
        margin-top: 0.5rem;
        position: relative;
        border-left: 1px solid #082783;
        padding-bottom: 0.2rem;
        .sort-content {
          color: #666666;
          font-size: 0.24rem;
          line-height: 1;
          width: 1.92rem;
          height: 0.38rem;
          background-color: #ffffff;
          border: solid 1px #666666;
          margin-left: 0.64rem;
          padding: 0.06rem 0.1rem;
          .sort-icon {
            width: 0.28rem;
            height: 0.2rem;
            margin-right: 0.06rem;
          }
        }
        &::before {
          content: "";
          display: inline-block;
          width: 0.07rem;
          height: 0.16rem;
          border-radius: 0.04rem;
          background-color: #082783;
          position: absolute;
          left: -0.05rem;
        }
      }
    }
  }
  .float-filter-button {
    display: flex;
    align-items: center;
    position: fixed;
    background: #bb3e32;
    color: #ffffff;
    left: 0;
    top: 40%;
    padding: 0.14rem 0.18rem;
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
    font-weight: bold;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    span {
      margin-right: 0.05rem;
    }
  }
}
</style>
