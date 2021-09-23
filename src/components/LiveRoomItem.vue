<template>
  <div class="live-room-item">
    <div class="item__head">
      <div class="head-avatar">
        <img :src="item.avatar" />
      </div>
      <div class="head-text">主持人</div>
    </div>
    <div class="item__top">
      <div class="top-name">{{ item.compereName }}</div>
      <div class="top-time">{{ item.createTime }}</div>
    </div>
    <div class="item__content">
      <div ref="content_text" class="content-text" v-html="item.content"></div>
      <template v-if="imgList.length > 0">
        <div
          v-if="!item.video"
          class="content-img"
          :class="{ '--big-img': imgList.length === 1 }"
        >
          <img
            :src="img.image"
            @click="imgClick(img)"
            v-for="(img, index) in imgList"
            :key="index"
          />
        </div>
        <img
          v-else
          src="../assets/image/矩形 27.png"
          @click="preImages()"
          class="content-img-button"
        />
      </template>
      <video
        v-if="item.video"
        :src="item.video"
        :poster="item.videoImg"
        x5-video-player-type="h5"
        playsinline="true"
        webkit-playsinline="true"
        controls
        preload="metadata"
        class="content-video"
      ></video>
      <div class="content__links" v-if="item.newsUrls">
        <div
          class="links__item __flex"
          @click="linkClick(link.url)"
          v-for="(link, index) in item.newsUrls"
          :key="index"
        >
          <img src="../assets/image/链接@2x.png" class="item-icon" />
          <div class="item-text van-ellipsis">{{ link.title }}</div>
        </div>
      </div>
      <div
        class="content__red-envelope"
        v-if="item.liveRedpacketDto"
        @click="openRedEnvelope"
      >
        <img src="../assets/image/积分红包@2x.png" class="red-envelope-bg" />
        <div class="red-envelope-title">{{ redEnvelopeName }}</div>
        <div class="red-envelope-text">{{ item.liveRedpacketDto.message }}</div>
      </div>
    </div>
    <div class="item__zan-comment" v-if="item.isCommentPraise">
      <div class="zan">
        <img @click="doPraise" :src="zanIcon" class="zan-icon" />
        <div class="zan-text">{{ item.praiseCount || 0 }}</div>
      </div>
      <img @click="comment" src="../assets/image/评论@2x.png" class="comment" />
    </div>
    <div class="item__comments" v-if="item.commentDtoList.length > 0">
      <div
        class="comment-item"
        v-for="(item, index) in showCommentList"
        :key="'comment-' + index"
      >
        <img :src="item.replyUserUrl" class="item-icon" />
        <div class="item-right">
          <span class="item-name">{{ item.nickname }}：</span>
          <span class="item-content">{{ item.content }}</span>
        </div>
      </div>
      <div
        class="comment-more __flex"
        @click="showMoreComment"
        v-if="item.commentDtoList.length > 5"
      >
        {{ moreButtonText }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ILiveRedpacket, ILiveRoomItem } from "@/api/types";
import { Dialog, ImagePreview, Toast } from "vant";
import { showDialog } from "@/components/redEnvelope/index";
import request from "@/api/index";
import { needToken } from "@/common/decorator";
import Native from "@/common/Native";
import { openUrl, zoomDom } from "@/common/utils";
@Component
export default class LiveRoomItem extends Vue {
  @Prop()
  item!: ILiveRoomItem;
  isPraise = false;
  isShowMore = false;

  get showCommentList() {
    if (this.isShowMore) {
      return this.item.commentDtoList;
    } else {
      return this.item.commentDtoList.slice(0, 5);
    }
  }

  get imgList() {
    return this.item.imageHyperLink || [];
  }

  get zanIcon() {
    if (this.item.isPraise) {
      return require("../assets/image/聊天点赞（已点赞）@2x.png");
    } else {
      return require("../assets/image/聊天点赞@2x.png");
    }
  }

  get moreButtonText() {
    return this.isShowMore ? "收起更多评论" : "展开更多评论";
  }

  get redEnvelopeName() {
    if (this.item.liveRedpacketDto) {
      return this.item.liveRedpacketDto.type === 1 ? "现金红包" : "积分红包";
    }
    return "";
  }

  mounted() {
    this.$nextTick(() => {
      zoomDom(0.9097, this.$refs.content_text as HTMLElement);
    });
  }

  showMoreComment() {
    this.isShowMore = !this.isShowMore;
  }

  preImages(url = "", isLink = true) {
    let images: string[] = [];
    if (isLink) {
      images = this.imgList
        .filter(item => !item.hyperLink)
        .map(item => item.image);
    } else {
      images = this.imgList.map(item => item.image);
    }
    let index = 0;
    if (url) {
      index = images.findIndex(item => item === url);
    }
    ImagePreview({
      images,
      startPosition: index
    });
  }

  linkClick(url: string) {
    openUrl(url);
  }

  imgClick(item: { image: string; hyperLink: string }) {
    if (item.hyperLink) {
      openUrl(item.hyperLink);
    } else {
      this.preImages(item.image);
    }
  }

  @needToken(true, true)
  async openRedEnvelope() {
    const result = await request.liveRedpacket(
      this.item.id + "",
      this.item.compereName,
      this.item.avatar
    );
    if (result.code === 0 && result.data) {
      if (result.data.redpacketStatus === 2) {
        showDialog
          .open({
            name: this.item.compereName,
            img: this.item.avatar,
            text: this.item.liveRedpacketDto.message,
            type: this.item.liveRedpacketDto.type
          })
          .then(async () => {
            const openResult = await request.openRedpacket(this.item.id + "");
            if (openResult.code === 0 && openResult.data) {
              this.redEnvelopeResult(openResult.data);
            } else if (openResult.code === -101000135) {
              Dialog.confirm({
                message: openResult.message,
                confirmButtonColor: "#49a8ef",
                confirmButtonText: "前往登录"
              })
                .then(() => {
                  Native.goToken(2).then(() => {
                    location.reload();
                  });
                })
                .catch(() => {});
            } else {
              Toast(openResult.message);
            }
          });
      } else {
        this.redEnvelopeResult(result.data);
      }
    } else {
      Toast(result.message);
    }
  }

  redEnvelopeResult(item: ILiveRedpacket) {
    switch (item.redpacketStatus) {
      case 1:
        showDialog.success({
          code: item.code,
          codeStatus: item.awardStatus,
          sum: item.quota,
          type: item.type,
          wechatName: item.accName
        });
        break;
      case 3:
        showDialog.fail({ text: "晚来一步<br/>红包已经发完了" });
        break;
      case 4:
        showDialog.fail({ text: "晚来一步<br/>红包已经过期了" });
        break;
    }
  }

  @needToken(false)
  async doPraise() {
    // 是否登录
    if (this.$store.state.token) {
      if (this.item.isPraise) return;
      const result = await request.doPraise(
        "",
        this.$store.state.detail!.title,
        this.item.id + "",
        0,
        80
      );
      if (result.data) {
        this.$emit("do-praise", this.item.id, 1);
      } else {
        Toast(result.message);
      }
    } else {
      const result = await request.doPraiseShare(
        this.item.id + "",
        this.$store.state.detail!.title,
        80
      );
      if (result.code === 0) {
        this.$emit("do-praise", this.item.id, 1);
      } else {
        Toast(result.message);
      }
    }
  }

  /** 评论 */
  @needToken(true)
  comment() {
    Native.openComment({
      sourceType: this.item.sourceType,
      id: this.item.id + "",
      replyId: "",
      passiveReplyName: this.item.compereName,
      passiveReplyId: this.item.compereId + "",
      myissue: "1"
    });
  }
}
</script>
<style lang="scss" scoped>
.live-room-item {
  position: relative;
  padding-left: 0.64rem;
  padding-right: 0.28rem;
  border-left: 1px solid #082783;
  min-height: 1.4rem;
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 0.5rem;
    background: white;
  }
  &:last-child {
    &::after {
      display: none;
    }
  }
  .item__head {
    position: absolute;
    left: -0.34rem;
    .head-avatar {
      width: 0.68rem;
      height: 0.72rem;
      background: white;
      img {
        height: 0.68rem;
        width: 0.68rem;
        border-radius: 50%;
      }
    }
    .head-text {
      width: 0.68rem;
      height: 0.26rem;
      background-color: #ffffff;
      border-radius: 0.13rem;
      border: solid 1px #1266ef;
      color: #1266ef;
      font-size: 0.18rem;
      line-height: 0.26rem;
      text-align: center;
      background: white;
    }
  }
  .item__top {
    height: 0.68rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.2rem;
    .top-name {
      font-weight: bold;
      color: #1266ef;
      font-size: 0.3rem;
    }
    .top-time {
      color: #333333;
      font-size: 0.24rem;
    }
  }
  .item__content {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.1rem;
    _content-text {
      color: #222222;
      line-height: 0.42rem;
      font-size: 0.3rem;
      margin-bottom: 0.25rem;
      word-break: break-all;
      // ::v-deep {
      //   .product-content {
      //     width: 100% !important;
      //     padding: 9.5px 11px !important;
      //     .product-img {
      //       width: 2.07rem !important;
      //       height: 2.07rem !important;
      //     }
      //     .product-right {
      //       width: 3.1rem !important;
      //       .product-title {
      //         font-size: 0.32rem !important;
      //         line-height: 0.54rem !important;
      //       }
      //       .right-bottom {
      //         .bottom-price {
      //           font-size: 0.32rem !important;
      //         }
      //       }
      //     }
      //   }
      // }
    }
    .content-img {
      margin-bottom: 0.16rem;
      img {
        width: calc((100% - 0.26rem) / 3);
        height: 1.8rem;
        margin-right: 0.13rem;
        border-radius: 0.06rem;
        &:nth-child(3n + 3) {
          margin-right: 0;
        }

        &:nth-last-child(-n + 2) {
          margin-bottom: 0;
        }
        margin-bottom: 0.13rem;
      }
      &.--big-img {
        img {
          width: 5.04rem;
          height: auto;
          margin: 0;
        }
      }
    }
    .content-img-button {
      width: 1.17rem;
      height: 0.28rem;
      margin-bottom: 0.2rem;
    }
    .content-video {
      width: 100%;
      border-radius: 0.06rem;
      margin-bottom: 0.16rem;
    }
    .content__links {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-bottom: 0.16rem;
      padding: 0.2rem;
      padding-right: 0.16rem;
      background-color: #f8f8f8;
      border-radius: 0.06rem;
      .links__item {
        width: 5.6rem;
        height: 0.6rem;
        margin-bottom: 0.08rem;
        background-color: #ffffff;
        &:last-child {
          margin-bottom: 0;
        }
        .item-icon {
          width: 0.22rem;
          height: 0.22rem;
          margin-left: 0.16rem;
        }
        .item-text {
          width: calc(100% - 0.48rem);
          margin-left: 0.09rem;
          color: #222222;
          font-size: 0.24rem;
          line-height: 0.6rem;
        }
      }
    }
    .content__red-envelope {
      width: 2.72rem;
      height: 3.5rem;
      margin-top: 0.35rem;
      margin-bottom: 0.45rem;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fdf2d3;
      font-size: 0.3rem;
      font-weight: bold;
      .red-envelope-bg {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 0;
      }
      .red-envelope-title {
        position: relative;
        z-index: 1;
        margin-top: 0.24rem;
      }
      .red-envelope-text {
        position: relative;
        z-index: 1;
        margin-top: 1.5rem;
        width: 1.4rem;
        text-align: center;
      }
    }
  }
  .item__zan-comment {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.12rem;
    .zan {
      display: flex;
      align-items: center;
      .zan-icon {
        width: 0.23rem;
        height: 0.2rem;
        margin-right: 0.11rem;
      }
      .zan-text {
        font-size: 0.26rem;
        color: #999999;
      }
    }
    .comment {
      width: 0.34rem;
      height: 0.28rem;
    }
  }
  .item__comments {
    transition: all 0.5s;
    background-color: #f7f7f7;
    border-radius: 0.04rem;
    display: flex;
    flex-direction: column;
    .comment-item {
      font-size: 0.26rem;
      line-height: 0.34rem;
      display: flex;
      padding-left: 0.2rem;
      padding-right: 0.29rem;
      margin-top: 0.22rem;
      .item-icon {
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        margin-right: 0.09rem;
        margin-top: 0.02rem;
      }
      .item-right {
        .item-name {
          color: #1266ef;
        }
        .item-content {
          color: #787878;
        }
      }
      &:last-child {
        margin-bottom: 0.28rem;
      }
    }
    .comment-more {
      width: 100%;
      height: 0.63rem;
      border-top: 1px solid #e0e0e0;
      color: #1266ef;
      font-size: 0.24rem;
      line-height: 0.33rem;
      margin-top: 0.32rem;
    }
  }
}
</style>
