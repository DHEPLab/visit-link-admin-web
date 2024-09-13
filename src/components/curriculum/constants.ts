import Media from "./Media";
import PageFooter from "./PageFooter";
import Switch from "./Switch";
import Text from "./Text";
import React from "react";

export const ModuleComponentMap: { [key: string]: React.ElementType } = {
  Text: Text,
  Media: Media,
  Switch: Switch,
  PageFooter: PageFooter,
};
