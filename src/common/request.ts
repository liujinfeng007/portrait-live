import axios from "axios";
import native from "@/common/Native";
import { Dialog } from "vant";
import store from "@/store";
import qs from "qs";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: false,
  timeout: 9000
});

service.interceptors.request.use(
  config => {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    config.data = qs.stringify(config.data, { indices: false });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  resp => {
    // 登录过期
    if (
      resp.data.code === -101000134 &&
      process.env.NODE_ENV !== "development"
    ) {
      Dialog({ message: resp.data.message }).then(() => {
        native.goForceToken().then(result => {
          store.commit("SET_STATE", result);
        });
      });
    }
    return resp.data;
  },
  error => {
    console.log("response error: ", error); // for debug
    return Promise.reject(error);
  }
);

export default service;
