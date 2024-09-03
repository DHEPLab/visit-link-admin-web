import React from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

import Rules from "../constants/rules";
import { useBoolState } from "../utils";
import { Role } from "../constants/enums";
import { clearToken } from "../utils/token";
import Card from "@/components/Card";
import StaticField from "@/components/StaticField";
import ModalForm from "@/components/ModalForm";
import Message from "@/components/Message";
import { useUserStore } from "@/store/user";

export default function Profiles() {
  const { t } = useTranslation(["myAccount", "common"]);
  const navigate = useNavigate();
  const [visible, openPasswordModal, closePasswordModal] = useBoolState(false);
  const [visibleProfile, openProfileModal, closeProfileModal] = useBoolState(false);

  const { user, loadProfileSuccess } = useUserStore((state) => ({
    user: state.user,
    loadProfileSuccess: state.loadProfileSuccess,
  }));

  async function handleChangeProfile(values) {
    await axios.put("/api/account/profile", values);
    const res = await axios.get("/api/account/profile");
    loadProfileSuccess(res.data);
    closeProfileModal();
  }

  async function handleChangePassword(values) {
    await axios.put("/api/account/password", values);
    Message.success(t("passwordChangedTip"), t("reLoginTip"), 1);
    clearToken();
    navigate("/sign_in");
  }

  return (
    <>
      <ContentHeader title={t("myAccount")} />

      <Card
        title={t("generalInformation")}
        extra={
          <Button type="shade" onClick={openProfileModal}>
            {t("edit")}
          </Button>
        }
      >
        <StaticField label={t("name")}>{user.realName}</StaticField>
        <StaticField label={t("phoneNumber")}>{user.phone}</StaticField>
        <StaticField label={t("permissions")}>{Role[user.role]}</StaticField>
      </Card>

      <Card
        title={t("accountInformation")}
        extra={
          <Button type="shade" onClick={openPasswordModal}>
            {t("resetPassword")}
          </Button>
        }
      >
        <StaticField label={t("username")}>{user.username}</StaticField>
        <StaticField label={t("password")}>******</StaticField>
      </Card>

      <ModalForm
        title={t("editGeneralInformation")}
        visible={visibleProfile}
        initialValues={user}
        onFinish={handleChangeProfile}
        onCancel={closeProfileModal}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
      >
        <Form.Item label={t("name")} name="realName" rules={Rules.RealName}>
          <Input />
        </Form.Item>
        <Form.Item label={t("phoneNumber")} name="phone" rules={Rules.Phone}>
          <Input />
        </Form.Item>
      </ModalForm>
      <ModalForm
        width={650}
        title={t("resetPassword")}
        visible={visible}
        onFinish={handleChangePassword}
        onCancel={closePasswordModal}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
      >
        <Form.Item label={t("oldPassword")} name="oldPassword" rules={Rules.Required}>
          <Input.Password></Input.Password>
        </Form.Item>
        <Form.Item label={t("newPassword")} name="password" rules={Rules.Password}>
          <Input.Password></Input.Password>
        </Form.Item>
        <Form.Item
          label={t("confirmPassword")}
          name="confirmPassword"
          rules={[
            ...Rules.Required,
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t("passwordNotMatch"));
              },
            }),
          ]}
        >
          <Input.Password></Input.Password>
        </Form.Item>
      </ModalForm>
    </>
  );
}

function ContentHeader({ title }) {
  return <ContentHeaderView>{title}</ContentHeaderView>;
}

const ContentHeaderView = styled.div`
  height: 76px;
  line-height: 76px;
  background: #fff;
  color: #ff794f;
  font-size: 24px;
  font-weight: bold;
  padding-left: 40px;
  margin-bottom: 20px;
`;
