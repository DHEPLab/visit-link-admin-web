import React, { useEffect, useCallback } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import zhCN from 'antd/es/locale/zh_CN';
import { message, ConfigProvider } from 'antd';

import RouteView from './Router';
import { Role } from './constants/enums';
import { Header, Menu } from './components/*';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { applyToken, getToken, clearToken } from './utils/token';

import rootReducer from './reducers';
import { createStore } from 'redux';
import { Provider, useSelector } from 'react-redux';
import { loadProfileSuccess, httpRequestStart, httpRequestEnd } from './actions';

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default function () {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <AppContainer>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppContainer>
      </Provider>
    </ConfigProvider>
  );
}

function App() {
  const history = useHistory();
  const { user } = useSelector((state) => state.users);

  const loadProfile = useCallback(() => {
    Axios.get('/api/account/profile')
      .then((r) => store.dispatch(loadProfileSuccess(r)))
      .catch((_) => history.push('/sign_in'));
  }, [history]);

  useEffect(loadProfile, [loadProfile]);

  function handleLogout() {
    clearToken();
    history.push('/sign_in');
  }

  return (
    <>
      <Header
        username={user.realName}
        role={Role[user.role]}
        onNavigate={history.push}
        onLogout={handleLogout}
      />
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
  min-width: 1300px;
  height: 100vh;
  flex-direction: column;
`;

const RouteContainer = styled.div`
  display: flex;
  flex: 1;
`;

applyToken(getToken());

Axios.interceptors.request.use((config) => {
  store.dispatch(httpRequestStart(config));
  return config;
});

Axios.interceptors.response.use(
  (response) => {
    store.dispatch(httpRequestEnd(response.config));
    return response;
  },
  (error) => {
    const { response } = error;
    if (!response) return Promise.reject(error);
    store.dispatch(httpRequestEnd(response.config));

    let msg = '服务异常，请稍后重试';
    switch (response.status) {
      case 502:
        msg = '网络异常，请稍后重试';
        break;
      case 500:
        break;
      case 401:
        return Promise.reject(error);
      default:
        const { data } = response;
        if (data.violations) {
          msg = data.violations.map((e) => `${e.field} ${e.message}`).join(', ');
        } else if (data.message) {
          msg = data.message;
        }
    }
    message.error(msg);
    return Promise.reject(error);
  }
);
