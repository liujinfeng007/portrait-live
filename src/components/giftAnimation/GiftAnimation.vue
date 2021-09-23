<template>
  <div class="gift-animation" :class="{ '--out': isOut }">
    <img :src="showUrl" class="animation-content" ref="img" />
    <div class="animation-num">×{{ showNumCount }}</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { setNotice } from "./utils";
import { closeAnimation } from "./index";
import { Tween } from "@tweenjs/tween.js";
@Component
export default class GiftAnimation extends Vue {
  @Prop()
  url!: string;

  @Prop()
  num!: number;

  @Prop({ default: 3000 })
  time!: number;

  showUrl = this.url;
  showNum = this.num;
  showTime = this.time;
  isOut = false;

  numTimer?: number;
  closeTimer?: number;
  hideTime?: number;

  showNumCount = 0;

  get type() {
    if (this.showUrl.includes(".gif")) {
      return 1;
    } else {
      return 2;
    }
  }

  mounted() {
    this.init();
  }

  init() {
    setNotice(this.reSet);
    this.numAnimation();
  }

  reSet(url: string, num: number, time?: number) {
    const img = this.$refs.img as HTMLImageElement;
    img.src = "";
    if (url === this.showUrl) {
      this.showNum += num;
    } else {
      this.showNumCount = 0;
      this.showNum = num;
    }
    img.src = url;
    this.showUrl = url;
    this.showTime = time || this.time;
    clearTimeout(this.closeTimer);
    clearInterval(this.numTimer);
    clearTimeout(this.hideTime);
    this.numAnimation();
  }

  numAnimation() {
    this.isOut = false;
    if (this.type === 2) {
      this.showTime += 500;
      this.hideTime = setTimeout(() => {
        this.isOut = true;
      }, this.showTime - 500);
    }
    let time = this.showTime;
    if (this.showTime > 1000) {
      time = this.showTime - 1000;
    }
    this.closeTimer = setTimeout(() => {
      closeAnimation();
    }, this.showTime);
    const t = new Tween({ number: this.showNumCount })
      .to({ number: this.showNum }, time)
      .onUpdate(tween => {
        this.showNumCount = Number(tween.number.toFixed(0));
      })
      .start();
    const animate = () => {
      if (t.update()) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  beforeDestroy() {
    clearTimeout(this.closeTimer);
    clearInterval(this.numTimer);
    clearTimeout(this.hideTime);
  }
}
</script>
<style lang="scss" scoped>
.gift-animation {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 3000;
  top: 0;
  right: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.--out {
    animation: 0.5s out;
    opacity: 0;
  }
  .animation-content {
    max-width: 80%;
    animation: 0.5s in;
  }
  .animation-num {
    font-size: 0.72rem;
    line-height: 1;
    font-style: italic;
    font-family: PingFang-SC-Bold;
    color: #ffd050;
    text-shadow: #652800 0.03rem 0 0, #652800 0 0.03rem 0, #652800 -0.03rem 0 0,
      #652800 0 -0.03rem 0;
    margin-top: 0.3rem;
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
