import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Form, FormProps, Input } from "antd";
import { useTranslation } from "react-i18next";

import Rules from "@/constants/rules";
import useBoolState from "@/hooks/useBoolState";
import { Role } from "@/constants/enums";
import { clearToken } from "@/utils/token";
import Card from "@/components/Card";
import StaticField from "@/components/StaticField";
import ModalForm from "@/components/ModalForm";
import Message from "@/components/Message";
import { useUserStore } from "@/store/user";
import ShadeButton from "@/components/ShadeButton";

interface EditProfileFormValues {
  realName: string;
  phone: string;
}

interface ResetPasswordFormValues {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export default function Profiles() {
  const { t } = useTranslation(["myAccount", "common"]);
  const navigate = useNavigate();
  const [visible, openPasswordModal, closePasswordModal] = useBoolState(false);
  const [visibleProfile, openProfileModal, closeProfileModal] = useBoolState(false);

  const { user, loadProfileSuccess } = useUserStore((state) => ({
    user: state.user,
    loadProfileSuccess: state.loadProfileSuccess,
  }));

  async function handleChangeProfile(values: EditProfileFormValues) {
    await axios.put("/api/account/profile", values);
    const res = await axios.get("/api/account/profile");
    loadProfileSuccess(res.data);
    closeProfileModal();
  }

  async function handleChangePassword(values: ResetPasswordFormValues) {
    await axios.put("/api/account/password", values);
    Message.success(t("passwordChangedTip"), t("reLoginTip"), 1);
    clearToken();
    navigate("/sign_in");
  }

  return (
    <>
      <ContentHeaderView>{t("myAccount")}</ContentHeaderView>

      <Card title={t("generalInformation")} extra={<ShadeButton onClick={openProfileModal}>{t("edit")}</ShadeButton>}>
        <StaticField label={t("name")}>{user.realName}</StaticField>
        <StaticField label={t("phoneNumber")}>{user.phone}</StaticField>
        <StaticField label={t("permissions")}>{Role[user.role as keyof typeof Role]}</StaticField>
      </Card>

      <Card
        title={t("accountInformation")}
        extra={<ShadeButton onClick={openPasswordModal}>{t("resetPassword")}</ShadeButton>}
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
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
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
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
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
