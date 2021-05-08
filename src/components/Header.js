import React, { useState } from "react";
import axios from 'axios';
import { saveAs } from 'file-saver';
import styled from "styled-components";
import { Button, DatePicker, Form, Select } from "antd";
import { useBoolState } from "../utils";

import { DownloadOutlined } from '@ant-design/icons';
import { Iconfont, ModalForm } from "../components/*";
import Rules from "../constants/rules";
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ({ username, role, onNavigate, onLogout }) {
  const [visibleExport, openExportModal, closeExportModal] = useBoolState(false)
  const [exportType, setExportType] = useState('visit');

  async function handleSaveExport(values) {
    switch (exportType) {
      case 'visit':
        const params = `startDay=${values?.range[0].format('YYYY-MM-DD')}&endDay=${values?.range[1].format('YYYY-MM-DD')}`
        download(`/admin/report?${params}`, 'visit')
        break;
      case 'visit2':
        download('/api/visits/notStartVisit', 'not finished visit')
        break;
      case 'chw':
        download('/admin/report/chwReport', 'chw')
        break;
      case 'baby':
        download('/admin/report/babyRosterReport', 'baby')
        break;
      default:
        break;
    }
    closeExportModal()
  }

  async function download (requestUrl, filename) {
    const response = await axios.get(`${requestUrl}`, {
      responseType: 'blob',
      headers: { 'x-mask-request': true }
    })
    saveAs(new Blob([response.data]), `${filename}.xlsx`)
  }

  return (
    <Header>
      <Logo>
        <img src={require("../assets/logo.png")} alt="Logo" />
      </Logo>
      <Content>
        <Welcome>
          <b>{username}</b>
          <Role>{role}</Role>
        </Welcome>
        {role === '管理员' && <StyledButton type="link" onClick={openExportModal}>
          <DownloadOutlined />数据导出 &nbsp;&nbsp;
        </StyledButton>}
        <StyledButton type="link" onClick={() => onNavigate("/profiles")}>
          个人中心
        </StyledButton>
        <SplitLine />
        <StyledButton type="link" onClick={() => onLogout()}>
          退出
          <Iconfont type="iconescape" />
        </StyledButton>
      </Content>
      <ModalForm
        title="导出数据"
        visible={visibleExport}
        initialValues={{range: []}}
        onFinish={handleSaveExport}
        onCancel={closeExportModal}
      >
        <Form.Item label="数据类别" rules={Rules.Required}>
          <Select value={exportType} onChange={key => setExportType(key)}>
            <Option value="visit">完成家访(已完成、已过期)</Option>
            <Option value="visit2">未完成家访(待开始、未完成、已取消)</Option>
            <Option value="chw">chw</Option>
            <Option value="baby">宝宝</Option>
          </Select>
        </Form.Item>
        {exportType === 'visit' &&
          <Form.Item label="时间范围" name="range" rules={Rules.Required}>
            <RangePicker />
          </Form.Item>}
      </ModalForm>
    </Header>
  );
}

const SplitLine = styled.div`
  width: 1px;
  height: 20px;
  background: #d0d0d0;
  margin: 0 20px;
`;

const Role = styled.span`
  margin-left: 14px;
  color: #8e8e93;
  font-weight: 400;
`;

const Welcome = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-right: 30px;
  color: #9b9b9b;
  b {
    color: #001831;
  }
`;

const StyledButton = styled(Button)`
  font-weight: bold;
  font-size: 16px;
  padding: 0;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  padding-right: 30px;
`;

const Header = styled.header`
  height: 80px;
  width: 100%;
  background-color: white;
  display: flex;
  border-bottom: 2px solid #ff9472;
`;

const Logo = styled.div`
  width: 270px;
  height: 100%;
  display: flex;
  align-items: center;

  img {
    height: 50px;
    margin-left: 40px;
  }
`;
