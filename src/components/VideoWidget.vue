<template>
  <div class="video-widget">
    <video
      id="video"
      ref="video"
      class="video-js vjs-default-skin box"
      controls
      muted
      preload="auto"
      :playsinline="true"
      :webkitPlaysinline="true"
      v-bind="$attrs"
    >
      <source :src="videoSrc" type="application/x-mpegURL" />
      <source
        :src="videoSrc"
        type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
      />
      <source :src="videoSrc" type='video/webm; codecs="vp8, vorbis"' />
      <source :src="videoSrc" type='video/ogg; codecs="theora, vorbis"' />
    </video>

    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VideoWidget extends Vue {
  // videojs实例化回调
  @Prop({ type: Function, default: () => {} })
  callback!: (player: videojs.VideoJsPlayer) => unknown;
  // videojs配置项
  @Prop({ type: Object, default: {} })
  videoOptions!: videojs.VideoJsPlayerOptions;
  // 播放地址
  @Prop({ type: String, required: true })
  videoSrc!: string;
  // videojs实例
  vPlayer: videojs.VideoJsPlayer | null = null;

  mounted() {
    this.initVideo();
  }

  initVideo() {
    this.vPlayer = this.$video("video", this.videoOptions, () => {
      this.vPlayer && this.callback(this.vPlayer);
    });
  }
}
</script>
<style lang="scss" scoped>
.video-widget {
  position: relative;
}
</style>
