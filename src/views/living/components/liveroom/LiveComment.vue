<template>
  <div :class="[{ 'border-bottom': border }, 'live-comment']">
    <!-- 评论标题 评论者信息 -->
    <div class="live-comment-avatar">
      <VanImage
        round
        width="32"
        height="32"
        src="https://img01.yzcdn.cn/vant/cat.jpeg"
      />
      <div>
        <Tag type="primary" round plain>主持人</Tag>
      </div>
    </div>

    <!-- 直播间评论 评论回复 -->
    <div class="live-comment-content">
      <!-- 主持人名 -->
      <div class="username">{{ detail.user }}</div>

      <!-- 主持人发布内容 -->
      <section>
        {{ detail.content }}
      </section>

      <!-- 时间信息、回复按钮、点赞 -->
      <div class="live-comment-content-reply">
        <div>
          <span style="margin-right: .15rem">1分钟前</span>
          <span>回复</span>
        </div>
        <div class="live-comment-like">
          <div class="live-comment-like-count">10</div>
          <Icon name="good-job-o" size="20" />
        </div>
      </div>

      <!-- 直播间的回复 -->
      <LiveReplyComment :reply-list="detail.replyList" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Image as VanImage, Icon, Tag } from "vant";
import LiveReplyComment from "./LiveReplyComment.vue";

@Component({
  components: { VanImage, Icon, Tag, LiveReplyComment }
})
export default class LiveComment extends Vue {
  // 渲染的数据
  @Prop({ type: Object, default: () => {}, required: true })
  detail!: {
    user: string;
    icon: string;
    content: string;
    replyList: unknown[];
  };
  // 是否显示下边框
  @Prop({ type: Boolean, default: false })
  border!: boolean;

  // 评论超过两条展示全部
  showMore = false;
}
</script>
<style lang="scss" scoped>
.flex-center {
  display: flex;
  align-items: center;
}

.border-bottom {
  border-bottom: 1px solid #cecece;
}

.live-comment {
  padding: 0.3rem;
  padding-left: 0;
  margin-left: 0.3rem;
  display: flex;
  align-items: flex-start;
  &-avatar {
    text-align: left;
    margin-right: 0.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    > *:last-child {
      white-space: nowrap;
      transform: scale(0.85);
    }
  }
  &-content {
    .username {
      font-weight: bold;
      color: #2567e4;
      text-align: left;
    }
    section {
      padding: 0.15rem 0;
      text-align: left;
    }
    &-reply {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #999999;
      margin-bottom: 0.15rem;
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
}
</style>
