<template>
  <div>
    <label for="settingsGravity">gravity: </label>
    <input v-model.number="settingsGravity" type="number" />
    <label>{{ Math.round((settingsGravity / 65536) * 100) / 100 }} G</label>

    <button @click="updateSettings">update settings</button>
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

  @Emit()
  public input(key: string, value: number) {
    this.settings[key] = value;
  }

  private get settingsGravity(): number {
    return this.settings.gravity;
  }

  private set settingsGravity(value: number) {
    this.input("gravity", value);
  }

  updateSettings() {
    this.gameStart(this.settings);
  }
}
</script>
