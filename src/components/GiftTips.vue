<template>
  <div class="gift-tips">
    <div class="tips-item" :class="{ '--out': hide }" v-if="showTipsItem">
      <div class="item-info">
        <div class="item-name">{{ showTipsItem.nickname }}</div>
        <div class="item-gift-name">送出了 {{ showTipsItem.giftName }}</div>
      </div>
      <img :src="showTipsItem.giftImg" class="item-img" />
      <div class="item-sum">×{{ showNum }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { IGiftTipsItem } from "@/api/types";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Tween } from "@tweenjs/tween.js";
@Component
export default class GiftTips extends Vue {
  @Prop()
  giftTips!: IGiftTipsItem[];

  showTipsItem: IGiftTipsItem | null = null;

  showNum = 0;

  numTimer?: number;

  hide = false;

  out = false;

  get list() {
    return this.giftTips.map(item => item);
  }

  showTips: IGiftTipsItem[] = [];

  @Watch("list")
  watchList(nv: IGiftTipsItem[], ov: IGiftTipsItem[]) {
    const diff = nv.slice(ov.length);
    this.showTips = this.showTips.concat(diff);
  }

  mounted() {
    this.getNextItem();
  }

  getNextItem() {
    this.showNum = 0;
    this.showTipsItem = this.showTips[0];
    if (this.showTipsItem) {
      this.hide = false;
      this.numAnimation(this.showTipsItem.sum).then(() => {
        setTimeout(() => {
          this.hide = true;
        }, 1000);
        setTimeout(() => {
          this.showTipsItem = null;
          this.showTips.splice(0, 1);
          this.$emit("removeGiftTips", this.showTips.length);
        }, 1500);
        setTimeout(() => {
          if (!this.out) {
            this.getNextItem();
          }
        }, 2000);
      });
    } else {
      setTimeout(() => {
        if (!this.out) {
          this.getNextItem();
        }
      }, 1000);
    }
  }

  numAnimation(num: number) {
    return new Promise(resolve => {
      const t = new Tween({ number: this.showNum })
        .to({ number: num }, 1000)
        .onUpdate(tween => {
          this.showNum = Number(tween.number.toFixed(0));
        })
        .start();
      const animate = () => {
        if (t.update()) {
          requestAnimationFrame(animate);
        } else {
          resolve(true);
        }
      };
      animate();
    });
  }

  beforeDestroy() {
    this.out = true;
  }
}
</script>
<style lang="scss" scoped>
.gift-tips {
  width: 0;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .tips-item {
    position: absolute;
    animation: 0.5s in;
    left: 0;
    top: 50%;
    z-index: 1;
    width: 4rem;
    height: 0.8rem;
    background-color: rgba($color: #1266ef, $alpha: 0.8);
    border-radius: 0rem 0.4rem 0.4rem 0rem;
    &.--out {
      animation: 0.5s out;
      opacity: 0;
    }
    .item-info {
      height: 100%;
      margin-left: 0.48rem;
      line-height: 1;
      color: #ffffff;
      .item-name {
        font-size: 0.28rem;
        font-weight: bold;
        margin-top: 0.08rem;
      }
      .item-gift-name {
        font-size: 0.24rem;
        margin-top: 0.1rem;
      }
    }
    .item-img {
      width: 0.9rem;
      height: 0.9rem;
      position: absolute;
      right: 0.24rem;
      bottom: 0.03rem;
    }
    .item-sum {
      position: absolute;
      font-family: PingFang-SC-Bold;
      width: 3.4rem;
      right: -3.5rem;
      top: 25%;
      font-size: 0.4rem;
      line-height: 1;
      font-style: italic;
      color: #ffd050;
      text-shadow: #652800 0.02rem 0 0, #652800 0 0.02rem 0,
        #652800 -0.02rem 0 0, #652800 0 -0.02rem 0;
    }
  }
  @keyframes in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
}
</style>
