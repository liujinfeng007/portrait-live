<template>
  <div v-if="isShow && shareInfo && shareInfo.shareBg" class="header">
    <img :src="shareInfo.shareBg" class="bg" />
    <img :src="shareInfo.shareLogo" class="logo" />
    <div class="content">通过“{{ shareInfo.appName }}”客户端</div>
    <div class="button" @click="openApp">打开APP</div>
    <img class="close" :src="shareInfo.shareClose" @click="close" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import req from "@/api";
import { IShareInfo } from "@/api/types";

@Component
export default class Header extends Vue {
  @Prop()
  private newsId!: string;

  @Prop()
  private appId!: string;

  private shareInfo: IShareInfo | {} = {};

  private isShow = true;

  mounted() {
    if (window && window.ZWY_CLOUD && window.ZWY_CLOUD.isOpenInApp()) {
      this.isShow = false;
    } else {
      this.isShow = true;
      const app = document.getElementById("app") as HTMLDivElement;
      app.style.height = "calc(100vh - (100vw * 0.16))";
      app.style.width = "100%";
      app.style.position = "absolute";
      app.style.top = "16vw";
    }
    req.getShareInfo().then(res => {
      this.shareInfo = res.data;
    });
  }

  beforeDestroy() {
    this.close();
  }

  close() {
    const app = document.getElementById("app") as HTMLDivElement;
    app.style.height = "100%";
    app.style.top = "";
    this.isShow = false;
  }

  openApp() {
    const shareInfo = this.shareInfo as IShareInfo;
    if (!shareInfo.schemeUrl) {
      return (location.href = shareInfo.downloadUrl);
    }
    const Params = {
      id: this.newsId || "",
      sourceId: this.newsId || "",
      sourceType: "1",
      url: location.href,
      shareUrl: location.href
    };
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      location.href = `${shareInfo.schemeUrl}/info/install/${this.appId}.html?id=${Params.id}&&&sourceId=${Params.id}&&&sourceType=1&&&url=${Params.url}&&&shareUrl=${Params.shareUrl}`;
    } else if (/(Android)/i.test(navigator.userAgent)) {
      location.href =
        shareInfo.schemeUrl.replace("http://", "").replace("com/", "com") +
        "://" +
        `?params=${JSON.stringify(Params)}`;
      setTimeout(() => {
        location.href = shareInfo.downloadUrl;
      }, 3000);
    } else {
      location.href = shareInfo.downloadUrl;
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  line-height: 1;
  z-index: 9999999;
  height: 16vw;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: "微软雅黑", Helvetica, Arial, sans-serif;
  .bg {
    position: absolute;
    width: 100%;
  }
  .logo {
    height: 50%;
    z-index: 999;
    margin-left: 0.69rem;
  }
  .close {
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
    z-index: 999;
  }
  .content {
    color: white;
    font-size: 0.26rem;
    z-index: 999;
    margin-left: 0.79rem;
  }
  .button {
    font-size: 0.24rem;
    color: white;
    margin-left: 1.02rem;
    z-index: 999;
    padding: 0.08rem 0.1rem;
    border: 1px solid white;
    border-radius: 0.08rem;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
</style>
