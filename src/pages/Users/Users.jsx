import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Modal, Radio } from "antd";
import { useTranslation } from "react-i18next";

import Rules from "@/constants/rules";
import useBoolState from "@/hooks/useBoolState";
import { Role } from "@/constants/enums";
import CardTabs from "@/components/CardTabs";
import ContentHeader from "@/components/ContentHeader";
import ModalForm from "@/components/ModalForm";
import WithPage from "@/components/WithPage";
import ZebraTable from "@/components/ZebraTable";
import ImportUserExcel from "@/components/ImportUserExcel";
import ChwTagSelector from "@/components/ChwTagSelector";
import useQueryParam from "@/hooks/useQueryParam";
import { useUserStore } from "@/store/user";
import CHWTab from "./CHWTab";
import { realName, phone, username } from "./tableColumnConfig";

export default function Users() {
  const { t } = useTranslation(["users", "common"]);
  const navigate = useNavigate();
  const [tab, setTab] = useQueryParam("tab", "chw");
  const [visible, openUser, closeUser] = useBoolState();
  const [importModal, openImportModal, closeImportModal] = useBoolState(false);
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.role === "ROLE_ADMIN";

  // change tab to refresh table
  function refresh() {
    const origin = tab;
    setTab(Math.random());
    setTab(origin);
  }

  function handleCreateUser(value) {
    axios.post("/admin/users", value).then(() => {
      refresh();
      closeUser();
    });
  }

  const tabItems = [
    {
      key: "chw",
      label: t("chw"),
      children: <CHWTab tab={tab} />,
    },
  ];

  if (isAdmin) {
    tabItems.push({
      key: "supervisor",
      label: t("supervisor"),
      children: <PageSupervisor tab={tab} navigate={navigate} />,
    });
    tabItems.push({
      key: "admin",
      label: t("admin"),
      children: <PageAdmin tab={tab} navigate={navigate} />,
    });
  }

  return (
    <>
      <ContentHeader title={t("accountManagement")}>
        <Button style={{ marginRight: 28, borderColor: "#ff794f", color: "#ff794f" }} onClick={openImportModal}>
          {t("batchNewAccounts")}
        </Button>
        <Modal
          open={importModal}
          title={t("excel.importFromExcel", { ns: "common" })}
          onCancel={closeImportModal}
          style={{ top: 50 }}
          footer={null}
        >
          <ImportUserExcel refresh={refresh} close={closeImportModal} open={importModal} />
        </Modal>
        <Button type="primary" onClick={openUser}>
          {t("createNewUser")}
        </Button>
      </ContentHeader>
      {user.id && <CardTabs onChange={setTab} defaultActiveKey={tab} items={tabItems} />}
      <ModalForm
        title={t("createNewUser")}
        visible={visible}
        onCancel={closeUser}
        onFinish={handleCreateUser}
        initialValues={{ role: "ROLE_CHW" }}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
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
                  {Role[key]}
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
                  <Form.Item label={t("area")} name={["chw", "tags"]} rules={Rules.Area}>
                    <ChwTagSelector />
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
    </>
  );
}

const PageSupervisor = WithPage(Supervisor, "/admin/users/supervisor", {}, false);
const PageAdmin = WithPage(Admin, "/admin/users/admin?sort=id,desc", {}, false);

function Supervisor({ tab, navigate, loadData, ...props }) {
  const { t } = useTranslation(["users", "common"]);
  useEffect(() => {
    if (tab === "supervisor") {
      loadData();
    }
  }, [tab, loadData]);

  return (
    <div>
      <ZebraTable
        {...props}
        scroll={{ x: true }}
        className="clickable"
        rowKey={(record) => record.user.id}
        onRow={(record) => onRow(navigate, record.user.id)}
        columns={[
          realName,
          phone,
          {
            title: t("chw"),
            dataIndex: "chwCount",
            width: 200,
            render: (h) => `${h} ${t("unit.person", { ns: "common" })}`,
          },
          username,
        ]}
      />
    </div>
  );
}

function Admin({ tab, navigate, loadData, ...props }) {
  useEffect(() => {
    if (tab === "admin") {
      loadData();
    }
  }, [tab, loadData]);

  return (
    <div>
      <ZebraTable
        {...props}
        scroll={{ x: true }}
        rowKey="id"
        className="clickable"
        onRow={(record) => onRow(navigate, record.id)}
        columns={[
          { ...realName, dataIndex: "realName" },
          { ...phone, dataIndex: "phone" },
          { ...username, dataIndex: "username" },
        ]}
      />
    </div>
  );
}

const onRow = (navigate, id) => {
  return {
    onClick: () => {
      navigate(`/users/${id}`);
    },
  };
};
