<template>
  <div class="barrage">
    <div
      class="barrage__trajectory"
      ref="trajectory"
      :style="{
        height: proportion + '%',
        opacity: opacity / 100
      }"
    ></div>
    <div class="barrage__top-or-bottom" ref="topOrBottom"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IBarrageItem } from "./type";
import barrage from "./Barrage";

@Component
export default class BarrageIndex extends Vue {
  @Prop()
  list!: IBarrageItem[];

  @Prop({ default: 25 })
  /**
   * 弹幕比例 0 - 100 即 0% - 100%
   */
  proportion!: number;

  @Prop({ default: 100 })
  /**
   * 弹幕透明度 0 - 100 即 0% - 100%
   */
  opacity!: number;

  @Prop({ default: true })
  /**
   * 弹幕是否播放
   */
  isPause!: boolean;

  barrageList: IBarrageItem[] = [];

  @Watch("list", { deep: true })
  watchList(nv: IBarrageItem[], ov: IBarrageItem[]) {
    const diff = nv.slice(ov.length);
    barrage.addList(diff);
  }

  @Watch("barrageList", { deep: true })
  watchBarrageList(nv: IBarrageItem[]) {
    this.$emit("removeList", nv.length);
  }

  mounted() {
    barrage.init(
      this.barrageList,
      this.$refs.trajectory as HTMLElement,
      this.$refs.topOrBottom as HTMLElement
    );
  }

  beforeDestroy() {
    barrage.destroy();
  }
}
</script>
<style lang="scss" scoped>
.barrage {
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  overflow: hidden;
  .barrage__trajectory {
    width: 100%;
    position: absolute;
  }
  .barrage__top-or-bottom {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>
