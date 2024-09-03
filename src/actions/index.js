import i18n from "i18next";
export function activeComponent(name) {
  return {
    type: "ACTIVE_COMPONENT",
    payload: name,
  };
}

export function moduleFinishActionOptions(data) {
  const modules = data.content.map((module) => ({
    label: `${module.number} ${module.name}`,
    value: module.id,
  }));

  return {
    type: "MODULE_FINISH_ACTION_OPTIONS",
    payload: [
      {
        label: i18n.t("action:continueCurrentLevel"),
        value: "Continue",
      },
      {
        label: i18n.t("action:jumpToAnotherModuleAndEnd"),
        value: "Redirect_End",
        children: modules,
      },
      {
        label: i18n.t("action:jumpToAnotherModuleAndContinue"),
        value: "Redirect_Continue",
        children: modules,
      },
    ],
  };
}
