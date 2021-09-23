<template>
  <div id="app">
    <transition name="fade">
      <keep-alive>
        <router-view
          class="linkView"
          id="linkView"
          v-if="keepAlive"
        ></router-view>
      </keep-alive>
    </transition>
    <transition name="fade">
      <router-view
        class="linkView"
        id="linkView"
        v-if="!keepAlive"
      ></router-view>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class App extends Vue {
  get keepAlive() {
    return this.$route.meta.keepAlive;
  }
}
</script>
<style lang="scss">
#app {
  font-family: 微软雅黑, PingFang-SC-Medium, Avenir, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: auto;
  font-size: 16px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  width: 100%;
  height: 100%;
  .linkView {
    width: 100%;
    height: 100%;
  }
}
html,
body {
  //选择vm|vh中较小的那个,实现自适应
  font-size: 13.33333333333333vmin;
  width: 100%;
  height: 100%;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-leave-active {
  opacity: 0;
}
.fade-enter {
  opacity: 0;
}
</style>
