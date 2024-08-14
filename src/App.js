import React, { useEffect, useCallback } from "react";
import Axios from "axios";
import styled from "styled-components";

import { ConfigProvider } from "antd";
import { QueryParamProvider } from "use-query-params";
import "moment/locale/zh-cn";
import { I18nextProvider, useTranslation } from "react-i18next";


import RouteView from "./Router";
import { Role } from "./constants/enums";
import { Header, Menu, Message } from "./components/*";
import { BrowserRouter, useHistory, Route } from "react-router-dom";
import { applyToken, getToken, clearToken } from "./utils/token";

import { Provider, useSelector } from "react-redux";
import { apiAccountProfile } from "./actions";

import store from "./store";
import "./config";
import i18n from './i18n';

applyToken(getToken());

export default function () {
  return (
    <I18nextProvider i18n={i18n}>
      <ConfigProvider locale={i18n.t('local', { ns: 'antd', returnObjects: true })}>
        <Provider store={store}>
          <AppContainer>
            <BrowserRouter>
              <QueryParamProvider ReactRouterRoute={Route}>
                <App />
              </QueryParamProvider>
            </BrowserRouter>
          </AppContainer>
        </Provider>
      </ConfigProvider>
    </I18nextProvider>
  );
}

function App() {
  const history = useHistory();
  const { user } = useSelector((state) => state.users);
  const { t } = useTranslation('app');

  const loadProfile = useCallback(() => {
    Axios.get("/api/account/profile")
      .then((r) => store.dispatch(apiAccountProfile(r)))
      .catch((_) => history.push("/sign_in"));
  }, [history]);

  useEffect(loadProfile, [loadProfile]);

  function handleLogout() {
    clearToken();
    history.push("/sign_in");
    Message.success(t('logoutSuccess'), t('logoutMessage'));
  }
  return (
    <>
      <Header username={user.realName} role={Role[user.role]} onNavigate={history.push} onLogout={handleLogout} />
      <RouteContainer>
        <Menu />
        <RouteView></RouteView>
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
