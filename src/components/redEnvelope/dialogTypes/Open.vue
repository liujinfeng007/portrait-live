<template>
  <div class="open __flex" @click="close(false)">
    <div class="open__content" @click.stop="close(true)">
      <img src="../../../assets/image/红包弹窗1@2x.png" class="content-bg" />
      <img :src="someValue.img" class="content-avatar" />
      <div class="content-title">
        <span>{{ someValue.name }}</span> 的{{ type }}
      </div>
      <div class="content-text">{{ someValue.text }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { IOpen } from "../type";
@Component
export default class Open extends Vue {
  @Inject()
  someValue!: IOpen;

  get type() {
    return this.someValue.type === 1 ? "现金红包" : "积分红包";
  }

  close(call: boolean) {
    this.$emit("close", call);
  }
}
</script>
<style lang="scss" scoped>
.open {
  width: 100%;
  height: 100%;
  animation: show 0.3s;
  .open__content {
    width: 4.75rem;
    height: 6.13rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .content-bg {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 0;
    }
    .content-avatar {
      width: 0.54rem;
      height: 0.54rem;
      border-radius: 50%;
      margin-top: 3rem;
      z-index: 1;
    }
    .content-title {
      margin-top: 0.1rem;
      color: #ffffff;
      font-size: 0.24rem;
      z-index: 1;
      span {
        font-weight: bold;
      }
    }
    .content-text {
      margin-top: 0.6rem;
      font-weight: bold;
      color: #fdf2d3;
      font-size: 0.36rem;
      z-index: 1;
    }
  }
}
@keyframes show {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
