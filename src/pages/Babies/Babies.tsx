import axios from "axios";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Button, FormProps, Modal } from "antd";

import useBoolState from "@/hooks/useBoolState";
import ContentHeader from "@/components/ContentHeader";
import CardTabs from "@/components/CardTabs";
import BabyModalForm, { BabyModalFormValues } from "@/components/BabyModalForm";
import ImportExcel from "@/components/ImportExcel";
import useQueryParam from "@/hooks/useQueryParam";
import PageApproved from "./Approved";
import PageUnreviewed from "./Unreviewed";
import { useState } from "react";
import { toNewBabyRequest } from "./schema/BabyForm";

type BabiesTab = "approved" | "unreviewed";

export default function Babies() {
  const { t, i18n } = useTranslation("babies");
  const [tab, setTab] = useQueryParam<BabiesTab>("tab", "approved");
  const [showNewBabyModal, openNewBabyModal, closeNewBabyModal] = useBoolState(false);
  const [showImportModal, openImportModal, closeImportModal] = useBoolState(false);
  const [refreshKey, setRefreshKey] = useState({ approved: 0, unreviewed: 0 });

  function handleCreateBaby(values: BabyModalFormValues) {
    axios.post("/admin/babies", toNewBabyRequest(values, i18n.resolvedLanguage)).then(() => {
      refresh();
      closeNewBabyModal();
    });
  }

  function refresh() {
    const newRefreshKey = {
      ...refreshKey,
    };
    newRefreshKey[tab as BabiesTab] += 1;
    setRefreshKey(newRefreshKey);
  }

  const tabItems = [
    {
      key: "approved",
      label: t("approved"),
      children: <PageApproved refreshKey={refreshKey.approved} />,
    },
    {
      key: "unreviewed",
      label: t("unreviewed"),
      children: <PageUnreviewed refreshKey={refreshKey.unreviewed} />,
    },
  ];

  return (
    <>
      <ContentHeader title={t("babyManagement")}>
        <ImportButton onClick={openImportModal}>{t("batchNewBabies")}</ImportButton>
        <Button type="primary" onClick={openNewBabyModal}>
          {t("newBaby")}
        </Button>
      </ContentHeader>
      <CardTabs onChange={setTab} activeKey={tab} items={tabItems} />
      <BabyModalForm
        title={t("newBaby")}
        visible={showNewBabyModal}
        onFinish={handleCreateBaby}
        onCancel={closeNewBabyModal}
        initialValues={{ stage: "EDC", gender: "UNKNOWN" } as BabyModalFormValues}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
      />
      <Modal
        open={showImportModal}
        title={t("importFromExcel")}
        onCancel={closeImportModal}
        style={{ top: 50 }}
        footer={null}
      >
        <ImportExcel refresh={refresh} close={closeImportModal} open={showImportModal} />
      </Modal>
    </>
  );
}

const ImportButton = styled(Button)`
  border-color: #ff794f;
  color: #ff794f;
  margin-right: 10px;
`;
