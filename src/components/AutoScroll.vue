<template>
  <div
    class="auto-scroll"
    ref="auto-scroll"
    :style="{ height }"
    @touchstart="onTouchStart"
    @touchend="isTouchEnd = true"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, ModelSync } from "vue-property-decorator";
import { throttle } from "@/common/utils";

@Component
export default class AutoScroll extends Vue {
  // 列表渲染元数据
  @ModelSync("_list", "change", { type: Array, default: [] })
  private list!: { [x: string]: unknown }[];
  // 列表高度
  @Prop({ type: String, required: true })
  height!: string;
  // 列表根元素
  rootEl: HTMLElement | null = null;
  // 同时只能允许一个执行动画
  aniExcuting = false;
  // 视窗监听实例
  io: IntersectionObserver | null = null;
  // 长列表分割阈值
  splitThreshold = 50;
  // 长列表的缓冲长度
  bufferLenth = 10;
  // 暂停滚动 在滚动动画执行时，用户滑动会出现列表抖动
  pauseScroll = false;
  // 触摸是否结束
  isTouchEnd = false;

  mounted() {
    this.rootEl = this.$refs["auto-scroll"] as HTMLElement;
    this.onIntersectionObserver();
    this.doUserAnimate();
  }

  // 有新评论继续动画
  @Watch("list")
  async onUserCommentChange() {
    const withThrottle = throttle(this.doUserAnimate.bind(this), 1000);
    this.$nextTick(() => {
      this.calculateNotInView();
      withThrottle();
    });
  }

  // 用户评论滚动
  doUserAnimate(id?: number) {
    if (this.aniExcuting || !this.rootEl || this.pauseScroll) return;
    this.aniExcuting = true;
    const requstAnimationId: number = requestAnimationFrame(() => {
      const reachBottom = this.isReachBottom(
        this.rootEl!,
        this.rootEl!.clientHeight
      );
      if (!reachBottom) {
        setTimeout(() => {
          this.aniExcuting = false;
          this.rootEl!.scrollTop += 1;
          this.doUserAnimate(requstAnimationId);
        });
      } else {
        this.aniExcuting = false;
        id && cancelAnimationFrame(id);
      }
    });
  }

  onTouchStart() {
    // 暂停自动滚动
    this.pauseScroll = true;
    let lastTimeScrollTop = 0;
    // 定义一个interval定时器用来判断用户手动滑动是否已经结束
    const intervalId = setInterval(() => {
      if (lastTimeScrollTop !== this.rootEl?.scrollTop) {
        lastTimeScrollTop = this.rootEl?.scrollTop as number;
      } else {
        clearInterval(intervalId);
        this.pauseScroll = false;
        setTimeout(() => {
          if (!this.aniExcuting && this.isTouchEnd) {
            this.doUserAnimate();
          }
        });
      }
    }, 150);
  }

  // 实例化视窗监听
  onIntersectionObserver() {
    if (this.io || !this.rootEl) return;
    this.io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // 在父元素的视窗中已不可见
          if (
            !entry.isIntersecting &&
            entry.boundingClientRect.bottom < 600 &&
            this.list.length > 100
          ) {
            // 注销监听
            this.io!.unobserve(entry.target);
            console.log(
              "<-----------清理元素",
              entry.target,
              "之前的---------->"
            );
            // 暂定50为阈值来清理队列
            this.$nextTick(() => {
              this.delComment(this.splitThreshold - this.bufferLenth);
            });
          }
        });
      },
      { root: this.rootEl }
    );
  }

  // 计算已经不在可是范围的评论
  calculateNotInView() {
    if (!this.rootEl || !this.io) return;
    const childEl = this.rootEl.children;
    [...childEl].forEach((item, index) => {
      if (index !== 0 && index % this.splitThreshold === 0)
        this.io!.observe(item);
    });
  }

  // 过长删除队列
  delComment(end = 0) {
    if (end > 0) {
      this.list.splice(0, end);
      return;
    }
    const { length } = this.list;
    if (length > 100) {
      this.list.splice(0, 50);
    }
  }

  // 是否滚动到底部
  isReachBottom(el: HTMLElement, wrapHeight: number, threshold = 0) {
    const h1 = el.scrollHeight - el.scrollTop,
      h2 = wrapHeight + threshold;
    return h1 <= h2;
  }
}
</script>
<style lang="scss" scoped>
.auto-scroll {
  overflow-y: scroll;
  transition: 1s ease;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
