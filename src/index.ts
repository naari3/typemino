import { Game } from "./Game";

import Vue, { VNode } from "vue";
import App from "./components/Setting.vue";

new Game(384, 416);

new Vue({
  el: "#app",
  render: (h): VNode => h(App)
});
