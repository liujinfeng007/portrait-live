<template>
  <div class="success __flex" @click.stop="close(false)">
    <div class="success__content">
      <img src="../../../assets/image/红包弹窗2@2x.png" class="content-bg" />
      <div class="content-box" @click.stop="() => {}">
        <div class="content-header">恭喜获得</div>
        <div class="content-sum">
          <span>{{ someValue.sum }}</span
          >{{ type }}
        </div>
        <template v-if="someValue.type === 1">
          <div class="content__code">
            <div class="code-text">兑换码：{{ someValue.code }}</div>
            <div class="code-button __flex">{{ status }}</div>
          </div>
          <div class="content__button __flex" @click.stop="copy">
            复制
          </div>
          <div class="content__tips">
            兑奖说明：请在24小时内前往<span>{{ someValue.wechatName }}</span
            >，进入后点击【红包领取】，输入兑 奖码即可领取红包
          </div>
        </template>
        <div class="content__tips --type2" v-else>
          注：积分已自动到账，请注意查收
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { ISuccess } from "../type";
import { copy } from "@/common/utils";
import { Toast } from "vant";
@Component
export default class Success extends Vue {
  @Inject()
  someValue!: ISuccess;

  get type() {
    return this.someValue.type === 1 ? "元" : "积分";
  }

  get status() {
    const array = ["可兑换", "已兑换", "已过期"];
    return array[this.someValue.codeStatus];
  }

  copy() {
    if (copy(this.someValue.code)) {
      Toast("复制成功");
      this.close(true);
    } else {
      Toast("复制失败");
    }
  }

  close(call: boolean) {
    this.$emit("close", call);
  }
}
</script>
<style lang="scss" scoped>
.success {
  width: 100%;
  height: 100%;
  animation: show 0.3s;
  line-height: 1;
  .success__content {
    width: 4.75rem;
    height: 6.13rem;
    position: relative;
    .content-bg {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 0;
    }
    .content-box {
      width: 100%;
      height: 100%;
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;
      z-index: 1;
      .content-header {
        color: #d19135;
        font-size: 0.3rem;
        font-weight: bold;
        margin-top: 0.72rem;
      }
      .content-sum {
        color: #e22d1b;
        font-weight: bold;
        font-size: 0.3rem;
        margin-top: 0.22rem;
        span {
          font-size: 0.6rem;
        }
      }
      .content__code {
        margin-top: 1.2rem;
        display: flex;
        align-items: center;
        .code-text {
          color: #fdf2d3;
          font-size: 0.28rem;
          font-weight: bold;
        }
        .code-button {
          width: 0.79rem;
          height: 0.36rem;
          border-radius: 0.1rem;
          border: solid 0.02rem #ffeab5;
          color: #ffffff;
          font-size: 0.22rem;
          margin-left: 0.09rem;
        }
      }
      .content__button {
        width: 2.85rem;
        height: 0.72rem;
        border-radius: 0.1rem;
        background-image: linear-gradient(0deg, #fcd48b 0%, #ffe9b4 100%);
        color: #d19135;
        font-size: 0.36rem;
        font-weight: bold;
        margin-top: 0.36rem;
      }
      .content__tips {
        width: 4rem;
        font-size: 0.22rem;
        margin-top: 0.6rem;
        color: #ffffff;
        span {
          color: #fef54d;
        }
      }
      .--type2 {
        margin-top: 3.4rem;
      }
    }
  }
}
@keyframes show {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
