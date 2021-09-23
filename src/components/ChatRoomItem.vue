·<template>
  <div class="chat-room-item">
    <div class="item-left" :class="{ '--self': item.isMeReply }">
      <img :src="item.replyUserUrl" />
    </div>
    <div class="item__right">
      <div class="right__header">
        <div class="header-name">{{ item.nickname }}</div>
        <div class="header__zan" @click="doPraise">
          <div class="zan-text">{{ item.praise || "" }}</div>
          <img :src="zanIcon" class="zan-icon" />
        </div>
      </div>
      <div class="right__content" @click="show = true">
        <div class="content-text">{{ item.content }}</div>
        <img v-if="item.imageUrl" :src="item.imageUrl" class="content-img" />
        <div class="content-reply" v-if="item.passiveReplyId">
          回复 <span>{{ item.passiveReplyName }}:</span> {{ item.sourceTitle }}
        </div>
      </div>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="select"
      cancel-text="取消"
      close-on-click-action
    />
  </div>
</template>
<script lang="ts">
import { IChatRoomItem } from "@/api/types";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ActionSheet, Toast } from "vant";
import request from "@/api/index";
import { copy } from "@/common/utils";
import { needToken } from "@/common/decorator";
import Native from "@/common/Native";
@Component({
  components: {
    [ActionSheet.name]: ActionSheet
  }
})
export default class ChatRoomItem extends Vue {
  @Prop()
  item!: IChatRoomItem;
  show = false;
  actions = [{ name: "复制" }, { name: "回复" }];

  get zanIcon() {
    if (this.item.isPraise) {
      return require("../assets/image/聊天点赞（已点赞）@2x.png");
    } else {
      return require("../assets/image/聊天点赞@2x.png");
    }
  }

  @needToken(true)
  async doPraise() {
    if (this.item.isPraise) return;
    const result = await request.doPraise(
      this.item.replyUserId,
      this.$store.state.detail!.title,
      this.item.id + "",
      1,
      1
    );
    if (result.data) {
      this.$emit("do-praise", this.item.id, 2);
    }
  }

  select(action: { name: string }) {
    switch (action.name) {
      case "复制":
        if (copy(this.item.content)) {
          Toast("复制成功");
        } else {
          Toast("复制失败");
        }
        break;
      case "回复":
        this.openComment();
        break;
    }
  }

  @needToken(true)
  openComment() {
    Native.openComment({
      sourceType: this.item.sourceType,
      id: this.$store.state.infoClassifyId,
      replyId: this.item.id + "",
      passiveReplyName: this.item.passiveReplyName,
      passiveReplyId: this.item.passiveReplyId,
      myissue: "1"
    });
  }
}
</script>
<style lang="scss" scoped>
.chat-room-item {
  margin-top: 0.4rem;
  width: 100%;
  display: flex;
  padding: 0 0.28rem;

  .item-left {
    width: 0.68rem;
    height: 0.68rem;
    margin-right: 0.3rem;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    &.--self::after {
      position: absolute;
      top: -0.09rem;
      right: -0.17rem;
      display: block;
      content: " ";
      width: 0.34rem;
      height: 0.34rem;
      background: url("../assets/image/我@2x.png");
      background-size: cover;
    }
  }
  .item__right {
    width: calc(100% - 0.98rem);
    .right__header {
      display: flex;
      width: 100%;
      height: 0.68rem;
      justify-content: space-between;
      align-items: center;
      .header-name {
        color: #1266ef;
        line-height: 0.42rem;
        font-size: 0.3rem;
      }
      .header__zan {
        display: flex;
        align-items: center;
        .zan-text {
          color: #999999;
          font-size: 0.26rem;
          line-height: 0.5rem;
          margin-right: 0.08rem;
          &.--praise {
            color: #1266ef;
          }
        }
        .zan-icon {
          width: 0.23rem;
          height: 0.2rem;
        }
      }
    }
    .right__content {
      width: 100%;
      background-color: #f7f7f7;
      border-radius: 0.04rem;

      .content-text {
        padding: 0.14rem 0.2rem 0.24rem;

        font-size: 0.3rem;
        line-height: 0.42rem;
        color: #222222;
      }
      .content-img {
        width: 5.04rem;
        height: 2.64rem;
        border-radius: 0.06rem;
        margin: 0 0.2rem 0.1rem;
      }
      .content-reply {
        width: 100%;
        border-top: 1px solid #e0e0e0;
        font-size: 0.26rem;
        line-height: 0.44rem;
        padding: 0.11rem 0.2rem 0.18rem;

        color: #787878;
        .span {
          color: #1266ef;
        }
      }
    }
  }
}
</style>
