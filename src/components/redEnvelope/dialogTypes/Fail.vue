<template>
  <div class="fail __flex" @click="close(false)">
    <div class="fail__content" @click.stop="close(true)">
      <img src="../../../assets/image/红包弹窗2@2x.png" class="content-bg" />
      <img src="../../../assets/image/哭脸@2x.png" class="content-avatar" />
      <div class="content-text" v-html="someValue.text"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
@Component
export default class Fail extends Vue {
  @Inject()
  someValue!: { text: string };

  close(call: boolean) {
    this.$emit("close", call);
  }
}
</script>
<style lang="scss" scoped>
.fail {
  width: 100%;
  height: 100%;
  animation: show 0.3s;
  .fail__content {
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
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      margin-top: 0.6rem;
      z-index: 1;
    }
    .content-text {
      width: 2.1rem;
      margin-top: 0.17rem;
      font-weight: bold;
      color: #d19135;
      font-size: 0.3rem;
      z-index: 1;
      white-space: pre;
      text-align: center;
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
