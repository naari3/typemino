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

  doGameStart() {
    this.gameStart(this.settings);
    this.started = true;
  }
}
</script>
