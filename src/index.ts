import { Game } from "./Game";

import Vue, { VNode } from "vue";
import App from "./components/Setting.vue";
import Constants from "./Constants";
import { SettingData } from "./Settings";

import store from "store";

new Vue({
  el: "#app",
  render: (h): VNode =>
    h(
      App.extend({
        props: {
          settings: {
            type: Object,
            default: function(): SettingData {
              let settings: SettingData = store.get(Constants.settingsKey);
              return Object.assign(Constants.defaultSettings, settings);
            }
          },
          gameStart: {
            type: Function,
            default: (settings: SettingData): void => {
              store.set(Constants.settingsKey, settings);
              new Game(384, 416, settings);
            }
          }
        }
      })
    )
});
