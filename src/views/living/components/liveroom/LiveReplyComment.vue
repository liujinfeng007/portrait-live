<template>
  <div class="reply-comment">
    <div
      class="reply-comment-item"
      v-for="(reply, index) in replyList.slice(0, showMore ? 1000 : 1)"
      :key="index"
    >
      <VanImage
        round
        width="16"
        height="16"
        src="https://img01.yzcdn.cn/vant/cat.jpeg"
        style="position: relative; top: 2px;"
      />
      <div>
        <span style="color: #2768e5;">{{ reply.user }}：</span>
        <span>{{ reply.content }}</span>
      </div>
    </div>

    <div
      class="show-more-button"
      @click="showMore = !showMore"
      v-if="replyList.length > 1"
    >
      {{ showMore ? "收起回复" : "展开更多回复" }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Image as VanImage } from "vant";
@Component({
  components: { VanImage }
})
export default class LiveReplyComment extends Vue {
  @Prop({ type: Array, default: () => [] })
  replyList!: unknown[];

  // 是否点击展示更多
  showMore = false;
}
</script>
<style lang="scss" scoped>
.reply-comment {
  width: calc(100% - 0.24rem);
  background: #f7f7f7;
  border-radius: 0.05rem;
  padding: 0.12rem;
  &-item {
    display: flex;
    margin-bottom: 0.12rem;
    transition: 0.4s ease-in;
    > *:not(:first-child) {
      text-align: left;
      margin-left: 0.1rem;
      font-size: 0.26rem;
      flex: 1;
    }
  }
  .show-more-button {
    border-top: 1px solid #eeeeee;
    padding-top: 0.1rem;
    color: #2768e5;
    font-size: 0.26rem;
  }
}
</style>
