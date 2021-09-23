import Vue from "vue";
Vue.mixin({
  beforeRouteEnter(to, from, next) {
    if (to.meta.keep) {
      const content = document.getElementById("app");
      if (content) {
        next(vm => {
          content.scrollTop = to.meta.scrollTop;
        });
      }
    } else {
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    //如果是需要缓存的页面，滚动到上次保存的高度
    if (from.meta.keep) {
      const content = document.getElementById("app");
      if (content) {
        from.meta.scrollTop = content.scrollTop;
      }
    }
    next();
  }
});
