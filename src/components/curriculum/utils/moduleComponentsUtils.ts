import { ModuleComponentType } from "@/models/res/Moduel";
import { ArrayHelpers } from "formik/dist/FieldArray";

type SetFocus = (focus: number) => void;

export function handleMoveUp(
  fieldArrayHelper: ArrayHelpers<ModuleComponentType[]>,
  index: number,
  focus?: number,
  setFocus?: SetFocus,
): void {
  if (index === 0) return;
  fieldArrayHelper.move(index, index - 1);
  if (focus === index) {
    setFocus?.(index - 1);
  }
}

export function handleMoveDown(
  fieldArrayHelper: ArrayHelpers<ModuleComponentType[]>,
  index: number,
  focus: number | null,
  setFocus: SetFocus | null,
  componentSize: number,
): void {
  if (index === componentSize - 1) return;
  fieldArrayHelper.move(index, index + 1);
  if (focus === index) {
    setFocus?.(index + 1);
  }
}

export function handleRemove(
  fieldArrayHelper: ArrayHelpers<ModuleComponentType[]>,
  index: number,
  focus: number,
  setFocus: SetFocus,
): void {
  fieldArrayHelper.remove(index);
  if (focus === index) {
    setFocus(-1);
  } else if (focus > index) {
    setFocus(focus - 1);
  }
}

export function insertComponent(
  fieldArrayHelper: ArrayHelpers<ModuleComponentType[]>,
  component: ModuleComponentType,
  focus: number,
  setFocus: SetFocus,
): void {
  if (focus === -1) {
    fieldArrayHelper.push(component);
  } else {
    fieldArrayHelper.insert(focus + 1, component);
    setFocus(focus + 1);
  }
}
