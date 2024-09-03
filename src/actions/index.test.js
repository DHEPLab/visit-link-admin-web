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
