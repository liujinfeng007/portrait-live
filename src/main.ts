import Vue from "vue";
import vConsole from "vconsole";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/common/mixin";
import "vant/lib/index.css";
import "@/common/AddPrototype";
import "@/assets/style/public.scss";
import Videojs from "video.js";
import "video.js/dist/video-js.css";
import "@/common/registerHook";

Vue.prototype.$video = Videojs;

Vue.config.productionTip = false;

if (
  ["development", "testing"].includes(process.env.NODE_ENV) &&
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
) {
  new vConsole();
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
