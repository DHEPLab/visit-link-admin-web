import { vi } from "vitest";
import { handleMoveDown, handleMoveUp, handleRemove } from "./moduleComponentsUtils";
import { ArrayHelpers } from "formik/dist/FieldArray";

describe("Module Component Field Array Helpers", () => {
  const helpers: ArrayHelpers = { move: vi.fn(), remove: vi.fn() } as unknown as ArrayHelpers;
  const setFocus: (index: number) => void = vi.fn();

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should component move up", () => {
    handleMoveUp(helpers, 1, -1, setFocus);
    expect(helpers.move).toBeCalledWith(1, 0);
    handleMoveUp(helpers, 1, 1, setFocus);
    expect(helpers.move).toBeCalledWith(1, 0);
    expect(setFocus).toBeCalledWith(0);
  });

  it("should component move down", () => {
    handleMoveDown(helpers, 1, -1, setFocus, 3);
    expect(helpers.move).toBeCalledWith(1, 2);
    handleMoveDown(helpers, 1, 1, setFocus, 3);
    expect(helpers.move).toBeCalledWith(1, 2);
    expect(setFocus).toBeCalledWith(2);
  });

  it("should do nothing", () => {
    handleMoveUp(helpers, 0);
    handleMoveDown(helpers, 0, null, null, 1);
    expect(helpers.move).toBeCalledTimes(0);
  });

  it("should remove component", () => {
    handleRemove(helpers, 1, 1, setFocus);
    expect(helpers.remove).toBeCalledWith(1);
    expect(setFocus).toBeCalledWith(-1);

    handleRemove(helpers, 2, 4, setFocus);
    expect(setFocus).toBeCalledWith(3);
  });
});
