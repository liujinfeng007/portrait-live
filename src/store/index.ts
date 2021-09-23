import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const stateOption: IIndexObject = {
  token: "",
  appId: "",
  sessionId: ""
};
export default new Vuex.Store({
  state: stateOption,
  mutations: {
    SET_STATE(state, obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          (state as IIndexObject)[key] = obj[key];
        }
      }
    }
  },
  actions: {},
  modules: {}
});
