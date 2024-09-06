import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button, Modal } from "antd";

import useBoolState from "@/hooks/useBoolState";
import ContentHeader from "@/components/ContentHeader";
import CardTabs from "@/components/CardTabs";
import BabyModalForm from "@/components/BabyModalForm";
import ImportExcel from "@/components/ImportExcel";
import useQueryParam from "@/hooks/useQueryParam";
import PageApproved from "./Approved";
import PageUnreviewed from "./Unreviewed";

function formatDate(datetime) {
  return dayjs(datetime).format("YYYY-MM-DD");
}

export default function Babies() {
  const { t, i18n } = useTranslation("babies");
  const navigate = useNavigate();
  const [tab, setTab] = useQueryParam("tab", "approved");
  const [visible, openBaby, closeBaby] = useBoolState(false);
  const [impoerModal, openImpoerModal, closeImpoerModal] = useBoolState(false);

  function handleCreateBaby(values) {
    if (i18n.resolvedLanguage === "zh") {
      values.area = values.area.join("/");
    }
    values.birthday = values.birthday && formatDate(values.birthday);
    values.edc = values.edc && formatDate(values.edc);
    axios.post("/admin/babies", values).then(() => {
      refresh();
      closeBaby();
    });
  }

  // change tab to refresh table
  function refresh() {
    const origin = tab;
    setTab(Math.random());
    setTab(origin);
  }

  const tabItems = [
    {
      key: "approved",
      label: t("approved"),
      children: <PageApproved tab={tab} navigate={navigate} />,
    },
    {
      key: "unreviewed",
      label: t("unreviewed"),
      children: <PageUnreviewed tab={tab} navigate={navigate} />,
    },
  ];

  return (
    <>
      <ContentHeader title={t("babyManagement")}>
        <ImportButton onClick={openImpoerModal}>{t("batchNewBabies")}</ImportButton>
        <Button type="primary" onClick={openBaby}>
          {t("newBaby")}
        </Button>
      </ContentHeader>
      <CardTabs onChange={setTab} defaultActiveKey={tab} items={tabItems} />
      <BabyModalForm
        title={t("newBaby")}
        visible={visible}
        onFinish={handleCreateBaby}
        onCancel={closeBaby}
        initialValues={{ stage: "EDC", gender: "UNKNOWN" }}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
      />
      <Modal
        open={impoerModal}
        title={t("importFromExcel")}
        onCancel={closeImpoerModal}
        style={{ top: 50 }}
        footer={null}
      >
        <ImportExcel refresh={refresh} close={closeImpoerModal} open={impoerModal} />
      </Modal>
    </>
  );
}

const ImportButton = styled(Button)`
  border-color: #ff794f;
  color: #ff794f;
  margin-right: 10px;
`;
