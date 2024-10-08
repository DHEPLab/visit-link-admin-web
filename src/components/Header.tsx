import LanguageSelect from "@/components/LanguageSelect";
import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import styled from "styled-components";
import { Button, DatePicker, Form, Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import { DownloadOutlined } from "@ant-design/icons";

import Iconfont from "@/components/Iconfont";
import ModalForm from "@/components/ModalForm";
import Rules from "../constants/rules";
import useBoolState from "@/hooks/useBoolState";
import LogoImage from "../assets/logo.png";
import { useUserStore } from "@/store/user";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface HeaderProps {
  username: string;
  role: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

interface ExportFormValues {
  range: dayjs.Dayjs[];
}

const Header: React.FC<HeaderProps> = ({ username, role, onNavigate, onLogout }) => {
  const { t } = useTranslation(["header", "roles"]);
  const user = useUserStore((state) => state.user);
  const [visibleExport, openExportModal, closeExportModal] = useBoolState(false);
  const [exportType, setExportType] = useState("visit");

  async function handleSaveExport(values: ExportFormValues) {
    switch (exportType) {
      case "visit": {
        const params = `startDay=${values?.range[0].format("YYYY-MM-DD")}&endDay=${values?.range[1].format(
          "YYYY-MM-DD",
        )}`;
        download(`/admin/report?${params}`, "completed_visits");
        break;
      }
      case "visit2":
        download("/api/visits/notStartVisit", "incomplete_visits");
        break;
      case "chw":
        download("/admin/report/chwReport", "chw");
        break;
      case "baby":
        download("/admin/report/babyRosterReport", "baby");
        break;
      default:
        break;
    }
    closeExportModal();
  }

  async function download(requestUrl: string, filename: string) {
    const response = await axios.get(`${requestUrl}`, {
      responseType: "blob",
      headers: { "x-mask-request": true },
    });
    saveAs(new Blob([response.data]), `${filename}.xlsx`);
  }

  return (
    <HeaderContainer>
      <Logo>
        <img src={LogoImage} alt="Logo" />
      </Logo>
      <Content>
        <Welcome>
          <b>{username}</b>
          <Role>{t(`${role}`)}</Role>
          {!import.meta.env.PROD && <LanguageSelect />}
        </Welcome>
        {user?.role === "ROLE_ADMIN" && (
          <StyledButton type="link" onClick={openExportModal}>
            <DownloadOutlined /> {t("exportData")}
          </StyledButton>
        )}
        <SplitLine />
        <StyledButton type="link" onClick={() => onNavigate("/profiles")}>
          {t("myAccount")}
        </StyledButton>
        <SplitLine />
        <StyledButton type="link" onClick={() => onLogout()}>
          {t("logOut")}
          <Iconfont type="iconescape" />
        </StyledButton>
      </Content>
      <ModalForm
        title={t("exportData")}
        visible={visibleExport}
        initialValues={{ range: [] }}
        onFinish={handleSaveExport}
        onCancel={closeExportModal}
      >
        <Form.Item label={t("dataCategory")} rules={Rules.Required}>
          <Select value={exportType} onChange={(key) => setExportType(key)}>
            <Option value="visit">{t("completeVisits")}</Option>
            <Option value="visit2">{t("incompleteVisits")}</Option>
            <Option value="chw">{t("chw")}</Option>
            <Option value="baby">{t("baby")}</Option>
          </Select>
        </Form.Item>
        {exportType === "visit" && (
          <Form.Item label={t("timeRange")} name="range" rules={Rules.Required}>
            <RangePicker />
          </Form.Item>
        )}
      </ModalForm>
    </HeaderContainer>
  );
};

const SplitLine = styled.div`
  width: 1px;
  height: 20px;
  background: #d0d0d0;
  margin: 0 20px;
`;

const Role = styled.span`
  color: #8e8e93;
  font-weight: 400;
`;

const Welcome = styled(Space)`
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

const HeaderContainer = styled.header`
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

export default Header;
