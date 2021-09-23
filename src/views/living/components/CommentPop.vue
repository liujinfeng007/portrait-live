<template>
  <Popup v-model="show" position="bottom" :round="true">
    <div class="comment-pop">
      <div class="close-btn" @click="show = false">
        <Icon name="cross" color="#000000" size="20" />
      </div>
      <Tabs color="#145be5" border>
        <Tab>
          <template #title>
            <div style="display: flex; align-items: center;">
              <Icon name="video-o" size="20" />
              <span style="margin-left: .08rem; font-size: .3rem">直播间</span>
            </div>
          </template>
          <List
            v-model="liveLoading"
            :finished="liveLoadFinish"
            :immediate-check="false"
            finished-text="没有更多了"
            @load="onLiveLoad"
            class="comment-container"
          >
            <Skeleton title avatar :row="3" v-if="false" />
            <LiveComment
              v-for="(data, index) in mockLiveData"
              :key="index"
              :detail="data"
              :border="true"
            />
          </List>
        </Tab>
        <Tab>
          <template #title>
            <div style="display: flex; align-items: center;">
              <Icon name="chat-o" size="20" />
              <span style="margin-left: .08rem; font-size: .3rem">聊天室</span>
            </div>
          </template>
          <List
            v-model="chatLoading"
            :finished="chatLoadFinish"
            :immediate-check="false"
            finished-text="没有更多了"
            @load="onChatLoad"
            class="comment-container"
          >
            <Skeleton title avatar :row="3" v-if="false" />
            <ChatComment :chat-list="mockChatData" />
          </List>
        </Tab>
      </Tabs>
    </div>
  </Popup>
</template>
<script lang="ts">
import { Component, Vue, ModelSync } from "vue-property-decorator";
import { Popup, Tabs, Tab, List, Icon, Skeleton } from "vant";
import LiveComment from "./liveroom/LiveComment.vue";
import ChatComment from "./chatroom/ChatComment.vue";

@Component({
  components: {
    Popup,
    Tabs,
    Tab,
    List,
    Icon,
    LiveComment,
    ChatComment,
    Skeleton
  }
})
export default class CommentPop extends Vue {
  @ModelSync("_show", "change", { type: Boolean, required: true })
  private show!: boolean;
  // tab部分的list变量
  // 直播间
  liveLoading = false;
  liveLoadFinish = false;
  // 聊天室
  chatLoading = false;
  chatLoadFinish = false;

  // 直播间加数据
  mockLiveData = [
    {
      user: "新重庆客户端",
      icon: "",
      content:
        "的撒开放加快速度疯狂的风景肯定舒服阿斯顿看见谁都快结束的健康是的解放军队富士康第三方空间",
      replyList: [
        { user: "张三", icon: "", content: "回复夫妇阿斯顿解放后" },
        {
          user: "王久",
          icon: "",
          content:
            "公开发出v了阿斯顿公开发出v了阿斯顿公开发出v了阿斯顿公开发出v了阿斯顿公开发出v了阿斯顿公开发出v了阿斯顿"
        }
      ]
    },
    {
      user: "新重庆客户端",
      icon: "",
      content:
        "的撒开放加快速度疯狂的风景肯定舒服阿斯顿看见谁都快结束的健康是的解放军队富士康第三方空间",
      replyList: [{ user: "李四", icon: "", content: "回复夫妇阿斯顿解放后" }]
    }
  ];
  // 聊天室数据
  mockChatData = [
    {
      user: "张三",
      content: "李四的匡扶汉室都看了第三方空间发的是你",
      icon: ""
    },
    {
      user: "李四",
      content: "速度疯狂技术的开发难受的呢",
      icon: "",
      replyList: [
        { user: "张三", icon: "", content: "回复夫妇阿斯顿解放后" },
        {
          user: "王久",
          icon: "",
          content:
            "公开发出v了阿斯顿公开发出v了阿斯顿公开发出v了阿斯顿公开发出v了阿斯顿公开发出v了阿斯顿公开发出v了阿斯顿"
        }
      ]
    },
    { user: "王五", content: "速度疯狂送啊未开发的", icon: "" },
    { user: "陈六", content: "阿斯顿啦啦额外六六大顺放开你看", icon: "" },
    { user: "周七", content: "阿斯顿了连日来的风格", icon: "" },
    { user: "康八", content: "阿斯顿啦啦疯狂让你打发时间看吧", icon: "" }
  ];

  // 直播间评论加载
  onLiveLoad() {
    console.log("触底");
  }
  // 聊天室评论加载
  onChatLoad() {
    console.log("触底");
    // this.$store.commit("", );
  }
}
</script>
<style lang="scss" scoped>
.comment-pop {
  position: relative;
  .close-btn {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    z-index: 9999;
  }
  .comment-container {
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>
