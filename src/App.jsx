import React, { useContext } from "react";
import isPropValid from "@emotion/is-prop-valid";
import styled, { StyleSheetManager } from "styled-components";

import { ConfigProvider, theme } from "antd";
import "./dayjsInit";

import { I18nextProvider } from "react-i18next";
import { applyToken, getToken } from "./utils/token";

import { Provider } from "react-redux";

import store from "./store";
import "./config";
import i18n from "./i18n";
import { componentConfig, visitLinkTheme } from "./theme";
import { RouterProvider } from "react-router-dom";
import router from "./Router";

applyToken(getToken());

export default function App() {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const component = componentConfig(rootPrefixCls);
  const themeToken = theme.useToken();

  return (
    <I18nextProvider i18n={i18n}>
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <ConfigProvider
          locale={i18n.t("local", { ns: "antd", returnObjects: true })}
          theme={visitLinkTheme(themeToken.token)}
          {...component}
        >
          <Provider store={store}>
            <AppContainer>
              <RouterProvider router={router} />
            </AppContainer>
          </Provider>
        </ConfigProvider>
      </StyleSheetManager>
    </I18nextProvider>
  );
}

function shouldForwardProp(propName, target) {
  if (typeof target === "string") {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
}

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 1100px;
  height: 100vh;
  flex-direction: column;
`;
