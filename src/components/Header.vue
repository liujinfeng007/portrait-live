<template>
  <div class="header">
    <div class="header__left" @click="back">
      <img src="../assets/image/返回@2x.png" />
    </div>
    <div class="header__right" @click="share">
      <img src="../assets/image/more@2x.png" />
    </div>
  </div>
</template>
<script lang="ts">
import { antiShake } from "@/common/decorator";
import Native from "@/common/Native";
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Header extends Vue {
  back() {
    if (Native.isOpenInApp()) {
      Native.close();
    } else {
      this.$router.back();
    }
  }

  @antiShake(1000)
  share() {
    Native.shareApp();
  }
}
</script>
<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3000;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .header__left {
    padding-top: 0.19rem;
    padding-left: 0.28rem;
    img {
      width: 0.2rem;
      height: 0.34rem;
      display: block;
    }
  }
  .header__right {
    padding-top: 0.31rem;
    padding-right: 0.28rem;
    img {
      display: block;
      width: 0.45rem;
      height: 0.11rem;
    }
  }
}
</style>
