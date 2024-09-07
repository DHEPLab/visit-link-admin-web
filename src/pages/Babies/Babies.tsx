import axios from "axios";
import dayjs from "dayjs";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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

export default function Babies() {
  const { t, i18n } = useTranslation("babies");
  const navigate = useNavigate();
  const [tab, setTab] = useQueryParam("tab", "approved");
  const [visible, openBaby, closeBaby] = useBoolState(false);
  const [importModal, openImportModal, closeImportModal] = useBoolState(false);
  const [refreshKey, setRefreshKey] = useState({ approved: 0, unreviewed: 0 });

  function handleCreateBaby(values: BabyModalFormValues) {
    if (i18n.resolvedLanguage === "zh" && Array.isArray(values.area)) {
      values.area = values.area.join("/");
    }
    values.birthday = values.birthday && dayjs(values.birthday).format("YYYY-MM-DD");
    values.edc = values.edc && dayjs(values.edc).format("YYYY-MM-DD");
    axios.post("/admin/babies", values).then(() => {
      refresh();
      closeBaby();
    });
  }

  // change tab to refresh table
  function refresh() {
    const newRefreshKey = {
      ...refreshKey,
    };
    newRefreshKey[(tab as "approved") || "unreviewed"] += 1;
    setRefreshKey(newRefreshKey);
  }

  const tabItems = [
    {
      key: "approved",
      label: t("approved"),
      children: <PageApproved navigate={navigate} refreshKey={refreshKey.approved} />,
    },
    {
      key: "unreviewed",
      label: t("unreviewed"),
      children: <PageUnreviewed navigate={navigate} refreshKey={refreshKey.unreviewed} />,
    },
  ];

  return (
    <>
      <ContentHeader title={t("babyManagement")}>
        <ImportButton onClick={openImportModal}>{t("batchNewBabies")}</ImportButton>
        <Button type="primary" onClick={openBaby}>
          {t("newBaby")}
        </Button>
      </ContentHeader>
      <CardTabs onChange={setTab} activeKey={tab} items={tabItems} />
      <BabyModalForm
        title={t("newBaby")}
        visible={visible}
        onFinish={handleCreateBaby}
        onCancel={closeBaby}
        initialValues={{ stage: "EDC", gender: "UNKNOWN" } as BabyModalFormValues}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
      />
      <Modal
        open={importModal}
        title={t("importFromExcel")}
        onCancel={closeImportModal}
        style={{ top: 50 }}
        footer={null}
      >
        <ImportExcel refresh={refresh} close={closeImportModal} open={importModal} />
      </Modal>
    </>
  );
}

const ImportButton = styled(Button)`
  border-color: #ff794f;
  color: #ff794f;
  margin-right: 10px;
`;
