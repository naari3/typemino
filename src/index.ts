import { Game } from "./Game";

import Vue, { VNode } from "vue";
import App from "./components/Setting.vue";
import Constants from "./Constants";
import { SettingData } from "./Settings";

import store from "store";
import { Master3Game } from "./Master3Game";

import { version } from "../package.json";
import { DigGame } from "./DigGame";
import { LineGame } from "./LineGame";
import { DigChallengeGame } from "./DigChallengeGame";

document.write(`current version: v${version}`);

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

              switch (
                new URL(document.location.href).searchParams.get("mode")
              ) {
                case "master":
                  new Master3Game(384, 416, settings);
                  break;
                case "dig":
                  new DigGame(384, 416, settings);
                  break;
                case "digChallenge":
                  new DigChallengeGame(384, 416, settings);
                  break;
                case "line":
                  new LineGame(384, 416, settings);
                  break;
                default:
                  new Game(384, 416, settings);
                  break;
              }
            }
          }
        }
      })
    )
});
