import { Game } from "./Game";

import Vue, { VNode } from "vue";
import App from "./components/Setting.vue";
import Constants from "./Constants";
import { SettingData } from "./Settings";

new Vue({
  el: "#app",
  render: (h): VNode =>
    h(
      App.extend({
        props: {
          settings: {
            type: Object,
            default: function(): SettingData {
              return Constants.defaultSettings;
            }
          },
          gameStart: {
            type: Function,
            default: (settings: SettingData): void => {
              new Game(384, 416, settings);
            }
          }
        }
      })
    )
});
