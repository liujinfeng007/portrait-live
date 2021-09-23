<template>
  <div class="living">
    <!-- <DownloadHeader /> -->
    <LiveHeader :detail="liveDetail" />
    <video
      id="video-live"
      ref="video-live"
      x5-video-player-type="h5"
      x5-video-orientation="portrait"
      autoplay
      class="video-js vjs-default-skin box"
      controls
      muted
      preload="auto"
      style="width: 100vw; height: 100%; object-fit: cover;"
      v-bind="$attrs"
      :poster="videoOptions.poster"
      :playsinline="true"
      :webkitPlaysinline="true"
    >
      <source :src="videoSrc" type="application/x-mpegURL" />
    </video>

    <div
      class="play-btn"
      :style="{
        height: `calc(100% - ${footerHeight}px)`,
        opacity: isPause ? 1 : 0
      }"
      @click="onPlay"
    >
      <img src="../../assets/play-btn.png" alt="" />
    </div>

    <!-- 互动展示与操作区域 -->
    <div class="interact-exhibition">
      <Comment ref="comment" />
      <div class="interactive-button">
        <Badge :content="3">
          <img :src="require('../../assets/money.png')" alt="红包" />
        </Badge>
        <img :src="require('../../assets/shopping.png')" alt="购物车" />
      </div>
    </div>

    <div class="interact-footer" ref="footer">
      <Slider
        v-model="vProgress"
        @change="onChange"
        button-size="10px"
        active-color="#ffffff"
      />
      <div class="interact-footer-operation">
        <input
          type="text"
          v-model="comment"
          placeholder="说点什么..."
          @keyup.enter="onCommentSend"
        />
        <div class="right-button">
          <Icon name="like-o" color="#ffffff" size=".5rem" />
          <Icon name="gift-o" color="#ffffff" size=".5rem" />
          <Icon name="more-o" color="#ffffff" size=".5rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, ProvideReactive } from "vue-property-decorator";
import { Slider, Icon, Badge, Toast } from "vant";
import DownloadHeader from "./components/Header.vue";
import Comment from "./components/Comment.vue";
import LiveHeader from "./components/LiveHeader.vue";
import req from "@/api/portrait";
import { IClassify, IGetDetail, ILiveInfo, IReplyItem } from "@/api/types";
import { isFunction } from "@/common/is";

@Component({
  components: {
    DownloadHeader,
    LiveHeader,
    Comment,
    Slider,
    Icon,
    Badge
  }
})
export default class Living extends Vue {
  // 直播间详情
  @ProvideReactive("liveDetail")
  liveDetail: IGetDetail["data"] = {} as IGetDetail["data"];
  // 直播间轮询信息
  @ProvideReactive("liveInfo")
  liveInfo: ILiveInfo = {
    replyList: [] as IReplyItem[],
    classifyList: [] as IClassify[]
  } as ILiveInfo;
  // videojs实例
  vPlayer: videojs.VideoJsPlayer | null = null;
  // 直播实时更新时常
  vDuration = 0;
  // 缓冲进度
  vProgress = 0;
  // 评论
  comment = "";
  // 底部操作区高度
  footerHeight = 0;
  // 播放暂停状态
  isPause = false;
  videoSrc =
    "https://imagecdn.cqliving.com/livevideo/jlp/1624330290724109/m3u8/tll166j.m3u8";

  videoOptions: videojs.VideoJsPlayerOptions = {
    controls: false,
    autoplay: true,
    poster: require("../../assets/poster.jpeg")
  };
  // 分页信息
  page: Partial<{ lastReplyId: string; classifyId: string }> = {};

  scale = 1;

  mounted() {
    document.title = "新闻直播";
    this.footerHeight = (this.$refs.footer as HTMLElement).offsetHeight;
    this.initVideo();
    // this.preventBack();
    // const height = document.documentElement.clientHeight;
    // this.onResize(height);
    this.getLiveDetail();
  }

  // 获取直播间基本详情
  async getLiveDetail() {
    req
      .getLiveDetail("28272")
      .then(res => {
        this.liveDetail = res.data;
        this.$store.commit("SET_STATE", {
          detail: res.data,
          appId: res.data.appId || "1"
        });
      })
      .catch(() => {
        Toast.fail("获取直播间信息失败");
      })
      .finally(() => {
        this.doPolling(this.getLiveInfo, {
          immediate: true,
          wait: 9999999999 || this.liveDetail.pollTime || 8000
        });
      });
  }

  // 轮训用信息
  async getLiveInfo() {
    if (!this.liveDetail.appId) return;
    req
      .getLiveInfo({
        appId: "1", //this.liveDetail.appId,
        sourceType: this.liveDetail.sourceType || "1",
        sourceId: (this.$route.query.id as string) || "28272",
        ...this.page
      })
      .then(res => {
        if (res.code === 0) {
          Object.keys(res.data).forEach(key => {
            if (!["replyList", "classifyList"].includes(key)) {
              Object.assign(this.liveInfo, {
                [key]: res.data[key as keyof ILiveInfo]
              });
            }
          });
          if (res.data.replyList.length) {
            this.liveInfo.replyList.push(...res.data.replyList);
            this.page.lastReplyId = res.data.replyList[0].replyId;
          }
          if (res.data.classifyList.length) {
            this.liveInfo.classifyList.push(...res.data.classifyList);
            this.page.classifyId = res.data.classifyList[0].id;
          }
        }
      });
  }

  // 轮询函数
  doPolling(
    cb: () => void,
    {
      immediate,
      wait = 8000,
      stop
    }: {
      immediate?: boolean;
      wait?: number;
      stop?: (timer: number) => unknown;
    },
    timer?: number
  ) {
    if (!timer && immediate) {
      isFunction(cb) && cb();
    }
    timer = setTimeout(() => {
      isFunction(cb) && cb();
      this.doPolling(cb, { immediate, wait, stop }, timer);
    }, wait);

    isFunction(stop) && stop(timer);
  }

  // 安卓监听键盘事件 解决窗口挤压问题
  onResize(height: number) {
    const vContainer = document.querySelector(".living") as HTMLElement,
      bodyEl = document.body as HTMLElement,
      domEl = document.documentElement as HTMLElement;

    window.addEventListener("resize", () => {
      if (window.innerHeight < height) {
        // const rate = window.innerWidth / window.innerHeight;
        // this.scale = 1 * rate;

        // 高度设置为软键盘弹出前的
        vContainer.style.height = height + "px";
        bodyEl.style.height = height + "px";
        domEl.style.height = height + "px";

        console.log(bodyEl.offsetHeight);
      } else {
        vContainer.scrollIntoView();
      }
    });
  }

  // 处理自动播放 兼容性较差
  // handleAutoPlay() {
  //   const _this = this;
  //   document.addEventListener("WeixinJSBridgeReady", function() {
  //     console.log("ready");
  //     // @ts-ignore
  //     window.WeixinJSBridge.invoke("getNetworkType", {}, function(e) {
  //       const videoEl = _this.$refs["video-live"] as HTMLVideoElement;
  //       setTimeout(()=> {
  //         console.log("执行：", videoEl);
  //         videoEl.play();
  //       }, 2000)
  //     });
  //   }, false);
  // }

  // 时间轴改变
  onChange(targetTime: number) {
    if (this.vDuration === 0 || !this.vPlayer) return;
    this.vPlayer.currentTime((targetTime / 100) * this.vDuration);
  }

  // 发送评论
  onCommentSend() {
    // (this.$refs.comment as Comment).addComment({
    //   name: `小周-${Date.now()
    //     .toString()
    //     .slice(8)}`,
    //   content: this.comment
    // });
    // this.comment = "";
  }

  // 点击播放
  onPlay() {
    !this.isPause ? this.vPlayer?.pause() : this.vPlayer?.play();
    setTimeout(() => {
      this.isPause = !this.isPause;
    }, 150);
  }

  // 初始化播放器
  initVideo() {
    if (navigator.userAgent.toLowerCase().includes("micromessenger")) {
      this.isPause = true;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    this.vPlayer = this.$video("video-live", this.videoOptions, () => {
      if (!this.vPlayer) return;
      // 进度条更新
      this.vPlayer.on("timeupdate", function(this: videojs.VideoJsPlayer) {
        _this.isPause = false;
        const currentTime = this.currentTime(),
          duration = this.duration();
        _this.$nextTick(() => {
          // m3u8 即hls，分段直播流，时长会不断更新
          _this.vDuration = duration;
          _this.vProgress = (currentTime / duration) * 100;
        });
      });
    });
  }

  // 筛选页面考虑到ios上用户体验（避免页面栈中大于1底部出现返回bar） 改为以全屏组件的形式存在
  // 这里是解决安卓机在筛选页面直接通过物理按键返回导致页面直接关闭问题
  // 竖屏直播又没设计筛选了 所以这个暂时屏蔽
  // preventBack() {
  //   // @ts-ignore
  //   history.pushState(null, null, document.URL);
  //   window.addEventListener("popstate", () => {
  //     // @ts-ignore
  //     history.pushState(null, null, document.URL);
  //   });
  // }

  deactivated() {
    this.onPlay();
  }
}
</script>

<style lang="scss" scoped>
.flex-bt {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.living {
  position: relative;
  height: 100%;
  .play-btn {
    position: absolute;
    top: 0;
    width: 100vw;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    z-index: 999;
    transition: 0.3s ease;
    img {
      margin: 0 auto;
      width: 1.2rem;
      height: 1.2rem;
      z-index: 9999999999;
    }
  }
  .interact-exhibition {
    position: fixed;
    z-index: 1000;
    width: calc(100vw - 0.4rem);
    height: auto;
    bottom: 1.5rem;
    padding: 0.2rem;
    display: flex;
    > *:first-child {
      flex: 3;
      margin-right: 0.4rem;
    }
    > *:last-child {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      img {
        width: 1rem;
        height: 1rem;
        &:last-child {
          transform: scale(0.75);
        }
      }
    }
  }
  .interact-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    &-operation {
      padding: 0.15rem;
      @extend .flex-bt;
      input {
        border-radius: 0.5rem;
        border: none;
        background: rgba(255, 255, 255, 0.2);
        height: 0.5rem;
        padding: 0.15rem 0.2rem;
        flex: 5;
        margin-right: 0.2rem;
        color: #ffffff;
      }
      .right-button {
        @extend .flex-bt;
        flex: 2;
      }
    }
  }
}

*::-webkit-input-placeholder {
  color: #ffffff;
}
</style>
