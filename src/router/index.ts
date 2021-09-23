import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    meta: {
      keepAlive: true
    },
    component: () => import("../views/Home.vue")
  },
  {
    path: "/Living",
    name: "Living",
    component: () => import("../views/living/Living.vue")
  },
  {
    path: "/host-filter",
    name: "HostFilter",
    component: () => import("../views/HostFilter.vue")
  },
  {
    path: "/record",
    name: "Record",
    component: () => import("../views/Record.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});
export default router;
