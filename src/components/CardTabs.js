import React from 'react';
import styled from 'styled-components';
import { Tabs } from 'antd';

export default function ({ children, ...props }) {
  return (
    <CardTabs type="card" {...props}>
      {children}
    </CardTabs>
  );
}

const CardTabs = styled(Tabs)`
  > .ant-tabs-nav .ant-tabs-nav-wrap {
    background: #ff9472;
    padding-top: 24px;
    padding-left: 30px;
  }

  &.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type),
  &.ant-tabs-bottom > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type),
  &.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type),
  &.ant-tabs-bottom > div > .ant-tabs-nav .ant-tabs-tab:not(:last-of-type) {
    margin-right: 15px;
  }

  > .ant-tabs-nav .ant-tabs-tab {
    width: 140px;
    justify-content: center;
    background: none;
    border-bottom: none;
    color: #fff;

    &:hover {
      opacity: 0.7;
    }
  }

  .ant-tabs-tab-btn:focus {
    color: inherit;
  }

  > .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active {
    background: none;
    color: #ff9472;
    background: #fff;
    &:hover {
      opacity: 1;
    }
  }

  > .ant-tabs-nav {
    margin: 0;
  }
`;
