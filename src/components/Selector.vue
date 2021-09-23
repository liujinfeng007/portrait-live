<template>
  <div class="selector">
    <div class="selector-mask"></div>
    <div class="selector-content">
      <div class="content-diy __flex" @click="itemClick(-1)">自定义</div>
      <div
        class="content-number"
        @click="itemClick(item)"
        v-for="item in list"
        :key="item"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Selector extends Vue {
  list = [100, 50, 10, 5, 1];

  itemClick(num: number) {
    this.$emit("set-num", num);
  }
}
</script>
<style lang="scss" scoped>
.selector {
  width: 1.6rem;
  height: 3.6rem;
  background-color: #ffffff;
  box-shadow: 0rem 0rem 0.13rem 0.02rem rgba(0, 0, 0, 0.26);
  position: absolute;
  bottom: 0.76rem;
  left: -0.4rem;
  border-radius: 0.1rem;
  animation: show 0.2s;
  &::after {
    content: "";
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0;
    border: 0.12rem solid transparent;
    border-top-color: white;
    left: calc(50% - 0.06rem);
    bottom: -0.24rem;
  }
  .selector-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 9;
  }
  .selector-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    position: relative;
    z-index: 10;
    .content-diy {
      width: 1.36rem;
      height: 0.58rem;
      background-color: #f2f2f2;
      border-radius: 0.29rem;
      line-height: 1;
      color: #222222;
      font-size: 0.26rem;
      margin-top: 0.18rem;
    }
    .content-number {
      color: #f57303;
      font-size: 0.26rem;
      line-height: 1;
      font-weight: bold;
      width: 100%;
      height: 0.32rem;
      margin-top: 0.22rem;
      text-align: center;
    }
  }
}
@keyframes show {
  from {
    height: 0;
  }
  to {
    height: 3.6rem;
  }
}
</style>
