import AreaInput from "@/components/AreaInput";
import axios from "axios";
import { useState } from "react";
import { Button, Form, FormProps, Input, Space, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Rules from "@/constants/rules";
import useBoolState from "@/hooks/useBoolState";
import useFetch from "@/hooks/useFetch";
import { Role } from "@/constants/enums";
import Card from "@/components/Card";
import ModalForm from "@/components/ModalForm";
import StaticField from "@/components/StaticField";
import DetailHeader from "@/components/DetailHeader";
import CloseSupervisorAccountModal from "./CloseSupervisorAccountModal";
import CloseChwAccountModal from "./CloseChwAccountModal";
import ChangePasswordModal from "./ChangePasswordModal";
import AssignBaby from "./AssignBaby";
import AssignChw from "./AssignChw";
import { User as UserModel } from "@/models/res/User";
import ShadeButton from "@/components/ShadeButton";
import { UpdateUserRequest } from "@/models/req/User";

export default function User() {
  const { t } = useTranslation(["user", "common"]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, refresh] = useFetch<UserModel>(`/admin/users/${id}`);
  const [isBabiesEmpty, setIsBabiesEmpty] = useState(true);

  const [changePasswordVisible, openChangePassword, closeChangePassword] = useBoolState();
  const [changeProfileVisible, openChangeProfile, closeChangeProfile] = useBoolState();
  const [closeChwAccountVisible, openCloseChwAccount, closeCloseChwAccount] = useBoolState();
  const [closeSupervisorAccountVisible, openCloseSupervisorAccount, closeCloseSupervisorAccount] = useBoolState();

  const roleChw = user?.role === "ROLE_CHW"; // TODO: CHW can login admin portal?
  const roleSupervisor = user?.role === "ROLE_SUPERVISOR";

  function handleChangeProfile(values: UpdateUserRequest) {
    axios.put(`/admin/users/${id}`, values).then(() => {
      refresh();
      closeChangeProfile();
    });
  }

  function role() {
    if (roleChw) {
      return `${Role[user.role]} ID ${user.chw?.identity}`;
    }
    return Role[user.role];
  }

  function handleCloseChwAccount(data: { userId: number }) {
    axios.delete(`/admin/users/chw/${id}`, { data }).then(() => navigate(-1));
  }

  function handleCloseSupervisorAccount() {
    axios.delete(`/admin/users/supervisor/${id}`).then(() => navigate(-1));
  }

  return (
    <>
      <DetailHeader
        icon="iconuser-primary"
        menu={t("accountManagement")}
        title={user.realName}
        role={role()}
        extra={
          <>
            {roleChw && (
              <Button ghost danger onClick={openCloseChwAccount}>
                {t("deleteAccount")}
              </Button>
            )}
            {roleSupervisor && (
              <Button ghost danger onClick={openCloseSupervisorAccount}>
                {t("deleteAccount")}
              </Button>
            )}
          </>
        }
      />

      {roleChw && (
        <Card title={t("supervisor")}>
          <StaticField label={t("name")}>{user?.chw?.supervisor?.realName}</StaticField>
          <StaticField label={t("phone")}>{user?.chw?.supervisor?.phone}</StaticField>
        </Card>
      )}

      <Card title={t("generalInformation")} extra={<ShadeButton onClick={openChangeProfile}>{t("edit")}</ShadeButton>}>
        <StaticField label={t("name")}>{user.realName}</StaticField>
        <StaticField label={t("phone")}>{user.phone}</StaticField>
        {roleChw && (
          <StaticField label={t("area")}>
            <Space wrap>
              {user.chw?.tags && user.chw.tags.map((tag: string, index: number) => <Tag key={index}>{tag}</Tag>)}
            </Space>
          </StaticField>
        )}
      </Card>
      <Card
        title={t("accountInformation")}
        extra={<ShadeButton onClick={openChangePassword}>{t("resetPassword")}</ShadeButton>}
      >
        <StaticField label={t("username")}>{user.username}</StaticField>
        <StaticField label={t("password")}>******</StaticField>
      </Card>

      {roleSupervisor && <AssignChw id={id} />}
      {roleChw && <AssignBaby id={id} onChange={(babies) => setIsBabiesEmpty(babies?.length === 0)} />}

      <ChangePasswordModal id={id} visible={changePasswordVisible} onCancel={closeChangePassword} />
      <CloseChwAccountModal
        id={id}
        visible={closeChwAccountVisible}
        isBabiesEmpty={isBabiesEmpty}
        onCancel={closeCloseChwAccount}
        onFinish={handleCloseChwAccount}
      />
      <CloseSupervisorAccountModal
        visible={closeSupervisorAccountVisible}
        onCancel={closeCloseSupervisorAccount}
        onFinish={handleCloseSupervisorAccount}
      />

      <ModalForm
        title={t("editGeneralInformation")}
        initialValues={user}
        onFinish={handleChangeProfile}
        visible={changeProfileVisible}
        onCancel={closeChangeProfile}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
      >
        <Form.Item label={t("name")} name="realName" rules={Rules.RealName}>
          <Input />
        </Form.Item>
        <Form.Item label={t("phone")} name="phone" rules={Rules.Phone}>
          <Input />
        </Form.Item>
        {roleChw && (
          <>
            <Form.Item label={t("id")} name={["chw", "identity"]} rules={Rules.Required}>
              <Input />
            </Form.Item>
            <Form.Item label={t("area")} tooltip={t("maxArea")} name={["chw", "tags"]} rules={Rules.Area}>
              <AreaInput maxCount={3} />
            </Form.Item>
          </>
        )}
      </ModalForm>
    </>
  );
}
