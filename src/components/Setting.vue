<template>
  <div>
    <p>
      <label>gravity:</label>
      <input v-model.number="settingsGravity" type="number" />
      <label>{{ Math.round((settingsGravity / 65536) * 100) / 100 }} G</label>
    </p>

    <p>
      <label>lock delay time:</label>
      <input v-model.number="settingsLockDelayTime" type="number" />
      <label>frame(s)</label>
    </p>

    <p>
      <label>ARE time:</label>
      <input v-model.number="settingsAreTime" type="number" />
      <label>frame(s)</label>
    </p>

    <p>
      <label>line clear time:</label>
      <input v-model.number="settingsLineClearTime" type="number" />
      <label>frame(s)</label>
    </p>

    <button @click="doGameStart" v-if="!started">game start</button>
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
  public input(key: string, value: any) {
    this.settings[key] = value;
  }

  private get settingsGravity(): number {
    return this.settings.gravity;
  }

  private set settingsGravity(value: number) {
    this.input("gravity", value);
  }

  private get settingsLockDelayTime(): number {
    return this.settings.lockDelayTime;
  }

  private set settingsLockDelayTime(value: number) {
    this.input("lockDelayTime", value);
  }

  private get settingsAreTime(): number {
    return this.settings.lockDelayTime;
  }

  private set settingsAreTime(value: number) {
    this.input("areTime", value);
  }

  private get settingsLineClearTime(): number {
    return this.settings.lineClearTime;
  }

  private set settingsLineClearTime(value: number) {
    this.input("lineClearTime", value);
  }

  doGameStart() {
    this.gameStart(this.settings);
    this.started = true;
  }
}
</script>
