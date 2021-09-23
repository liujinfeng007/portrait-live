<template>
  <!-- 弹幕评论 -->
  <div class="comment">
    <div class="comment-container" @click="showWin = true">
      <!-- 主持人消息横向滚动 -->
      <div class="comment-host" ref="comment-host">
        <Swipe style="height: 1rem" :autoplay="3000" :show-indicators="false">
          <SwipeItem v-for="host in hostComments" :key="host.informationId">
            <div class="comment-host-item bg">
              <Tag round type="primary">主持人</Tag>
              <span style="color: red; margin-left: .05rem"
                >{{ host.compereName }}：</span
              >
              <span>{{ host.content }}</span>
            </div>
          </SwipeItem>
        </Swipe>
      </div>

      <!-- 用户评论滚动 -->
      <AutoScroll
        v-model="userComments"
        height="calc(0.74rem * 5)"
        ref="auto-scroll"
      >
        <div
          class="comment-user-item bg"
          v-for="user in userComments"
          :key="user.replyId"
        >
          <span style="color: #8BE8FF">{{ user.userName }}：</span>
          <span>{{ user.content }}</span>
        </div>
      </AutoScroll>
    </div>

    <!-- 点击评论 弹出窗口 -->
    <CommentPop v-model="showWin" />
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import { Tag, Swipe, SwipeItem, Icon } from "vant";
import AutoScroll from "@/components/AutoScroll.vue";
import { WithInject } from "../Mixins";
import CommentPop from "./CommentPop.vue";
import { ILiveInfo } from "@/api/types";

@Component({
  components: {
    Tag,
    Swipe,
    SwipeItem,
    Icon,
    AutoScroll,
    CommentPop
  }
})
export default class Comment extends WithInject {
  // 用户评论弹幕
  get userComments(): ILiveInfo["replyList"] {
    return this.liveInfo.replyList || [];
  }

  // 主持人轮播信息
  get hostComments(): ILiveInfo["classifyList"] {
    return this.liveInfo.classifyList || [];
  }
  // 直播与聊天
  showWin = false;
  // 当前选择的主持人筛选队列
  hostIds: string[] = [];

  mounted() {
    // if (this.$route.query.hostIds) {
    //   this.hostIds = (this.$route.query.hostIds as string).split("-");
    // } else {
    //   this.hostIds = [];
    // }
    // setTimeout(() => {
    //   this.mockData();
    // }, 10000);
  }

  // 测试用 添加评论 暂时选择在Watch中对队列进行处理
  // 目前做的分享页 发不了评论
  // addComment(comment: { name: string; content: string; }) {
  //   const rootEl = (this.$refs["auto-scroll"] as Vue).$el as HTMLElement;
  //   this.userComments.push(comment);
  //   // 添加评论后列表滚动到底部
  //   rootEl.scrollTop = rootEl.scrollHeight;
  // }
}
</script>
<style lang="scss" scoped>
.comment {
  height: auto;
  .comment-host {
    color: #ffffff;
    height: 1rem;
    width: 75vw;
    overflow: hidden;
    position: relative;
    margin-bottom: 0.16rem;
    &-item {
      position: absolute;
      background: rgba(0, 0, 0, 0.6) !important;
      border-radius: 0.2rem !important;
    }
  }
  .comment-user-item {
    color: #ffffff;
    margin-top: 0.1rem;
    min-height: 0.4rem;
    line-height: 0.4rem;
    width: max-content;
    max-width: 5.8rem;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .bg {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.4rem;
    font-weight: bold;
    font-size: 0.24rem;
    text-align: left;
    padding: 0.12rem 0.15rem;
  }
}
</style>
