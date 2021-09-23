<template>
  <div class="footer">
    <div class="footer__left" :class="{ '--no-barrage': showBarrageButton }">
      <img
        v-if="showBarrageButton"
        :src="barrageButtonImg"
        class="left-barrage"
        @click="setBarrage"
      />

      <div class="left-input" :style="`width:${width}rem`" @click="inputClick">
        说点什么...
      </div>
    </div>
    <div class="footer__right">
      <van-icon
        v-if="detail.isGift === 1 && detail.status !== 0"
        :name="require('../assets/image/礼物@2x.png')"
        class="right-item right-gift"
        @click="emit('gift')"
      />
      <van-icon
        :name="zanIcon"
        class="right-item right-zan"
        @click="zan"
        :badge="detail.praiseCount | showPraiseCount"
      />
      <van-icon
        :name="require('../assets/image/分享@2x.png')"
        class="right-item right-share"
        @click="emit('share')"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IDetail } from "@/api/types";
import { Icon, Toast } from "vant";
import Native from "@/common/Native";
import { needToken } from "@/common/decorator";
@Component({
  components: {
    [Icon.name]: Icon
  },
  filters: {
    showPraiseCount(praiseCount: number) {
      if (praiseCount > 99) {
        return "99+";
      } else {
        return praiseCount;
      }
    }
  }
})
export default class Footer extends Vue {
  @Prop()
  detail!: IDetail;
  showBarrage = true;
  showBarrageButton = true;

  get width() {
    let normal = 0;
    if (this.showBarrageButton && this.detail.isGift === 1) {
      normal = 3.7;
    } else if (!this.showBarrageButton && this.detail.isGift === 1) {
      normal = 4.2;
    } else if (this.showBarrageButton && !(this.detail.isGift === 1)) {
      normal = 4.68;
    } else if (!this.showBarrageButton && !(this.detail.isGift === 1)) {
      normal = 5.18;
    }
    return normal;
  }

  get barrageButtonImg() {
    return this.showBarrage
      ? require("../assets/image/弹幕开启@2x.png")
      : require("../assets/image/弹幕关闭@2x.png");
  }

  get zanIcon() {
    if (this.detail.isPraise) {
      return require("../assets/image/已点赞@2x.png");
    } else {
      return require("../assets/image/点赞@2x.png");
    }
  }

  mounted() {
    if (localStorage.getItem("barrageStatus") === "false") {
      this.showBarrage = false;
    }
    this.showBarrageButton = this.detail!.isShowBulletScreen === 1;
  }

  emit(text: string) {
    this.$emit("item-click", text);
  }
  /** 点赞 */
  @needToken(true)
  zan() {
    if (this.detail.isPraise) return;
    this.$emit("item-click", "zan");
  }

  /** 设置弹幕 */
  setBarrage() {
    this.showBarrage = !this.showBarrage;
    this.$emit("item-click", "barrage", this.showBarrage);
    localStorage.setItem("barrageStatus", this.showBarrage + "");
  }

  /** 唤醒评论输入 */
  @needToken(true)
  inputClick() {
    if (this.detail.commentType === 0) {
      Native.openComment({
        sourceType: this.detail.sourceType,
        id: this.$store.state.infoClassifyId,
        replyId: "",
        passiveReplyName: "",
        passiveReplyId: "",
        myissue: "1"
      });
    } else {
      Toast("该新闻暂不允许评论");
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.99rem;
  background-color: #ffffff;
  border-top: solid 1px #e1e1e1;

  padding: 0.14rem 0;
  display: flex;
  .footer__left {
    display: flex;
    align-items: center;
    .left-barrage {
      width: 0.36rem;
      height: 0.36rem;
      margin-left: 0.28rem;
    }
    .left-input {
      width: 4.1rem;
      height: 0.7rem;
      border-radius: 0.06rem;
      background: rgb(240, 240, 240);
      margin-left: 0.3rem;
      font-size: 0.26rem;
      text-indent: 0.22rem;
      color: #666666;
      line-height: 0.7rem;
    }
    & {
      .left-input {
        width: 3.7rem;
        margin-left: 0.16rem;
      }
    }
  }
  .footer__right {
    width: calc(100% - 4.4rem);
    display: flex;
    justify-content: space-around;
    align-items: center;
    .right-item {
      height: 0.4rem;
      font-size: 0.4rem;
      width: auto;
    }
    ::v-deep {
      .van-info {
        background-color: #c32825;
        font-size: 0.18rem;
      }
    }
  }
}
</style>
