import * as action from "./index";

vi.mock("i18next", () => ({
  default: {
    t: (key) => {
      const translations = {
        "action:continueCurrentLevel": "结束选项继续本层级内容",
        "action:jumpToAnotherModuleAndEnd": "跳转至其他模块并结束本内容模块",
        "action:jumpToAnotherModuleAndContinue": "跳转至其他模块并继续本层级内容",
      };
      return translations[key];
    },
  },
}));

it("should action type is ACTIVE_COMPONENT", () => {
  expect(action.activeComponent("Tom")).toStrictEqual({
    type: "ACTIVE_COMPONENT",
    payload: "Tom",
  });
});

it("should action type is MODULE_FINISH_ACTION_OPTIONS and format modules", () => {
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
  expect(action.moduleFinishActionOptions({ content })).toStrictEqual({
    type: "MODULE_FINISH_ACTION_OPTIONS",
    payload: [
      {
        label: "结束选项继续本层级内容",
        value: "Continue",
      },
      {
        label: "跳转至其他模块并结束本内容模块",
        value: "Redirect_End",
        children: modules,
      },
      {
        label: "跳转至其他模块并继续本层级内容",
        value: "Redirect_Continue",
        children: modules,
      },
    ],
  });
});
