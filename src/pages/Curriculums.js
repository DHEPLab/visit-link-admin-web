import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Axios from "axios";
import { Modal, Button, Space, Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Gender } from "../constants/enums";
import { useBoolState } from "../utils";
import { StatusTag, WithPage, ContentHeader, ZebraTable, SearchInput, AssignModalTable } from "../components/*";

function Curriculums({ historyPageState, loadData, onChangeSearch, ...props }) {
  const history = useHistory();
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
          <Button type="primary" onClick={() => history.push("/curriculums/create")}>
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
                history.push(`/curriculums/${record.id}`);
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
    Axios.post(`/admin/curriculums/${curriculumId}/babies`, babyIds).then(() => {
      loadData();
      closeModal();
    });
  }

  function handleReleaseBaby(id) {
    Axios.delete(`/admin/babies/${id}/curriculum`).then(() => loadData());
  }

  return (
    <Modal
      title={t("babyList")}
      visible={visible}
      onCancel={onCancel}
      width={1152}
      footer={null}
      bodyStyle={{ padding: 0 }}
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
            title: t("Operation"),
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
        onCancel={closeModal}
        onFinish={handleAssign}
        columns={[
          {
            title: t("babyName"),
            dataIndex: "name",
            width: 120,
          },
          {
            title: "ID",
            dataIndex: "identity",
            width: 100,
          },
          {
            title: t("area"),
            dataIndex: "area",
            width: 300,
          },
        ]}
      />
    </Modal >
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

export default WithPage(Curriculums, "/admin/curriculums?sort=id,desc");
