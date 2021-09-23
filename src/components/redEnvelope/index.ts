import Dialog from "./Dialog.vue";
import { IDialog } from "./type";
let mask: HTMLDivElement | null;
let notice = () => {};
function createDialog(parms: any) {
  return new Promise(resolve => {
    if (!mask) {
      notice = () => {
        resolve();
      };
      mask = document.createElement("div");
      const child = document.createElement("div");
      mask.appendChild(child);
      const sv = new Dialog({
        propsData: parms
      });
      sv.$mount(child);
      document.body.appendChild(mask);
      document.body.style.overflow = "hidden";
    } else {
      notice = () => {
        resolve();
      };
    }
  });
}

/**
 * 打开弹框
 */
export const showDialog: IDialog = {
  open: parms => {
    return createDialog({ dialogType: "open", someValue: parms });
  },
  success: parms => {
    return createDialog({ dialogType: "success", someValue: parms });
  },
  fail: parms => {
    return createDialog({ dialogType: "fail", someValue: parms });
  }
};

/**
 * 关闭弹框
 */
export function closeDialog(call = true) {
  call && notice();
  document.body.style.overflow = "auto";
  mask!.remove();
  mask = null;
}
