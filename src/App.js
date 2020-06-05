import React from 'react';
import axios from 'axios';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { BrowserRouter } from 'react-router-dom';
import { applyToken, getToken } from './utils/token';
import { message } from 'antd';
import Router from './router';

import Menu from './components/Menu';
import styled from 'styled-components';

export default function () {
  return (
    <div className="App">
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <FlexLayout>
            <Menu />
            <RouteView>
              <Router />
            </RouteView>
          </FlexLayout>
        </BrowserRouter>
      </ConfigProvider>
    </div>
  );
}

const FlexLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 1200px;
  margin: 0 auto;
`;

const RouteView = styled.div`
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
