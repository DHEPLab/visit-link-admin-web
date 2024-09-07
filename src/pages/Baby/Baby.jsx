import React from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message, Modal } from "antd";
import { useTranslation } from "react-i18next";
import useBoolState from "@/hooks/useBoolState";
import useFetch from "@/hooks/useFetch";
import { BabyStage, FamilyTies, FeedingPattern, Gender } from "@/constants/enums";
import Card from "@/components/Card";
import ZebraTable from "@/components/ZebraTable";
import BabyModalForm from "@/components/BabyModalForm";
import StaticField from "@/components/StaticField";
import DetailHeader from "@/components/DetailHeader";
import BabyReviewBar from "@/components/BabyReviewBar";
import AssignModalTable from "@/components/AssignModalTable";
import WithPage from "@/components/WithPage";
import styled from "styled-components";
import Carers from "./Carers";
import ReactiveBabyModal from "./ReactiveBabyModal";
import ArchiveBabyModal from "./ArchiveBabyModal";
import ApproveDeleteBabyModal from "./ApproveDeleteBabyModal";
import ApproveModifyBabyModal from "./ApproveModifyBabyModal";
import ApproveCreateBabyModal from "./ApproveCreateBabyModal";
import Visits from "./Visits";

const { confirm } = Modal;

export default function Baby() {
  const { t } = useTranslation(["baby", "common"]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [baby, refresh] = useFetch(`/admin/babies/${id}`);
  const [visible, openModal, closeModal] = useBoolState();

  const [approveCreateVisible, openApproveCreateModal, closeApproveCreateModal] = useBoolState();
  const [approveModifyVisible, openApproveModifyModal, closeApproveModifyModal] = useBoolState();
  const [approveDeleteVisible, openApproveDeleteModal, closeApproveDeleteModal] = useBoolState();
  const [closeAccountVisible, openCloseAccountModal, closeCloseAccountModal] = useBoolState();
  const [revertAccountVisible, openRevertAccountModal, closeRevertAccountModal] = useBoolState();
  const [changeChwVisible, openChangeChwModal, closeChangeChwModal] = useBoolState();

  const { chw, approved, actionFromApp, deleted } = baby;
  const [dataSource, refreshHistory] = useFetch("/admin/babies/modify-records", { babyId: id }, []);
  const [careModifyRecords, refreshCareModifyRecords] = useFetch("/admin/carers/modify-records", { babyId: id }, []);
  const oldValue =
    !dataSource || dataSource.length === 0
      ? {}
      : Object.fromEntries((dataSource[0].columnName || []).map((e, i) => [e, dataSource[0].oldValue[i]]));
  const initialValues = () => ({
    ...baby,
    chw: null,
    area: (baby.area && baby.area.split("/")) || [],
    edc: baby.edc && dayjs(baby.edc),
    birthday: baby.birthday && dayjs(baby.birthday),
  });

  function handleChangeBaby(values) {
    values.area = values.area.join("/");
    // format birthday and edc to string date
    values.birthday = values.birthday && dayjs(values.birthday).format("YYYY-MM-DD");
    values.edc = values.edc && dayjs(values.edc).format("YYYY-MM-DD");
    axios.put(`/admin/babies/${id}`, { ...baby, ...values }).then(() => {
      refresh();
      closeModal();
      refreshHistory();
    });
  }

  function handleApprove() {
    switch (actionFromApp) {
      case "CREATE":
        openApproveCreateModal();
        break;
      case "MODIFY":
        openApproveModifyModal();
        break;
      case "DELETE":
        openApproveDeleteModal();
        break;
      default:
      // TODO
    }
  }

  function handleReject() {
    confirm({
      title: t("rejectTitle"),
      content: t("rejectContent"),
      onOk() {
        axios.put(`/admin/babies/${id}/reject`, baby).then(() => {
          refresh();
        });
      },
      onCancel() {},
    });
  }

  function handleApproveCreateFinish(values) {
    axios.put(`/admin/babies/${id}/approve`, values).then(() => {
      closeApproveCreateModal();
      refresh();
    });
  }

  function handleApproveModifyFinish() {
    axios.put(`/admin/babies/${id}/approve`, {}).then(() => {
      closeApproveModifyModal();
      refresh();
    });
  }

  function handleApproveDeleteFinish() {
    axios.put(`/admin/babies/${id}/approve`, {}).then(() => {
      closeApproveDeleteModal();
      navigate(-1);
    });
  }

  function handleCloseAccount({ reason }) {
    axios.delete(`/admin/babies/${id}?reason=${reason}`).then(() => {
      navigate(-1);
    });
  }

  function handleRevertAccount() {
    axios.put(`/admin/babies/${id}/revert`).then(() => {
      closeRevertAccountModal();
      refresh();
    });
  }

  function handleChangeChw(selected) {
    if (selected.length === 0) return message.warning(t("noSelectedChwWarning"));
    const [userId] = selected;
    axios.put(`/admin/babies/${id}/chw/${userId}`).then(() => {
      closeChangeChwModal();
      refresh();
    });
  }

  if (!baby.id) return null;

  function headerExtra() {
    if (!approved) return;
    if (deleted) {
      return (
        <Button ghost danger onClick={openRevertAccountModal}>
          {t("reactiveBaby")}
        </Button>
      );
    } else {
      return (
        <Button ghost danger onClick={openCloseAccountModal}>
          {t("archiveBaby")}
        </Button>
      );
    }
  }

  function resetLocation() {
    axios.post(`/admin/babies/reset/location/${id}`).then(() => {
      message.success(t("locationCorrectSuccessfully"));
      refresh();
    });
  }

  return (
    <>
      <DetailHeader
        icon="iconbaby-primary"
        menu={t("babyManagement")}
        title={baby.name}
        role={`${t("id")} ${baby.identity || t("waitingApproval")}`}
        extra={headerExtra()}
      />
      <ArchiveBabyModal visible={closeAccountVisible} onCancel={closeCloseAccountModal} onOk={handleCloseAccount} />
      <ReactiveBabyModal visible={revertAccountVisible} onCancel={closeRevertAccountModal} onOk={handleRevertAccount} />

      {!approved && <BabyReviewBar baby={baby} onApprove={handleApprove} onReject={handleReject} />}
      <ApproveCreateBabyModal
        visible={approveCreateVisible}
        onCancel={closeApproveCreateModal}
        onFinish={handleApproveCreateFinish}
      />
      <ApproveModifyBabyModal
        visible={approveModifyVisible}
        onCancel={closeApproveModifyModal}
        onFinish={handleApproveModifyFinish}
      />
      <ApproveDeleteBabyModal
        visible={approveDeleteVisible}
        onCancel={closeApproveDeleteModal}
        onFinish={handleApproveDeleteFinish}
      />

      <Card
        title={t("chw")}
        extra={
          !deleted && (
            <Button type="shade" onClick={openChangeChwModal}>
              {chw?.id ? t("changeCHW") : t("assignCHW")}
            </Button>
          )
        }
      >
        <StaticField label={t("chwID")}>{chw?.chw?.identity}</StaticField>
        <StaticField label={t("name")}>{chw?.realName}</StaticField>
        <StaticField label={t("contactPhone")}>{chw?.phone}</StaticField>
      </Card>

      <PageAssignChwModalTable
        id={chw?.id}
        visible={changeChwVisible}
        onCancel={closeChangeChwModal}
        onFinish={handleChangeChw}
        refreshOnVisible
        rowSelectionType="radio"
        rowKey={(record) => record.user?.id}
        title={t("chooseCHW")}
        columns={[
          {
            title: t("name"),
            dataIndex: ["user", "realName"],
            width: 120,
          },
          {
            title: "ID",
            dataIndex: ["user", "chw", "identity"],
            width: 100,
          },
          {
            title: t("area"),
            dataIndex: ["user", "chw", "tags"],
            render: (tags) => tags && tags.join(", "),
            width: 300,
          },
        ]}
      />

      <Card
        title={t("babyInfo")}
        extra={
          !deleted && (
            <>
              <Button danger ghost onClick={resetLocation} style={{ marginRight: 10 }}>
                {t("locationCorrect")}
              </Button>
              <Button type="shade" onClick={openModal}>
                {t("edit")}
              </Button>
            </>
          )
        }
      >
        <StaticField label={t("name")} history={oldValue["name"]}>
          {baby.name}
        </StaticField>
        <StaticField label={t("gender")} history={oldValue["gender"] && Gender[oldValue["gender"]]}>
          {Gender[baby.gender]}
        </StaticField>
        <StaticField label={t("growthStage")}>
          {BabyStage[baby.stage]} {baby.days} {t("unit.day", { ns: "common" })}
        </StaticField>

        {baby.stage === "EDC" ? (
          <StaticField label={t("dueDay")} history={oldValue["edc"]}>
            {dayjs(baby.edc).format("YYYY-MM-DD")}
          </StaticField>
        ) : (
          <>
            <StaticField label={t("birthDay")} history={oldValue["birthday"]}>
              {dayjs(baby.birthday).format("YYYY-MM-DD")}
            </StaticField>
            <StaticField
              label={t("supplementaryFood")}
              history={
                typeof oldValue["assistedFood"] === "boolean" && (oldValue["assistedFood"] ? t("add") : t("noAdd"))
              }
            >
              {baby.assistedFood ? t("add") : t("noAdd")}
            </StaticField>
            <StaticField
              label={t("feedingMethods")}
              history={oldValue["feedingPattern"] && FeedingPattern[oldValue["feedingPattern"]]}
            >
              {FeedingPattern[baby.feedingPattern]}
            </StaticField>
          </>
        )}

        <StaticField label={t("area")} history={oldValue["area"]}>
          {baby.area}
        </StaticField>
        <StaticField label={t("address")} history={oldValue["location"]}>
          {baby.location}
        </StaticField>

        <StaticField
          label={t("longAndLat")}
          history={
            oldValue["longitude"] || oldValue["latitude"]
              ? `${oldValue["longitude"] || baby["longitude"]}，${oldValue["latitude"] || baby["latitude"]}`
              : ""
          }
        >
          {baby.longitude && `${baby.longitude}，${baby.latitude}`}
        </StaticField>
        <StaticField label={t("comments")} history={oldValue["remark"]}>
          {baby.remark}
        </StaticField>
        {deleted && <StaticField label={t("archiveReason")}>{baby.closeAccountReason}</StaticField>}
      </Card>

      <Carers babyId={id} deleted={deleted} onModify={refreshCareModifyRecords} />
      <Visits babyId={id} />
      <History
        title={t("babyInfoChangeRecord")}
        columnValues={{
          chw: t("chw"),
          name: t("name"),
          gender: t("gender"),
          edc: t("edc"),
          birthday: t("birthDay"),
          assistedFood: t("supplementaryFood"),
          feedingPattern: t("feedingMethods"),
          area: t("area"),
          location: t("address"),
          longitude: t("longitude"),
          latitude: t("latitude"),
          remark: t("comments"),
        }}
        dataSource={dataSource.map((e, i) => ({ ...e, number: i }))}
      />
      <History
        title={t("caregiverInfoChangeRecord")}
        columnValues={{
          master: t("master"),
          name: t("name"),
          phone: t("phone"),
          wechat: t("wechat"),
          familyTies: t("relatives"),
        }}
        dataSource={careModifyRecords.map((e, i) => ({ ...e, number: i }))}
      />

      <BabyModalForm
        title={t("modifyBaby")}
        visible={visible}
        onCancel={closeModal}
        onFinish={handleChangeBaby}
        initialValues={initialValues()}
        // 一旦进入婴幼期则不可修改回待产期
        disableStage={baby.stage === "BIRTH"}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
      />
    </>
  );
}

const PageAssignChwModalTable = WithPage(AssignModalTable, "/admin/users/chw");

function History({ title, dataSource, columnValues }) {
  const { t } = useTranslation(["baby", "common", "enum"]);

  function getValue(key, value) {
    switch (key) {
      case "gender":
        return Gender[value];
      case "assistedFood":
        return value ? t("AssistedFood.TRUE", { ns: "enum" }) : t("AssistedFood.FALSE", { ns: "enum" });
      case "feedingPattern":
        return FeedingPattern[value];
      case "master":
        return value ? t("yes") : t("no");
      case "familyTies":
        return FamilyTies[value];
      default:
        return value;
    }
  }

  return (
    <Card title={title} noPadding>
      <ZebraTable
        rowKey="number"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t("time"),
            dataIndex: "lastModifiedAt",
            width: 200,
            align: "center",
            render: (h) => dayjs(h).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            title: t("content"),
            dataIndex: "newValue",
            render: (h, record) => {
              const { columnName, newValue, oldValue, roleName, userName } = record;
              const changeValues = (columnName || [])
                .filter((e) => e !== "chw")
                .map((e, i) => {
                  return columnValues[e]
                    ? {
                        columnName: columnValues[e],
                        oldValue: getValue(e, oldValue[i]),
                        newValue: getValue(e, newValue[i]),
                      }
                    : null;
                })
                .filter((e) => !!e);
              return (
                <div>
                  {changeValues.map((e, i) => {
                    const obj = e || {};
                    return (
                      <div key={i}>
                        <BlobFont>{`${roleName} ${userName}`}</BlobFont>
                        {t("changed")}
                        <BlobFont>{obj.columnName}</BlobFont>
                        {t("from")}
                        <BlobFont>{obj.oldValue}</BlobFont>
                        {t("to")}
                        <BlobFont>{obj.newValue}</BlobFont>；
                      </div>
                    );
                  })}
                </div>
              );
            },
          },
        ]}
      />
    </Card>
  );
}

const BlobFont = styled.span`
  font-weight: bold;
  color: #ff9c78;
  margin: 0px 2px;
`;
