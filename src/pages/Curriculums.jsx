import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Modal, Button, Space, Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Gender } from "../constants/enums";
import useBoolState from "@/hooks/useBoolState";
import StatusTag from "@/components/StatusTag";
import WithPage from "@/components/WithPage";
import ContentHeader from "@/components/ContentHeader";
import ZebraTable from "@/components/ZebraTable";
import SearchInput from "@/components/SearchInput";
import AssignModalTable from "@/components/AssignModalTable";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CurriculumsContent({ historyPageState, loadData, onChangeSearch, ...props }) {
  const navigate = useNavigate();
  const [visible, openModal, closeModal] = useBoolState(false);
  const [curriculumId, setCurriculumId] = useState();
  const { t } = useTranslation("curriculums");

  function openBabiesModal(id) {
    setCurriculumId(id);
    openModal();
  }

  return (
    <>
      <ContentHeader title={t("curriculumManagement")}>
        <Space size="large">
          <SearchInput
            defaultValue={historyPageState?.search}
            onChange={(e) => onChangeSearch("search", e.target.value)}
            className="master"
            placeholder={t("searchByCurriculumName")}
          />
          <Button type="primary" onClick={() => navigate("/curriculums/create")}>
            {t("createNewCurriculum")}
          </Button>
        </Space>
      </ContentHeader>

      <ZebraTable
        {...props}
        rowKey="id"
        className="clickable"
        onRow={(record) => {
          return {
            onClick: (event) => {
              // do noting when click other target
              if (event.target.tagName === "TD") {
                navigate(`/curriculums/${record.id}`);
              }
            },
          };
        }}
        columns={[
          {
            title: t("curriculumStatus"),
            dataIndex: "published",
            width: 120,
            align: "center",
            render: (h) => <StatusTag value={h} />,
          },
          {
            title: t("curriculumName"),
            dataIndex: "name",
          },
          {
            title: t("action"),
            dataIndex: "id",
            width: 200,
            align: "center",
            render(id) {
              return (
                <Button type="link" size="small" onClick={() => openBabiesModal(id)}>
                  {t("assignBaby")}
                </Button>
              );
            },
          },
        ]}
      />

      <PageCurriculumBabiesModal curriculumId={curriculumId} visible={visible} onCancel={closeModal} />
    </>
  );
}

const PageCurriculumBabiesModal = WithPage(CurriculumBabiesModal);

function CurriculumBabiesModal({
  curriculumId,
  visible,
  onCancel,
  loadData,
  onChangeLoadURL,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChangeSearch,
  ...props
}) {
  const { t } = useTranslation("curriculums");
  const [assign, openModal, closeModal] = useBoolState();

  useEffect(() => {
    if (curriculumId) onChangeLoadURL(`/admin/curriculums/${curriculumId}/babies`);
    // eslint-disable-next-line
  }, [curriculumId]);

  function handleAssign(babyIds) {
    axios.post(`/admin/curriculums/${curriculumId}/babies`, babyIds).then(() => {
      loadData();
      closeModal();
    });
  }

  function handleReleaseBaby(id) {
    axios.delete(`/admin/babies/${id}/curriculum`).then(() => loadData());
  }

  return (
    <Modal
      title={t("babyList")}
      open={visible}
      onCancel={onCancel}
      width={1152}
      footer={null}
      styles={{ body: { padding: 0 } }}
      style={{ top: 20 }}
    >
      <ModalHeader>
        <Title>
          <label>{t("curriculumAssignedBabyList")}</label>
          <Tooltip title={t("babyAutoAssignTip")} placement="right">
            <InfoCircleFilled />
          </Tooltip>
        </Title>
        <Button type="shade" onClick={openModal}>
          {t("addNewBaby")}
        </Button>
      </ModalHeader>
      <ZebraTable
        {...props}
        rowKey="id"
        columns={[
          {
            title: t("babyName"),
            dataIndex: "name",
            width: 100,
          },
          {
            title: t("ID"),
            dataIndex: "identity",
            width: 120,
          },
          {
            title: t("gender"),
            dataIndex: "gender",
            render: (h) => Gender[h],
            width: 80,
          },
          {
            title: t("area"),
            dataIndex: "area",
            width: 300,
          },
          {
            title: t("primaryCaregiver"),
            dataIndex: "masterCarerName",
            width: 120,
          },
          {
            title: t("contactPhone"),
            dataIndex: "masterCarerPhone",
            width: 120,
          },
          {
            title: t("action"),
            dataIndex: "id",
            width: 100,
            align: "center",
            render(id) {
              return (
                <Button type="link" size="small" onClick={() => handleReleaseBaby(id)}>
                  {t("delete")}
                </Button>
              );
            },
          },
        ]}
      />
      <PageAssignModalTable
        title={t("addNewBaby")}
        curriculumId={curriculumId}
        visible={assign}
        width={900}
        onCancel={closeModal}
        onFinish={handleAssign}
        columns={[
          {
            title: t("babyName"),
            dataIndex: "name",
            width: 500,
            ellipsis: true,
          },
          {
            title: "ID",
            dataIndex: "identity",
            width: 100,
          },
          {
            title: t("area"),
            dataIndex: "area",
            width: 200,
          },
        ]}
      />
    </Modal>
  );
}

function AssignModalTableContainer({ curriculumId, onChangeLoadURL, ...props }) {
  useEffect(() => {
    if (!props.visible) return;
    if (curriculumId) onChangeLoadURL(`/admin/curriculums/${curriculumId}/not_assigned_babies`);
    // eslint-disable-next-line
  }, [curriculumId, props.visible]);
  return <AssignModalTable {...props} />;
}

const PageAssignModalTable = WithPage(AssignModalTableContainer);

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  height: 70px;
  border-bottom: 2px solid #eee;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  label {
    color: #4a4a4a;
    font-size: 20px;
    font-weight: bold;
    margin-right: 5px;
  }
`;

const Curriculums = WithPage(CurriculumsContent, "/admin/curriculums?sort=id,desc");
export default Curriculums;
