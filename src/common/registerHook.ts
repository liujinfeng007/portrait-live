import { Component } from "vue-property-decorator";

Component.registerHooks([
  "mounted",
  "created",
  "before",
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate"
]);
