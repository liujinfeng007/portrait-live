<template>
  <div v-if="isShowAppPromt && shareInfo">
    <div class="share_back hidden">
      <!-- /* 利用图片去撑开这段高度 */ -->
      <img
        :src="shareInfo.shareBg"
        style="width: 100%; display: block;"
        alt=""
      />
    </div>
    <div class="general_share">
      <img :src="shareInfo.shareBg" />
      <div class="general_share_content">
        <img class="general_district" :src="shareInfo.shareLogo" />
        <p>通过“{{ shareInfo.appName }}”客户端</p>
        <a class="general_botton" @click.stop="openApp">打开APP</a>
      </div>
      <img
        class="general_close share_close"
        @click.stop="closeAppPrompt"
        :src="shareInfo.shareClose"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IShareInfo } from "../api/types";
@Component({})
export default class AppPrompt extends Vue {
  @Prop()
  shareInfo!: IShareInfo;
  @Prop()
  informationId!: string;
  @Prop()
  infoClassifyid!: string;
  @Prop()
  appId!: string | number;

  isShowAppPromt = true;

  closeAppPrompt() {
    this.isShowAppPromt = false;
  }

  openApp() {
    const newsId = this.infoClassifyid;
    const shareInfo = this.shareInfo;
    if (!shareInfo.schemeUrl) {
      return (location.href = shareInfo.downloadUrl);
    }
    const schemeUrl = shareInfo.schemeUrl.split("/");
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      location.href = `${shareInfo.schemeUrl}/info/install/${this.appId}.html?id=${newsId}&&&sourceId=${this.informationId}&&&sourceType=1&&&url=${location.href}&&&shareUrl=`;
    } else if (/(Android)/i.test(navigator.userAgent)) {
      const Params = {
        id: newsId,
        sourceId: this.informationId,
        sourceType: "1",
        url: location.href,
        shareUrl: location.href
      };
      location.href = schemeUrl[2] + `://?params=${JSON.stringify(Params)}`;
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
.share_back {
  width: 100%;
  opacity: 0;
}
.general_share {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  img {
    width: 100%;
    border: none;
  }
  .general_share_content {
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-around;
    padding: 0 24px 0 16px;

    .general_district {
      height: 50%;
      width: auto;
    }
    p {
      color: #fff;
      font-size: 13px;
    }
    .general_botton {
      font-size: 0.8em;
      padding: 2px 5px;
      margin-left: 12px;
      border: 1px solid #ffffff;
      border-radius: 5px;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  .general_close {
    position: absolute;
    right: 4px;
    top: 4px;
    width: 21px;
  }
}
</style>
