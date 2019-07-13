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

              let game: typeof Game = Game;
              switch (
                new URL(document.location.href).searchParams.get("mode")
              ) {
                case "master":
                  game = Master3Game;
                  break;
                case "dig":
                  game = DigGame;
                  break;
                case "digChallenge":
                  game = DigChallengeGame;
                  break;
                case "line":
                  game = LineGame;
                  break;
                default:
                  game = Game;
                  break;
              }
              new game(384, 416, settings);
            }
          }
        }
      })
    )
});
