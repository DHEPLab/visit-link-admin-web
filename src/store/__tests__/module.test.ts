import { useModuleStore } from "../module";

describe("Module store", () => {
  const { moduleFinishActionOptions } = useModuleStore.getState();

  it("should initialize with default state", () => {
    const state = useModuleStore.getState();
    expect(state.options).toEqual([]);
  });

  it("should correctly handle moduleFinishActionOptions", () => {
    const content = [
      {
        id: 1,
        number: 1,
        name: "A",
      },
      {
        id: 2,
        number: 2,
        name: "B",
      },
    ];
    const modules = [
      {
        label: "1 A",
        value: 1,
      },
      {
        label: "2 B",
        value: 2,
      },
    ];

    moduleFinishActionOptions({ content });
    const state = useModuleStore.getState();
    expect(state.options).toStrictEqual([
      {
        label: "Continue with the current level's content",
        value: "Continue",
      },
      {
        label: "Jump to another module and end the current module",
        value: "Redirect_End",
        children: modules,
      },
      {
        label: "Jump to another module and return to continue with the current level's content",
        value: "Redirect_Continue",
        children: modules,
      },
    ]);
  });
});
