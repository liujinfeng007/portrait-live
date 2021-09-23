<template>
  <div class="dialog">
    <Success v-if="dialogType === 'success'" @close="close" />
    <Open v-if="dialogType === 'open'" @close="close" />
    <Fail v-if="dialogType === 'fail'" @close="close" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Provide } from "vue-property-decorator";
import { closeDialog } from "./index";
import Fail from "./dialogTypes/Fail.vue";
import Open from "./dialogTypes/Open.vue";
import Success from "./dialogTypes/Success.vue";
@Component({
  components: {
    Fail,
    Open,
    Success
  }
})
export default class Dialog extends Vue {
  @Prop()
  /** 弹框类型 */
  dialogType!: string;

  @Prop()
  @Provide()
  /** 一些奇奇怪怪的东西 */
  someValue!: unknown;

  close(call: boolean) {
    closeDialog(call);
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
