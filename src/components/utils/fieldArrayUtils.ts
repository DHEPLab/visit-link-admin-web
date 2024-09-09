import { ArrayHelpers } from "formik/dist/FieldArray";
import { message } from "antd";

type SetFocus = (focus: number) => void;

export function handleMoveUp<T>(
  fieldArrayHelper: ArrayHelpers<T[]>,
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

export function handleMoveDown<T>(
  fieldArrayHelper: ArrayHelpers<T[]>,
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

export function handleRemove<T>(
  fieldArrayHelper: ArrayHelpers<T[]>,
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

export function insertComponent<T>(
  fieldArrayHelper: ArrayHelpers<T[]>,
  component: T,
  focus: number,
  setFocus: SetFocus,
  length?: number,
  warningText?: string,
): void {
  if (length && length > 20) {
    message.warning(warningText);
    return;
  }

  if (focus === -1) {
    fieldArrayHelper.push(component);
  } else {
    fieldArrayHelper.insert(focus + 1, component);
    setFocus(focus + 1);
  }
}
