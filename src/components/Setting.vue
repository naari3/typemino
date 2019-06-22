<template>
  <div>
    <form>
      <p>
        <label>gravity:</label>
        <input
          v-model.number="settingsGravity"
          type="number"
          min="0"
          max="1310720"
        />
        <label>{{ Math.round((settingsGravity / 65536) * 100) / 100 }} G</label>
      </p>

      <p>
        <label>lock delay time:</label>
        <input v-model.number="settingsLockDelayTime" type="number" min="0" />
        <label>frame(s)</label>
      </p>

      <p>
        <label>ARE time:</label>
        <input v-model.number="settingsAreTime" type="number" min="0" />
        <label>frame(s)</label>
      </p>

      <p>
        <label>line clear time:</label>
        <input v-model.number="settingsLineClearTime" type="number" min="0" />
        <label>frame(s)</label>
      </p>

      <p>
        <label>das time:</label>
        <input v-model.number="settingsDasTime" type="number" min="0" />
        <label>frame(s)</label>
      </p>

      <h5>key config</h5>

      <p>
        <label>↑:</label>
        <button
          @click="setControllerKey('up')"
          type="button"
          v-bind:disabled="started"
        >
          {{ settings.controller.up }}
        </button>

        <label>↓:</label>
        <button
          @click="setControllerKey('down')"
          type="button"
          v-bind:disabled="started"
        >
          {{ settings.controller.down }}
        </button>

        <label>←:</label>
        <button
          @click="setControllerKey('left')"
          type="button"
          v-bind:disabled="started"
        >
          {{ settings.controller.left }}
        </button>

        <label>→:</label>
        <button
          @click="setControllerKey('right')"
          type="button"
          v-bind:disabled="started"
        >
          {{ settings.controller.right }}
        </button>
      </p>

      <p>
        <label>left rotate:</label>
        <button
          @click="setControllerKey('rotateLeft')"
          type="button"
          v-bind:disabled="started"
        >
          {{ settings.controller.rotateLeft }}
        </button>

        <label>right rotate:</label>
        <button
          @click="setControllerKey('rotateRight')"
          type="button"
          v-bind:disabled="started"
        >
          {{ settings.controller.rotateRight }}
        </button>

        <label>hold:</label>
        <button
          @click="setControllerKey('hold')"
          type="button"
          v-bind:disabled="started"
        >
          {{ settings.controller.hold }}
        </button>
      </p>

      <input
        type="submit"
        value="game start"
        @click="doGameStart"
        v-if="!started"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";

import { SettingData } from "../Settings";

@Component
export default class Setting extends Vue {
  private settingsDefault: Function;

  settings: SettingData;
  gameStart: Function;
  started: boolean = false;

  @Emit()
  public inputNumber(key: string, value: number | string) {
    if (value < 0 || value === "") value = 0;
    this.settings[key] = value;
  }

  @Emit()
  public inputControllerKey(key: string, value: string) {
    this.settings.controller[key] = value;
  }

  private get settingsGravity(): number {
    return this.settings.gravity;
  }

  private set settingsGravity(value: number) {
    this.inputNumber("gravity", value);
  }

  private get settingsLockDelayTime(): number {
    return this.settings.lockDelayTime;
  }

  private set settingsLockDelayTime(value: number) {
    this.inputNumber("lockDelayTime", value);
  }

  private get settingsAreTime(): number {
    return this.settings.areTime;
  }

  private set settingsAreTime(value: number) {
    this.inputNumber("areTime", value);
  }

  private get settingsLineClearTime(): number {
    return this.settings.lineClearTime;
  }

  private set settingsLineClearTime(value: number) {
    this.inputNumber("lineClearTime", value);
  }

  private get settingsDasTime(): number {
    return this.settings.dasTime;
  }

  private set settingsDasTime(value: number) {
    this.inputNumber("dasTime", value);
  }

  private setControllerKey(key: string) {
    let keyboardKey = "please press key";
    this.inputControllerKey(key, keyboardKey);
    this.getKeyboardKey((keyboardKey: string) => {
      this.inputControllerKey(key, keyboardKey);
    });
  }

  private getKeyboardKey(callback: Function): void {
    const waitKeyEvent = e => {
      e.preventDefault();
      callback(e.key);
      document.removeEventListener("keydown", waitKeyEvent);
    };
    document.addEventListener("keydown", waitKeyEvent);
  }

  doGameStart() {
    this.gameStart(this.settings);
    this.started = true;
  }
}
</script>
