<template>
  <div class="gift">
    <van-action-sheet
      :closeable="false"
      :round="false"
      :close-on-popstate="true"
      @open="getLivePoint"
      v-model="showValue"
      title="礼物"
    >
      <div class="gift__content">
        <div class="content__top">
          <van-swipe indicator-color="#1266ef">
            <van-swipe-item
              v-for="(giftPage, serviceIndex) in giftList"
              :key="serviceIndex"
              ><div class="gift-bar">
                <div
                  class="gift-item"
                  :class="{ '--active': item === currentItem }"
                  v-for="(item, index) in giftPage"
                  :key="index"
                  @click="itemClick(item)"
                >
                  <template v-if="item">
                    <img :src="item.giftImg" class="item-icon" />
                    <div class="item-title">{{ item.giftName }}</div>
                    <div class="item-pointSum">
                      {{ item.pointSum | showIntegral }}
                    </div>
                  </template>
                  <div v-else class="item-icon"></div>
                </div></div
            ></van-swipe-item>
          </van-swipe>
        </div>
        <div class="content__bottom">
          <img src="../assets/image/积分@2x.png" class="bottom-icon" />
          <div class="bottom-integral">可用积分 {{ integral }}</div>
          <div class="bottom-record" @click="record">兑换记录</div>
          <div class="bottom__number" @click="showSelector = !showSelector">
            <template v-if="currentItem">
              <Selector v-if="showSelector" @set-num="setNum" />
              <div class="number-content __flex">
                <span>{{ currentNum }}</span>
              </div>
            </template>
          </div>
          <div
            class="bottom-button __flex"
            :class="{ '--disable': buttonDisabled }"
            @click="sendGift"
          >
            赠送
          </div>
        </div>
      </div>
    </van-action-sheet>

    <van-action-sheet
      class="keyboard-popup"
      :closeable="false"
      :round="false"
      :close-on-popstate="true"
      v-model="showKeyBoard"
      @closed="keyBoardClosed"
    >
      <div class="keyboard__content">
        <div class="keyboard__title">
          <input
            type="text"
            placeholder="请输入数量"
            v-model="keyBoardNum"
            class="title-input"
            disabled
          />
          <div class="title-button __flex" @click="inputOver">完成</div>
        </div>
        <van-number-keyboard
          :transition="false"
          :show="true"
          :hide-on-click-outside="false"
          v-model="keyBoardNum"
          @blur="showKeyBoard = false"
        />
      </div>
    </van-action-sheet>
  </div>
</template>
<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
import { ActionSheet, Swipe, SwipeItem, NumberKeyboard, Toast } from "vant";
import Selector from "@/components/Selector.vue";
import { createAnimation } from "@/components/giftAnimation/index";
import { needToken } from "@/common/decorator";
import request from "@/api/index";
import { IGiftItem } from "@/api/types";
@Component({
  components: {
    [ActionSheet.name]: ActionSheet,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [NumberKeyboard.name]: NumberKeyboard,
    Selector
  },
  filters: {
    showIntegral(i: number) {
      if (i === 0) {
        return "免费";
      } else {
        return `积分  ${i}`;
      }
    }
  }
})
export default class Gift extends Vue {
  @Prop()
  @Model("show")
  show!: boolean;

  @Prop()
  list!: IGiftItem[];

  integral = "--";

  showSelector = false;

  showKeyBoard = false;

  giftList: IGiftItem[][] = [];

  currentItem: IGiftItem | null = null;
  currentNum = 1;
  keyBoardNum = "";

  get showValue() {
    return this.show;
  }

  set showValue(value: boolean) {
    if (!value) {
      this.init();
    }
    this.$emit("show", value);
  }

  /**
   * 赠送按钮是否可交互
   */
  get buttonDisabled() {
    return this.currentItem === null;
  }

  mounted() {
    this.setGiftList();
  }

  init() {
    this.currentItem = null;
    this.currentNum = 1;
  }

  /** 获取礼物列表 */
  setGiftList() {
    const pageLength = 8;
    for (let i = 0; i < this.list.length; i += pageLength) {
      const page = this.list.slice(i, i + pageLength);
      page.length = pageLength;
      this.giftList.push(page);
    }
  }

  keyBoardClosed() {
    this.keyBoardNum = "";
  }

  inputOver() {
    const number = Number(this.keyBoardNum);
    if (!isNaN(number)) {
      this.currentNum = number;
    }
    this.showKeyBoard = false;
  }

  itemClick(item: IGiftItem) {
    if (item) {
      this.currentItem = item;
    }
  }

  setNum(num: number) {
    if (num > 0) {
      this.currentNum = num;
    } else {
      this.showKeyBoard = true;
    }
  }

  /** 赠送礼物 */
  @needToken(true, true)
  async sendGift() {
    if (this.buttonDisabled) return;
    if (this.currentNum * this.currentItem!.pointSum > Number(this.integral)) {
      Toast("积分余额不足");
    } else {
      const result = await request.liveExchange(
        this.currentItem!.id,
        this.currentNum,
        this.$store.state.detail.informationId,
        this.$store.state.detail.title
      );
      console.log("赠送礼物结果：", result);
      if (result.code === 0) {
        createAnimation(
          this.currentItem!.giftGif,
          this.currentNum,
          Number(this.currentItem?.showTime) * 1000
        );
      } else {
        Toast(result.message);
      }
      this.showValue = false;
    }
  }

  /** 获取可用总积分 */
  @needToken(false)
  async getLivePoint() {
    const result = await request.livePoint();
    if (typeof result.data === "number") {
      this.integral = result.data + "";
    }
  }

  record() {
    this.$router.push("/record");
  }
}
</script>
<style lang="scss" scoped>
.gift {
  .van-action-sheet {
    box-shadow: 0rem 0rem 0.16rem 0rem rgba(0, 0, 0, 0.3);
    background: linear-gradient(rgba($color: #ffffff, $alpha: 0.95), #ffffff);
    .van-action-sheet__header {
      color: #1266ef;
      font-size: 0.3rem;
      height: 0.8rem;
      line-height: 0.8rem;
      border-bottom: 1px solid #dadada;
      font-weight: bold;
    }
  }
  ::v-deep .van-overlay {
    background: transparent;
  }
  .gift__content {
    width: 100%;
    height: 4.83rem;
    .content__top {
      height: 3.96rem;
      width: 100%;
      .van-swipe {
        width: 100%;
        height: 3.96rem;
        & ::v-deep .van-swipe__indicators {
          bottom: 0.2rem;
          .van-swipe__indicator {
            background-color: #c2cad8;
            opacity: 1;
            width: 0.12rem;
            height: 0.12rem;
          }
        }
      }

      .gift-bar {
        width: 100%;

        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 0.17rem;
        padding-top: 0.11rem;
        .gift-item {
          margin-top: 0.07rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 1.6rem;
          height: 1.6rem;
          position: relative;
          line-height: 1;
          &.--active::after {
            content: "";
            position: absolute;
            left: 0;
            top: 0.06rem;
            display: inline-block;
            width: 100%;
            height: 100%;
            border-radius: 0.06rem;
            border: solid 0.02rem #1266ef;
          }
          .item-icon {
            width: 0.74rem;
            height: 0.66rem;
          }
          .item-title {
            white-space: nowrap;
            color: #333333;
            font-size: 0.24rem;
            margin-top: 0.2rem;
            width: 100%;
            text-align: center;
            overflow: hidden;
            line-height: initial;
          }
          .item-pointSum {
            width: 100%;
            color: #999999;
            font-size: 0.2rem;
            text-align: center;
            margin-top: 0.1rem;
          }
        }
      }
    }
    .content__bottom {
      width: 100%;
      height: 0.86rem;
      border-top: 1px solid #dadada;
      display: flex;
      align-items: center;
      .bottom-icon {
        width: 0.4rem;
        height: 0.4rem;
        margin-left: 0.3rem;
      }
      .bottom-integral {
        color: #222222;
        font-size: 0.24rem;
        margin-left: 0.14rem;
        width: 1.74rem;
        overflow: hidden;
      }
      .bottom-record {
        text-decoration: underline;
        font-size: 0.24rem;
        color: #1266ef;
        margin-left: 0.34rem;
      }
      .bottom__number {
        width: 0.8rem;
        height: 0.4rem;
        margin-left: 0.85rem;
        position: relative;
        .number-content {
          width: 100%;
          height: 100%;

          border-radius: 0.06rem;
          border: solid 1px #1266ef;
          color: #222222;
          font-size: 0.24rem;
          position: relative;
          span {
            display: inline-block;
            width: 0.6rem;
            position: absolute;
            left: 0;
            text-align: center;
          }
          &::after {
            content: "";
            position: absolute;
            display: inline-block;
            width: 0;
            height: 0;
            border: 0.06rem solid transparent;
            right: 0.06rem;
            border-top-color: black;
            transform: translateY(25%);
          }
        }
      }
      .bottom-button {
        width: 1.36rem;
        height: 0.58rem;
        background-color: #1266ef;
        border-radius: 0.29rem;
        line-height: 1;
        color: #ffffff;
        font-size: 0.26rem;
        margin-left: 0.2rem;
        &.--disable {
          background-color: #bbbbbb;
        }
      }
    }
  }
  .keyboard-popup {
    background: white;
  }
  .keyboard__content {
    width: 100%;
    min-height: calc(244px + 0.94rem);
    .keyboard__title {
      height: 0.94rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title-input {
        width: 5.42rem;
        height: 0.6rem;
        line-height: 0.6rem;
        background-color: #f1f1f1;
        border-radius: 0.3rem;
        border: solid 1px #dfdfdf;
        margin-left: 0.29rem;
        text-indent: 0.23rem;
        font-size: 0.26rem;
        color: #333333;
        &::placeholder {
          color: #c1c1c3;
        }
      }
      .title-button {
        margin-right: 0.21rem;
        width: 1.38rem;
        height: 0.6rem;
        background-color: #fdfdfd;
        border-radius: 0.16rem;
        border: solid 0.02rem #dfdfdf;

        color: #999999;
        font-size: 0.26rem;
        line-height: 1;
      }
    }
  }
}
</style>
