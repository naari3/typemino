import FieldAction from "../actions/FieldAction";
import FieldStore from "../stores/FieldStore";
import { Context } from "material-flux";

export default class Field extends Context {
  public fieldAction: FieldAction;
  public fieldStore: FieldStore;
  public constructor() {
    super();
    this.fieldAction = new FieldAction(this);
    this.fieldStore = new FieldStore(this);
  }
}
