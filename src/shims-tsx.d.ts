import Vue, { VNode } from "vue";

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface ComponentOptions<V extends Vue> {
    [propName: string]: any;
  }

  /**
   * 可索引Object
   */
  export interface IIndexObject extends Object {
    [index: string]: any;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    [propName: string]: any;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $video: (
      id: string | Element,
      options?: VideoJsPlayerOptions | undefined,
      ready?: (() => void) | undefined
    ) => videojs.VideoJsPlayer;
  }
}
