import { create } from "zustand";
import i18n from "i18next";
import { middlewares } from "./middlewares";

interface ModuleState {
  options: {
    label: string;
    value: string;
    children?: {
      label: string;
      value: number;
    }[];
  }[];
  moduleFinishActionOptions: (data: {
    content: {
      id: number;
      number: number;
      name: string;
    }[];
  }) => void;
}

export const useModuleStore = create<ModuleState>()(
  middlewares(
    (set) => ({
      options: [],
      moduleFinishActionOptions: (data) =>
        set(() => {
          const modules = data.content.map((module) => ({
            label: `${module.number} ${module.name}`,
            value: module.id,
          }));

          return {
            options: [
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
        }),
    }),
    "moduleStore",
  ),
);
