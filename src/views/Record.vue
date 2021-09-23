<template>
  <div class="record">
    <div class="record__header" v-if="false && isShowHeader">
      <img
        src="../assets/image/返回.png"
        @click="$router.back()"
        class="header__left"
      />
      <span>兑换记录</span>
      <div></div>
      <!-- <img
        @click="share"
        src="../assets/image/椭圆 1 拷贝 2.png"
        class="header__right"
      /> -->
    </div>
    <div class="record__content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="onLoad">
          <div
            class="content__item"
            v-for="(item, index) in recordList"
            :key="index"
          >
            <img src="../assets/image/兑换@2x.png" class="item-img" />
            <div class="item-right">
              <div class="item-time">{{ item.createTime }}</div>
              <div class="item-text">
                观看直播 <span>{{ item.title }}</span> 时，消耗
                <span>{{ item.point }}</span>
                积分，兑换了积分礼物 <span>{{ item.description }}</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import request from "@/api/index";
import { List, PullRefresh } from "vant";
import { IGiftRecord } from "@/api/types";
import { needToken } from "@/common/decorator";
import Native from "@/common/Native";
@Component({
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh
  }
})
export default class Record extends Vue {
  lastId = "";
  loading = false;
  finished = false;
  isLoading = false;
  recordList: IGiftRecord[] = [];

  get isShowHeader() {
    if (!Native.isOpenInApp() || Native.getOS() === "iOS") {
      return false;
    }
    return true;
  }

  mounted() {
    this.init();
  }

  init() {
    document.title = "兑换记录";
  }

  onLoad() {
    this.getRecord();
  }
  onRefresh() {
    this.lastId = "";
    this.getRecord(true);
  }

  share() {
    Native.shareApp();
  }

  @needToken(true)
  async getRecord(isClear = false) {
    const result = await request.getGiftRecord(this.lastId);
    if (isClear) {
      this.finished = false;
      this.recordList = [];
    }
    if (!result.data.pageResults || result.data.pageResults.length === 0) {
      this.finished = true;
    } else {
      this.isLoading = false;
      this.loading = false;
      this.recordList = this.recordList.concat(result.data.pageResults);
      this.lastId = result.data.pageResults.lastChild.id + "";
    }
  }
}
</script>
<style lang="scss" scoped>
.record {
  .record__header {
    width: 100%;
    height: 0.96rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px #d1d1d1;
    color: #222222;
    font-size: 0.36rem;
    padding: 0 0.28rem;
    .header__left {
      width: 0.19rem;
      height: 0.32rem;
    }
    .header__right {
      width: 0.45rem;
      height: 0.11rem;
    }
  }
  .record__content {
    padding: 0 0.28rem;
    height: calc(100% - 0.96rem);
    overflow: auto;
    .content__item {
      width: 100%;
      border-bottom: solid 1px #e7e7e7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0;
      .item-img {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
      }
      .item-right {
        width: calc(100% - 1.3rem);
        height: 100%;
        .item-time {
          color: #999999;
          font-size: 0.24rem;
          margin-bottom: 0.04rem;
        }
        .item-text {
          color: #333333;
          font-size: 0.28rem;
          line-height: 0.36rem;
          span {
            color: #1266ef;
          }
        }
      }
    }
  }
}
</style>
