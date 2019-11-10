import HoldAction from "../actions/HoldAction";
import HoldStore from "../stores/HoldStore";
import { Context } from "material-flux";

export default class HoldContext extends Context {
  public holdAction: HoldAction;
  public holdStore: HoldStore;
  public constructor() {
    super();
    this.holdAction = new HoldAction(this);
    this.holdStore = new HoldStore(this);
  }
}
