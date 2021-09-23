<template>
  <div class="chat-comment">
    <div
      class="chat-comment-item"
      v-for="(chat, index) in chatList"
      :key="index"
    >
      <div class="chat-comment-user">
        <div class="user-info">
          <VanImage
            round
            width="32"
            height="32"
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          />
          <span class="username">{{ chat.user }}</span>
        </div>

        <div class="chat-comment-like">
          <div class="chat-comment-like-count">10</div>
          <Icon name="good-job-o" size="20" />
        </div>
      </div>

      <div class="chat-comment-content">
        <p>{{ chat.content }}</p>
        <div class="content-reply" v-if="chat.replyList">
          <div
            class="content-reply-item"
            v-for="(reply, index) in chat.replyList"
            :key="index"
          >
            <span style="color: #2567e4;">{{ reply.user }}：</span>
            <span>{{ reply.content }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Image as VanImage, Icon } from "vant";

@Component({
  components: {
    VanImage,
    Icon
  }
})
export default class ChatComment extends Vue {
  // 渲染的数据
  @Prop({ type: Array, default: () => [], required: true })
  chatList!: { user: string; content: string; replyList: unknown[] }[];
}
</script>
<style lang="scss" scoped>
.chat-comment {
  padding: 0.2rem;
  &-user {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.2rem;
    .user-info {
      display: inherit;
      align-items: center;
      > span {
        color: #2567e4;
        font-weight: bolder;
        margin-left: 0.2rem;
      }
    }
  }
  &-like {
    position: relative;
    display: flex;
    &-count {
      font-size: 0.28rem;
      margin-right: 0.1rem;
    }
  }
  &-content {
    position: relative;
    width: calc(100% - 0.44rem - 32px);
    background: #f7f7f7;
    border-radius: 0.05rem;
    padding: 0.12rem;
    margin-left: calc(32px + 0.2rem);
    margin-bottom: 0.24rem;
    text-align: justify;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      left: 10px;
      top: -16px;
      border: 8px solid;
      transform: rotate(90deg);
      border-color: transparent #f7f7f7 #f7f7f7 transparent;
    }
    .content-reply {
      border-top: 1px solid #eeeeee;
      padding-top: 0.12rem;
      margin-top: 0.12rem;
      font-size: 0.26rem;
    }
  }
}
</style>
