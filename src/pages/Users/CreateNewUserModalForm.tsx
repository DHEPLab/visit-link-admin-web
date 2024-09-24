import { Form, FormProps, Input, Radio } from "antd";
import Rules from "@/constants/rules";
import { Role } from "@/constants/enums";
import AreaInput from "@/components/AreaInput";
import ModalForm from "@/components/ModalForm";
import React from "react";
import { useTranslation } from "react-i18next";

export interface CreateNewUserFormValues {
  role: string;
  realName: string;
  phone: string;
  chw?: {
    identity: string;
    tags: string[];
  };
  username: string;
  password: string;
}

type CreateNewUserModalFormProps = {
  visible: boolean;
  loginUserRole?: string;
  onCancel: VoidFunction;
  onFinish: (values: CreateNewUserFormValues) => void;
};

const formInitialValues: CreateNewUserFormValues = {
  role: "ROLE_CHW",
  realName: "",
  phone: "",
  username: "",
  password: "",
};

const CreateNewUserModalForm: React.FC<CreateNewUserModalFormProps> = (props) => {
  const { visible, onCancel, loginUserRole, onFinish } = props;
  const { t } = useTranslation(["users", "common", "user"]);
  const isAdmin = loginUserRole === "ROLE_ADMIN";

  return (
    <ModalForm
      title={t("createNewUser")}
      visible={visible}
      onCancel={onCancel}
      onFinish={onFinish}
      initialValues={formInitialValues}
      validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
    >
      <h3>{t("generalInformation")}</h3>
      <Form.Item label={t("permissions")} name="role" rules={Rules.Required}>
        <Radio.Group>
          {Object.keys(Role)
            .filter((key) => {
              if (key === "ROLE_SUPER_ADMIN") return false;
              if (isAdmin) return true;
              return key === "ROLE_CHW";
            })
            .map((key) => (
              <Radio key={key} value={key}>
                {Role[key as keyof typeof Role]}
              </Radio>
            ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label={t("name")} name="realName" rules={Rules.RealName}>
        <Input autoFocus />
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(old, curr) => old.role !== curr.role}>
        {({ getFieldValue }) => (
          <>
            {getFieldValue("role") === "ROLE_CHW" && (
              <>
                <Form.Item label={t("chwID")} name={["chw", "identity"]} rules={Rules.Required}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["chw", "tags"]}
                  tooltip={t("maxArea", { ns: "user" })}
                  rules={Rules.Area}
                  label={t("area")}
                >
                  <AreaInput maxCount={3} />
                </Form.Item>
              </>
            )}
          </>
        )}
      </Form.Item>
      <Form.Item label={t("phone")} name="phone" rules={Rules.Phone}>
        <Input />
      </Form.Item>
      <h3>{t("accountInformation")}</h3>
      <Form.Item label={t("username")} name="username" rules={Rules.Required}>
        <Input />
      </Form.Item>
      <Form.Item label={t("password")} name="password" rules={Rules.Password}>
        <Input.Password />
      </Form.Item>
    </ModalForm>
  );
};

export default CreateNewUserModalForm;
