<template>
  <div class="video-box">
    <div class="box__content">
      <!-- 21.08.19新加 开播倒计时 -->
      <div class="countdown" v-if="showCountdown">
        <span>开始时间：{{ detail.onlineTime }}</span>
        <div class="countdown-card">
          <div>
            <span>{{ countdownTime[0] || "00" }}</span>
          </div>
          <span>:</span>
          <div>
            <span>{{ countdownTime[1] || "00" }}</span>
          </div>
          <span>:</span>
          <div>
            <span>{{ countdownTime[2] || "00" }}</span>
          </div>
        </div>
      </div>
      <Barrage
        v-if="showBarrage"
        :list="showBarrageList"
        @removeList="removeList"
      />
      <template v-if="detail.bannerVideo">
        <div class="content__videos">
          <iframe
            v-if="detail.videoType === 'iframe'"
            class="content-iframe"
            ref="iframe"
            allowfullscreen="true"
            :src="detail.bannerVideo"
            frameborder="0"
          ></iframe>
          <video
            v-else
            class="content-video"
            :src="detail.bannerVideo"
            :poster="detail.bannerImg || ''"
            controls
            x5-video-player-type="h5"
            playsinline="true"
            webkit-playsinline="true"
            preload="metadata"
          ></video>
        </div>
      </template>
      <template v-else>
        <img :src="detail.bannerImg" class="content-img" />
        <div class="content-time" v-if="showOnlineTime">
          开始时间：{{ detail.onlineTime }}
        </div>
      </template>
    </div>
    <div class="box__info">
      <div class="info-title">{{ detail.title }}</div>
      <div class="info-synopsis">{{ detail.synopsis }}</div>
      <div class="info__view-count" v-if="detail.isShowViewNum === 1">
        <img src="../assets/image/观看人数@2x.png" class="view-count-icon" />
        <div class="view-count-text">{{ detail.viewCount }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import dayjs from "dayjs";
import { IChatRoomItem, IDetail } from "@/api/types";
import Barrage from "@/components/barrage/Index.vue";
import { IBarrageItem } from "@/components/barrage/type";

@Component({
  components: {
    Barrage
  }
})
export default class VideoBox extends Vue {
  @Prop()
  detail!: IDetail;
  @Prop()
  barrageList!: IChatRoomItem[];
  @Prop()
  showBarrage!: boolean;
  @Prop()
  showBarrageName!: boolean;

  // 是否显示倒计时
  showCountdown = false;
  // 倒计时时分秒
  countdownTime: string[] = [];

  get showBarrageList(): IBarrageItem[] {
    if (this.barrageList) {
      return this.barrageList.map(item => {
        return {
          content: this.showBarrageName
            ? this.isAnonymaous(item) + " : " + item.content
            : item.content
        };
      });
    }
    return [];
  }

  mounted() {
    this.calculateStartTime(
      this.detail.serverTime || dayjs().format("YYYY-MM-DD HH:mm:ss"),
      "2021-08-26 20:30:00"
      // this.detail.onlineTime
    );
  }

  isAnonymaous(data: IChatRoomItem) {
    if (data.type === 0) {
      return data.name;
    } else if (data.type === 1) {
      return data.anonymousName;
    }
  }

  get showOnlineTime(): boolean {
    const onlineTime = new Date(this.detail.onlineTime.replace(/-/g, "/")); // 传入直播开始时间
    const nowTime = new Date(); // 获取当前时间
    const timeDifference = onlineTime.getTime() - nowTime.getTime(); // 时间差的毫秒数
    if (timeDifference <= 0) {
      return false;
    }
    return true;
  }

  removeList(length: number) {
    this.$emit("removeList", length);
  }

  // 计算当前距离播放时间是否小于100小时
  calculateStartTime(serverTime: string, startTime: string, timer?: number) {
    if (!startTime) return;
    const nowTime = serverTime ? dayjs(serverTime).unix() * 1000 : Date.now(),
      start = dayjs(startTime).unix() * 1000,
      // 当前时间更新
      newServerTime = nowTime + 1000;

    if (start < nowTime) {
      clearTimeout(timer);
      return;
    }

    timer = setTimeout(() => {
      // 100小时及以内开播 显示倒计时
      if (start - nowTime <= 100 * 60 * 60 * 1000 && start > nowTime) {
        const unixMinus = start - nowTime;
        this.showCountdown = true;
        this.countdownTime = this.transferTime(unixMinus / 1000);
      } else {
        this.showCountdown = false;
      }
      this.calculateStartTime(
        dayjs(newServerTime).format("YYYY-MM-DD HH:mm:ss"),
        startTime,
        timer
      );
      clearTimeout(timer);
    }, 1000);
  }

  // 将秒转为时分秒
  transferTime(second: number): string[] {
    if (Number(second) && second > 0) {
      second = parseInt(String(second)); // 舍去秒数以后的小数位
    } else {
      return ["00", "00", "00"];
    }

    // 计算时分秒
    const s = second % 60,
      m = ((second - s) % 3600) / 60,
      h = parseInt(String(second / 3600));

    // 优化输出
    function fn(num: number) {
      return num >= 10 ? String(num) : "0" + num;
    }
    return [fn(h), fn(m), fn(s)];
  }
}
</script>
<style lang="scss" scoped>
.video-box {
  width: 100%;
  .box__content {
    height: 3.75rem;
    position: relative;
    .countdown {
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      padding: 0.12rem 0.16rem;
      position: absolute;
      bottom: 0;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
        font-size: 0.26rem;
      }
      &-card {
        display: flex;
        align-items: center;
        > div {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 0.34rem;
          height: 0.36rem;
          border-radius: 0.04rem;
          background: #ffffff;
          color: #000000;
          span {
            // 这样写解决安卓端字体向上偏移的问题
            font-size: 0.48rem;
            transform: scale(0.5);
          }
        }
        > span {
          margin: 0 0.08rem;
        }
      }
    }
    .content__videos {
      width: 100%;
      height: 100%;
      position: relative;
      .content-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
      .content-video {
        width: 100%;
        height: 100%;
        border: none;
        object-fit: fill;
      }
    }
    .content-img {
      width: 100%;
      height: 100%;
    }
    .content-time {
      background: rgba($color: #000000, $alpha: 0.6);
      height: 0.6rem;
      width: 100%;
      color: #ffffff;
      font-size: 0.24rem;
      padding-left: 0.28rem;

      line-height: 0.6rem;
      position: absolute;
      bottom: 0;
    }
  }
  .box__info {
    padding: 0.22rem 0.29rem;
    .info-title {
      color: #222222;
      font-size: 0.34rem;
      line-height: 0.42rem;
      font-weight: bold;
      margin-bottom: 0.1rem;
    }
    .info-synopsis {
      color: #666666;
      line-height: 0.38rem;
      font-size: 0.28rem;
    }
    .info__view-count {
      display: flex;
      align-items: center;
      .view-count-icon {
        width: 0.16rem;
        height: 0.18rem;
      }
      .view-count-text {
        color: #c22c23;
        font-size: 0.24rem;
        line-height: 0.38rem;
        margin-left: 0.09rem;
      }
    }
  }
}
</style>
