import React from 'react';
import axios from 'axios';
import { ConfigProvider } from 'antd';

import zhCN from 'antd/es/locale/zh_CN';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { applyToken, getToken, clearToken } from './utils/token';
import { message } from 'antd';
import RouteView from './Router';

import { Header, Menu } from './components/*';
import styled from 'styled-components';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';

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
  function handleLogout() {
    clearToken();
    history.push('/login');
  }

  return (
    <>
      <Header
        username="张三李四李四张三名字"
        onNavigate={(path) => history.push(path)}
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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (!response) {
      message.error('Network error, please try again later!');
      return Promise.reject(error);
    }
    response.data.detail && message.error(response.data.detail);
    return Promise.reject(error);
  }
);
