import axios from "axios";
import { useState } from "react";
import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";
import useBoolState from "@/hooks/useBoolState";
import CardTabs from "@/components/CardTabs";
import ContentHeader from "@/components/ContentHeader";
import ImportUserExcel from "@/components/ImportUserExcel";
import useQueryParam from "@/hooks/useQueryParam";
import { useUserStore } from "@/store/user";
import CHWTab from "./CHWTab";
import SupervisorTab from "./SupervisorTab";
import AdminTab from "./AdminTab";
import CreateNewUserModalForm, { CreateNewUserFormValues } from "./CreateNewUserModalForm";

type UsersTab = "chw" | "supervisor" | "admin";

export default function Users() {
  const { t } = useTranslation(["users", "common"]);
  const [tab, setTab] = useQueryParam<UsersTab>("tab", "chw");
  const [newUserModal, openNewUserModal, closeNewUserModal] = useBoolState();
  const [importModal, openImportModal, closeImportModal] = useBoolState(false);
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.role === "ROLE_ADMIN";
  const [refreshKey, setRefreshKey] = useState({ chw: 0, supervisor: 0, admin: 0 });

  // change tab to refresh table
  function refresh() {
    const newRefreshKey = {
      ...refreshKey,
    };
    newRefreshKey[tab as UsersTab] += 1;
    setRefreshKey(newRefreshKey);
  }

  function handleCreateUser(value: CreateNewUserFormValues) {
    axios.post("/admin/users", value).then(() => {
      refresh();
      closeNewUserModal();
    });
  }

  const tabItems = [
    {
      key: "chw",
      label: t("chw"),
      children: <CHWTab refreshKey={refreshKey.chw} />,
    },
  ];

  if (isAdmin) {
    tabItems.push({
      key: "supervisor",
      label: t("supervisor"),
      children: <SupervisorTab refreshKey={refreshKey.supervisor} />,
    });
    tabItems.push({
      key: "admin",
      label: t("admin"),
      children: <AdminTab refreshKey={refreshKey.admin} />,
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
        <Button type="primary" onClick={openNewUserModal}>
          {t("createNewUser")}
        </Button>
      </ContentHeader>
      {user.id && <CardTabs onChange={setTab} defaultActiveKey={tab} items={tabItems} />}
      <CreateNewUserModalForm
        visible={newUserModal}
        loginUserRole={user?.role}
        onCancel={closeNewUserModal}
        onFinish={handleCreateUser}
      />
    </>
  );
}
