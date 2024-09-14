import type { Locale } from "antd/lib/locale";
import { useContext } from "react";
import isPropValid from "@emotion/is-prop-valid";
import styled, { StyleSheetManager } from "styled-components";

import { ConfigProvider, theme } from "antd";
import "./dayjsInit";

import { I18nextProvider } from "react-i18next";
import { ShouldForwardProp } from "styled-components/dist/types";
import { applyToken, getToken } from "./utils/token";

import "./config";
import i18n from "./i18n";
import { componentConfig, visitLinkTheme } from "./theme";
import { RouterProvider } from "react-router-dom";
import router from "./Router";

applyToken(getToken());

const shouldForwardProp: ShouldForwardProp<"web"> = (propName, target) => {
  if (typeof target === "string") {
    return isPropValid(propName);
  }
  return true;
};

export default function App() {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const component = componentConfig(rootPrefixCls);
  const themeToken = theme.useToken();

  return (
    <I18nextProvider i18n={i18n}>
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <ConfigProvider
          locale={i18n.t("local", { ns: "antd", returnObjects: true }) as Locale}
          theme={visitLinkTheme(themeToken.token)}
          {...component}
        >
          <AppContainer>
            <RouterProvider router={router} />
          </AppContainer>
        </ConfigProvider>
      </StyleSheetManager>
    </I18nextProvider>
  );
}

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 1100px;
  height: 100vh;
  flex-direction: column;
`;
