<template>
  <div class="suspension" v-if="floating">
    <div class="suspension-channel">
      <div
        class="suspension-item"
        @click="floatingClick"
        :class="{ '--hide': isHide }"
      >
        <img :src="floating.groupIcon" class="item-bg" />
        <img
          src="../assets/image/关闭@2x.png"
          @click.stop="hide"
          class="item-close"
        />
      </div>
    </div>
    <van-action-sheet v-model="show" :closeable="false">
      <div class="content">
        <div
          v-for="(item, index) in floating.adverInfoList"
          :key="index"
          class="content__item __flex"
          @click="itemClick(item)"
        >
          <img :src="item.linkIcon" class="item-icon" />
          {{ item.linkContent }}
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ActionSheet, Toast } from "vant";
import request from "@/api/index";
import { IFloating, IAdverInfoListItem } from "@/api/types";
import { openUrl } from "@/common/utils";
import { needToken } from "@/common/decorator";
@Component({
  components: { [ActionSheet.name]: ActionSheet }
})
export default class Suspension extends Vue {
  floating: IFloating | null = null;
  isHide = false;
  show = false;
  mounted() {
    this.getFloating();
  }

  async getFloating() {
    const result = await request.floating(this.$store.state.infoClassifyId);
    if (result.code === 0) {
      this.floating = result.data;
    }
  }

  floatingClick() {
    /** 当只有一个跳转链接时 */
    if (this.floating!.adverInfoList.length === 1) {
      if (this.floating!.isJump === 0) {
        openUrl(this.floating!.adverInfoList[0].linkUrl);
      } else {
        this.replyUserStatus(this.floating!.adverInfoList[0].linkUrl);
      }
    } else {
      this.show = true;
    }
  }

  itemClick(item: IAdverInfoListItem) {
    this.show = false;
    if (this.floating!.isJump === 0) {
      openUrl(item.linkUrl);
    } else {
      this.replyUserStatus(item.linkUrl);
    }
  }

  @needToken(true)
  async replyUserStatus(url: string) {
    console.log(this.$store.state);
    const result = await request.replyUserStatus(
      this.$store.state.infoClassifyId,
      this.$store.state.detail.sourceType
    );
    // 0:未评论,1:已评论（审核通过）
    console.log(result);
    if (result.code === 0) {
      if (result.data === 1) {
        openUrl(url);
      } else {
        Toast({
          message:
            "参与评论即可参加抽奖哦，请先评论吧。点击页面下方输入框，输入内容后即可发布评论。",
          duration: 2000
        });
      }
    } else {
      Toast.fail({
        message: result.message
      });
    }
  }

  hide() {
    this.isHide = true;
  }
}
</script>
<style lang="scss" scoped>
.suspension {
  width: 1px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1000;
  .suspension-channel {
    position: absolute;
    overflow: hidden;
    top: 0;
    right: 0;
    pointer-events: none;
    width: 1.6rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 2.72rem;
    padding-right: 0.28rem;
  }
  .suspension-item {
    position: relative;
    width: 1.3rem;
    height: 1.3rem;
    margin-bottom: 0.5rem;
    pointer-events: auto;
    &.--hide {
      transition: all 0.2s;
      margin-left: calc(50% + 0.28rem);
    }
    .item-bg {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .item-close {
      position: absolute;
      top: -0.13rem;
      right: 0;
      width: 0.26rem;
      height: 0.26rem;
    }
  }
  .content {
    width: 100%;
    max-height: 4.4rem;
    color: #333333;
    font-size: 0.3rem;
    .content__item {
      width: 100%;
      height: 1.1rem;
      border-bottom: 1px solid #dadada;
      line-height: 1;
      .item-icon {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 0.3rem;
        border-radius: 0.04rem;
      }
      &:last-child {
        border: none;
      }
    }
  }
}
</style>
