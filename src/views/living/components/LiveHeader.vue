<template>
  <div class="live-header">
    <div class="live-detail">
      <div class="title radius-shadow" @click="showDetail = true">
        <p>{{ prefix }} | {{ detail.title }}</p>
        <Icon
          :name="showDetail ? 'arrow-up' : 'arrow-down'"
          style="margin-left: 0.1rem;"
        />
      </div>
      <div class="view-count radius-shadow">
        {{ detail.viewCount || 1 }}观看
      </div>
    </div>
    <div class="start-time radius-shadow" v-show="!showDetail">
      开始时间：{{ detail.onlineTime || "2021-09-25 20:00" }}
    </div>

    <div class="mask" v-show="showDetail && prefix === '直播预告'">
      <p class="brief">
        {{ detail.synopsis }}
      </p>
      <div @click="showDetail = false">
        收起 <Icon name="arrow-up" style="margin-left: 0.1rem;" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Icon } from "vant";
import { IGetDetail } from "@/api/types";
@Component({
  components: { Icon }
})
export default class LiveHeader extends Vue {
  @Prop({ type: Object, default: () => {} })
  detail!: IGetDetail["data"];
  // 展示直播间详情
  showDetail = false;

  get prefix() {
    const map = {
      0: "直播预告",
      1: "正在直播",
      2: "直播结束"
    };

    return map[this.detail.status || 0];
  }
}
</script>
<style lang="scss" scoped>
.live-header {
  position: absolute;
  top: 0.2rem;
  width: 100vw;
  background: rgba(0, 0, 0, 0);
  padding: 0.2rem;
  z-index: 99999;
  .radius-shadow {
    border-radius: 0.27rem;
    background: rgba(0, 0, 0, 0.3);
    padding: 0 0.2rem;
  }
  .live-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.28rem;
      font-weight: bold;
      color: #ffffff;
      line-height: 0.54rem;
      height: 0.54rem;
      max-width: 5.4rem;
      p {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .view-count {
      font-size: 0.22rem;
      color: #ffffff;
      line-height: 0.54rem;
      height: 0.54rem;
    }
  }
  .start-time {
    font-size: 0.2rem;
    color: #ffffff;
    width: max-content;
    margin-top: 0.18rem;
    line-height: 0.4rem;
    height: 0.4rem;
  }
}

.mask {
  content: "";
  display: block;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999999999;
  color: #ffffff;
  .brief {
    text-indent: 2em;
    color: #ffffff;
    padding: 1.5rem 0.2rem;
    text-align: justify;
  }
  > div {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1rem;
  }
}
</style>
