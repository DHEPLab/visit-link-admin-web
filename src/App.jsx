import React, { useEffect, useCallback, useContext } from "react";
import Axios from "./axiosConfig";
import isPropValid from "@emotion/is-prop-valid";
import styled, { StyleSheetManager } from "styled-components";

import { ConfigProvider, theme } from "antd";
import { QueryParamProvider } from "use-query-params";
import "./dayjsInit";

import { I18nextProvider, useTranslation } from "react-i18next";

import Rooter from "./Router";
import { Role } from "./constants/enums";
import { Header, Menu, Message } from "./components";
import { BrowserRouter, useHistory, Route } from "react-router-dom";
import { applyToken, getToken, clearToken } from "./utils/token";

import { Provider, useSelector } from "react-redux";
import { apiAccountProfile } from "./actions";

import store from "./store";
import "./config";
import i18n from "./i18n";
import { componentConfig, visitLinkTheme } from "./theme";

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
              <BrowserRouter>
                <QueryParamProvider ReactRouterRoute={Route}>
                  <AppContent />
                </QueryParamProvider>
              </BrowserRouter>
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

function AppContent() {
  const history = useHistory();
  const { user } = useSelector((state) => state.users);
  const { t } = useTranslation("app");

  const loadProfile = useCallback(() => {
    Axios.get("/api/account/profile")
      .then((r) => store.dispatch(apiAccountProfile(r)))
      .catch(() => history.push("/sign_in"));
  }, [history]);

  useEffect(loadProfile, [loadProfile]);

  function handleLogout() {
    clearToken();
    history.push("/sign_in");
    Message.success(t("logoutSuccess"), t("logoutMessage"));
  }

  return (
    <>
      <Header username={user.realName} role={Role[user.role]} onNavigate={history.push} onLogout={handleLogout} />
      <RouteContainer>
        <Menu />
        <Rooter />
      </RouteContainer>
    </>
  );
}

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 1100px;
  height: 100vh;
  flex-direction: column;
`;

const RouteContainer = styled.div`
  display: flex;
  flex: 1;
`;
