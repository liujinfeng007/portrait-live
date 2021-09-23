<template>
  <div class="host-filter">
    <header>
      <div>
        选择你想查看的主持人
        <span>（可多选）</span>
      </div>

      <img
        src="../assets/image/全选.png"
        width="20"
        height="20"
        alt="全选"
        @click="chooseAll"
      />
    </header>

    <CheckboxGroup
      v-model="hostCheck"
      @change="onHostChange"
      ref="checkboxGroup"
    >
      <div
        class="host-item"
        v-for="(host, index) in hostList"
        :key="index"
        @click="
          () =>
            hostCheck.includes(host)
              ? hostCheck.splice(hostCheck.indexOf(host), 1)
              : hostCheck.push(host)
        "
      >
        <div class="host-info flex-center">
          <VanImage
            round
            width="32"
            height="32"
            :src="host.avatarUrl || 'https://img01.yzcdn.cn/vant/cat.jpeg'"
          />
          <span
            :style="{
              marginLeft: '.2rem',
              color: `${hostCheck.includes(host) ? '#bb3e32' : '#999999'}`
            }"
          >
            {{ host.hostAppName }}
          </span>
        </div>
        <Checkbox checked-color="#bb3e32" :name="host" />
      </div>
    </CheckboxGroup>

    <footer>
      <div class="button reset-button" @click="onReset">重置</div>
      <div class="button confirm-button" @click="onConfirm">完成</div>
    </footer>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Image as VanImage, Icon, Checkbox, CheckboxGroup } from "vant";
import request from "@/api/index";
import { IHosts } from "@/api/types";
import { toastWithDelay } from "@/common/decorator";

@Component({
  components: { VanImage, Icon, Checkbox, CheckboxGroup }
})
export default class HostFilter extends Vue {
  // 全部选择checkbox
  all = false;
  // 主持人列表checkbox
  hostCheck: IHosts["data"] = [];
  show = false;
  hostList: IHosts["data"] = [];

  mounted() {
    this.getHostList();
  }

  // 获取主持人列表
  @toastWithDelay({
    message: "加载中...",
    forbidClick: true,
    overlay: true
  })
  async getHostList() {
    const res = await request.getHosts(
      this.$route.query.id || this.$store.state.infoClassifyId
    );
    if (res.code === 0) {
      this.hostList = res.data;
      // 回显 暂时不做
      // if (this.$route.query.hostIds) {
      //   const checkedIds: string[] = (this.$route.query.hostIds as string).split(",");
      //   this.hostCheck = this.hostList.filter(host =>
      //     checkedIds.includes(String(host.id))
      //   );
      // }
    }
  }

  // 点击全部
  chooseAll() {
    this.all = !this.all;
    (this.$refs.checkboxGroup as CheckboxGroup).toggleAll(this.all);
  }

  // 主持人列表变化
  onHostChange(host: boolean[]) {
    if (host.length < this.hostList.length) {
      this.all = false;
    }
  }

  // 点击确认
  onConfirm() {
    // 默认都不选就是全选
    this.$router.push({
      path: "/",
      query:
        this.all || this.hostCheck.length === 0
          ? { id: this.$store.state.infoClassifyId }
          : {
              id: this.$store.state.infoClassifyId,
              hostIds: this.hostCheck.map(host => host.id).join("-")
            }
    });
  }
  // 点击重置
  onReset() {
    this.all = false;
    (this.$refs.checkboxGroup as CheckboxGroup).toggleAll(false);
  }
}
</script>
<style lang="scss" scoped>
.flex-center {
  display: flex;
  align-items: center;
}
.host-filter {
  padding-bottom: 0.8rem;
  // &-container {
  //   position: fixed;
  //   width: 100vw;
  //   height: 100vh;
  //   z-index: 9999;
  //   padding-bottom: 0.8rem;
  //   top: 0;
  //   left: 0;
  //   background: #ffffff;
  // }
  header {
    background: #f3f3f3;
    padding: 0.24rem 0.32rem;
    font-size: 0.26rem;
    @extend .flex-center;
    justify-content: space-between;
    span {
      color: #999999;
    }
  }
  .host-item,
  .all {
    padding: 0.28rem 0.32rem;
    border-bottom: 1px solid #eeeeee;
    @extend .flex-center;
    justify-content: space-between;
  }
  footer {
    position: fixed;
    bottom: 0.5rem;
    display: flex;
    width: 75vw;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 1rem;
    background: linear-gradient(to right, #ffffff 10%, #bb3e32 20%);
    .button {
      width: 50%;
      padding: 0.24rem 0.4rem;
      text-align: center;
      font-size: 0.3rem;
      font-weight: bolder;
    }
    .reset-button {
      background: #ffffff;
      border: 1px solid #bb3e32;
      border-radius: 1rem;
      border-top-right-radius: 0;
      color: #bb3e32;
    }
    .confirm-button {
      background: #bb3e32;
      color: #ffffff;
      border-top-right-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }
}
</style>
