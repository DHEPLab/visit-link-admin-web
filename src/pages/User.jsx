import axios from "axios";
import React, { useEffect, useState } from "react";
import { debounce } from "radash";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Rules from "../constants/rules";
import useBoolState from "@/hooks/useBoolState";
import { useFetch } from "../utils";
import { Gender, Role } from "../constants/enums";
import Card from "@/components/Card";
import ZebraTable from "@/components/ZebraTable";
import ModalForm from "@/components/ModalForm";
import StaticField from "@/components/StaticField";
import DetailHeader from "@/components/DetailHeader";
import AssignModalTable from "@/components/AssignModalTable";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import WithPage from "@/components/WithPage";
import ChwTagSelector from "@/components/ChwTagSelector";

export default function User() {
  const { t } = useTranslation(["user", "common"]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, refresh] = useFetch(`/admin/users/${id}`);
  const [isBabiesEmpty, setIsBabiesEmpty] = useState(true);

  const [changePasswordVisible, openChangePassword, closeChangePassword] = useBoolState();
  const [changeProfileVisible, openChangeProfile, closeChangeProfile] = useBoolState();
  const [closeChwAccountVisible, openCloseChwAccount, closeCloseChwAccount] = useBoolState();
  const [closeSupervisorAccountVisible, openCloseSupervisorAccount, closeCloseSupervisorAccount] = useBoolState();

  const roleChw = user?.role === "ROLE_CHW";
  const roleSupervisor = user?.role === "ROLE_SUPERVISOR";

  function handleChangeProfile(values) {
    axios.put(`/admin/users/${id}`, values).then(() => {
      refresh();
      closeChangeProfile();
    });
  }

  function role() {
    if (roleChw) {
      return `${Role[user.role]} ID ${user.chw.identity}`;
    }
    return Role[user.role];
  }

  function handleCloseChwAccount(data) {
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

      <Card
        title={t("generalInformation")}
        extra={
          <Button type="shade" onClick={openChangeProfile}>
            {t("edit")}
          </Button>
        }
      >
        <StaticField label={t("name")}>{user.realName}</StaticField>
        <StaticField label={t("phone")}>{user.phone}</StaticField>
        {roleChw && <StaticField label={t("area")}>{user.chw.tags && user.chw.tags.join(", ")}</StaticField>}
      </Card>
      <Card
        title={t("accountInformation")}
        extra={
          <Button type="shade" onClick={openChangePassword}>
            {t("resetPassword")}
          </Button>
        }
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
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
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
            <Form.Item label={t("area")} name={["chw", "tags"]} rules={Rules.Area}>
              <ChwTagSelector />
            </Form.Item>
          </>
        )}
      </ModalForm>
    </>
  );
}

function CloseSupervisorAccountModal({ visible, onCancel, onFinish }) {
  const { t } = useTranslation(["user", "common"]);
  return (
    <Modal
      title={t("deleteSuperviser")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      open={visible}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button danger type="primary" onClick={onFinish}>
            {t("delete")}
          </Button>
        </Space>
      }
    >
      <p>{t("deleteSuperviserMessage")}</p>
    </Modal>
  );
}

function CloseChwAccountModal({ id, visible, isBabiesEmpty, onCancel, onFinish }) {
  const { t } = useTranslation(["user", "common"]);
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const debounceSearch = debounce({ delay: 400 }, (search) => {
    axios
      .get("/admin/users/chw", {
        params: {
          search,
          size: 10,
        },
      })
      .then((response) => setOptions(response.data.content));
  });

  return (
    <Modal
      title={t("deleteChw")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      open={visible}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button danger type="primary" onClick={form.submit}>
            {t("delete")}
          </Button>
        </Space>
      }
    >
      <p>
        {t("generalDeleteMessage")}
        {!isBabiesEmpty && t("babyNotEmptyMessage")}
      </p>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 0 }}>
        {!isBabiesEmpty && (
          <Form.Item label={t("chw")} name="userId" rules={Rules.Required}>
            <Select
              showSearch
              filterOption={false}
              onFocus={() => debounceSearch()}
              onSearch={debounceSearch}
              style={{ width: "100%" }}
              placeholder={t("selectBabyPlaceholder")}
            >
              {options
                .filter((o) => o.user.id !== Number(id))
                .map((o) => (
                  <Select.Option key={o.user.id}>
                    {o.user.realName}/{o.user.chw.identity}/{(o.user.chw.tags || []).join(",")}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

function ChangePasswordModal({ id, onCancel, visible, ...props }) {
  const { t } = useTranslation(["user", "common"]);
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  function onFinish(values) {
    axios.put(`/admin/users/${id}/password`, values).then(onCancel);
  }

  return (
    <Modal
      title={t("confirmResetPassword")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("cancel", { ns: "common" })}
          </Button>
          <Button danger type="primary" onClick={form.submit}>
            {t("confirm", { ns: "common" })}
          </Button>
        </Space>
      }
      open={visible}
      {...props}
    >
      <p>{t("resetPasswordMessage")}</p>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 0 }}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
      >
        <Form.Item label={t("newPassword")} name="password" rules={Rules.Password}>
          <Input.Password style={{ width: "100%" }} placeholder={t("enter", { ns: "common" }) + t("newPassword")} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function AssignBaby({ id, onChange }) {
  const { t } = useTranslation(["user", "common"]);
  const navigate = useNavigate();
  const [visible, openModal, closeModal] = useBoolState(false);
  const [dataSource, refresh] = useFetch(`/admin/users/chw/${id}/babies`, {}, []);

  // release chw, set chw's supervisor to null
  function handleRelease(babyId) {
    axios.delete(`/admin/babies/${babyId}/chw`).then(() => refresh());
  }

  useEffect(() => {
    onChange(dataSource);
  }, [dataSource, onChange]);

  return (
    <Card
      title={t("babyList")}
      noPadding
      extra={
        <Button type="shade" onClick={openModal}>
          {t("newBaby")}
        </Button>
      }
    >
      <ZebraTable
        rowKey="id"
        className="clickable"
        onRow={(record) => ({
          onClick: (event) => {
            // do noting when click other target
            if (event.target.tagName === "TD") {
              navigate(`/babies/${record.id}`);
            }
          },
        })}
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t("babyName"),
            dataIndex: "name",
            width: 140,
            align: "center",
          },
          {
            title: t("id"),
            dataIndex: "identity",
          },
          {
            title: t("gender"),
            dataIndex: "gender",
            render: (h) => Gender[h],
          },
          {
            title: t("master"),
            dataIndex: "masterCarerName",
          },
          {
            title: t("phone"),
            dataIndex: "masterCarerPhone",
          },
          {
            title: t("operation"),
            dataIndex: "id",
            width: 200,
            align: "center",
            render(babyId) {
              return (
                <DeleteConfirmModal
                  title={t("unbindBaby")}
                  content={t("unbindBabyMessage")}
                  onConfirm={() => handleRelease(babyId)}
                  okText={t("unbind")}
                >
                  <Button size="small" type="link">
                    {t("unbind")}
                  </Button>
                </DeleteConfirmModal>
              );
            },
          },
        ]}
      />
      <PageNotAssignedBabyModal id={id} onFinish={refresh} visible={visible} onCancel={closeModal} />
    </Card>
  );
}

const PageNotAssignedBabyModal = WithPage(NotAssignedBabyModal, "/admin/users/chw/not_assigned/babies");

// open a new modal, assign chw to supervisor
function NotAssignedBabyModal({ id, onFinish, onCancel, visible, loadData, ...props }) {
  const { t } = useTranslation(["user", "common"]);
  useEffect(() => {
    if (visible) loadData();
    // eslint-disable-next-line
  }, [visible]);

  async function handleAssign(babyIds) {
    await axios.post(`/admin/users/chw/${id}/babies`, babyIds);
    loadData();
    onFinish();
    onCancel();
  }

  return (
    <AssignModalTable
      {...props}
      title={t("assignBaby")}
      visible={visible}
      onCancel={onCancel}
      onFinish={handleAssign}
      columns={[
        {
          title: t("babyName"),
          dataIndex: "name",
          width: 100,
        },
        {
          title: t("id"),
          dataIndex: "identity",
          width: 120,
        },
        {
          title: t("area"),
          dataIndex: "area",
          width: 300,
        },
      ]}
    />
  );
}

function AssignChw({ id }) {
  const { t } = useTranslation(["user", "common"]);
  const [visible, openModal, closeModal] = useBoolState();
  const [dataSource, refresh] = useFetch(`/admin/users/supervisor/${id}/chw`, {}, []);

  // release chw, set chw's supervisor to null
  function handleRelease(chwId) {
    axios.delete(`/admin/users/chw/${chwId}/supervisor`).then(() => refresh());
  }

  return (
    <Card
      title={t("chw")}
      noPadding
      extra={
        <Button type="shade" onClick={openModal}>
          {t("assignChw")}
        </Button>
      }
    >
      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t("name"),
            dataIndex: "realName",
            width: 180,
            align: "center",
          },
          {
            title: t("id"),
            dataIndex: ["chw", "identity"],
          },
          {
            title: t("area"),
            dataIndex: ["chw", "tags"],
            render: (tags) => tags && tags.join(", "),
          },
          {
            title: t("phone"),
            dataIndex: "phone",
          },
          {
            title: t("operation"),
            dataIndex: "id",
            width: 200,
            align: "center",
            render(chwId) {
              return (
                <DeleteConfirmModal
                  title={t("unbindChw")}
                  content={t("unbindChwMessage")}
                  okText={t("unbind")}
                  onConfirm={() => handleRelease(chwId)}
                >
                  <Button size="small" type="link">
                    {t("unbind")}
                  </Button>
                </DeleteConfirmModal>
              );
            },
          },
        ]}
      />
      <NotAssignedChwModal id={id} onFinish={refresh} visible={visible} onCancel={closeModal} />
    </Card>
  );
}

// open a new modal, assign chw to supervisor
function NotAssignedChwModal({ id, visible, onCancel, onFinish }) {
  const { t } = useTranslation(["user", "common"]);
  const [dataSource, refresh] = useFetch(`/admin/users/supervisor/not_assigned/chw`, {}, []);

  useEffect(() => {
    if (visible) {
      refresh();
    }
    // eslint-disable-next-line
  }, [visible]);

  async function handleAssign(chwIds) {
    await axios.post(`/admin/users/supervisor/${id}/chw`, chwIds);
    refresh();
    onFinish();
    onCancel();
  }

  const debounceRefresh = debounce({ delay: 400 }, (_, search) => refresh({ search }));

  return (
    <AssignModalTable
      visible={visible}
      onCancel={onCancel}
      onFinish={handleAssign}
      dataSource={dataSource}
      title={t("assignNewChw")}
      onChangeSearch={debounceRefresh}
      columns={[
        {
          title: t("chw"),
          dataIndex: "realName",
        },
        {
          title: t("id"),
          dataIndex: ["chw", "identity"],
        },
        {
          title: t("area"),
          dataIndex: ["chw", "tags"],
          render: (tags) => tags && tags.join(", "),
        },
      ]}
    />
  );
}
