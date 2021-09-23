import { IGetDetail, ILiveInfo } from "@/api/types";
import { Vue, InjectReactive } from "vue-property-decorator";

export class WithInject extends Vue {
  // 直播间详情
  @InjectReactive("liveDetail")
  liveDetail!: IGetDetail["data"];

  // 直播间轮训信息
  @InjectReactive({ from: "liveInfo", default: () => {} })
  liveInfo!: ILiveInfo;
}
