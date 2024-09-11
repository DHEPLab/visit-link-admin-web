import React from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, FormProps, message, Modal } from "antd";
import { useTranslation } from "react-i18next";
import useBoolState from "@/hooks/useBoolState";
import useFetch from "@/hooks/useFetch";
import { BabyStage, FeedingPattern, Gender } from "@/constants/enums";
import Card from "@/components/Card";
import BabyModalForm, { BabyModalFormValues } from "@/components/BabyModalForm";
import StaticField from "@/components/StaticField";
import DetailHeader from "@/components/DetailHeader";
import BabyReviewBar from "@/components/BabyReviewBar";
import AssignModalTable from "@/components/AssignModalTable";
import WithPage from "@/components/WithPage";
import Carers from "./Carers";
import ReactiveBabyModal from "./ReactiveBabyModal";
import ArchiveBabyModal, { ArchiveBabyFormValues } from "./ArchiveBabyModal";
import ApproveDeleteBabyModal from "./ApproveDeleteBabyModal";
import ApproveModifyBabyModal from "./ApproveModifyBabyModal";
import ApproveCreateBabyModal, { ApproveCreateBabyFormValues } from "./ApproveCreateBabyModal";
import Visits from "./Visits";
import History from "./History";
import { BabyResponse } from "@/models/res/Baby";
import { ModifyRecordsResponse } from "@/models/res/ModifyRecord";
import ShadeButton from "@/components/ShadeButton";
import { toNewBabyRequest } from "@/pages/Babies/schema/BabyForm";
import { omit } from "radash";
import { ChwUser } from "@/models/res/User";

const { confirm } = Modal;

const PageAssignChwModalTable = WithPage(AssignModalTable<ChwUser>, "/admin/users/chw");

export default function Baby() {
  const { t, i18n } = useTranslation(["baby", "common"]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [baby, refresh] = useFetch<BabyResponse>(`/admin/babies/${id}`);
  const [visible, openModal, closeModal] = useBoolState();

  const [approveCreateVisible, openApproveCreateModal, closeApproveCreateModal] = useBoolState();
  const [approveModifyVisible, openApproveModifyModal, closeApproveModifyModal] = useBoolState();
  const [approveDeleteVisible, openApproveDeleteModal, closeApproveDeleteModal] = useBoolState();
  const [closeAccountVisible, openCloseAccountModal, closeCloseAccountModal] = useBoolState();
  const [revertAccountVisible, openRevertAccountModal, closeRevertAccountModal] = useBoolState();
  const [changeChwVisible, openChangeChwModal, closeChangeChwModal] = useBoolState();

  const { chw, approved, actionFromApp, deleted } = baby;
  const [babyModifyRecords, refreshBabyModifyRecords] = useFetch<ModifyRecordsResponse>(
    "/admin/babies/modify-records",
    { babyId: id },
    [],
  );
  const [carerModifyRecords, refreshCarerModifyRecords] = useFetch<ModifyRecordsResponse>(
    "/admin/carers/modify-records",
    { babyId: id },
    [],
  );
  const oldValue =
    !babyModifyRecords || babyModifyRecords.length === 0
      ? {}
      : Object.fromEntries(
          (babyModifyRecords[0].columnName || []).map((e, i) => [e, babyModifyRecords[0].oldValue[i]]),
        );
  const initialValues = () => {
    const formValues: BabyModalFormValues = {
      ...baby,
      area: (baby.area && baby.area.split("/")) || [],
      edc: baby.edc ? dayjs(baby.edc) : undefined,
      birthday: baby.birthday ? dayjs(baby.birthday) : undefined,
      feedingPattern: baby.feedingPattern ? baby.feedingPattern : undefined,
    };
    return formValues;
  };

  function handleChangeBaby(values: BabyModalFormValues) {
    const requestValues: BabyModalFormValues = { ...omit(baby, ["edc", "birthday", "feedingPattern"]), ...values };
    axios.put(`/admin/babies/${id}`, toNewBabyRequest(requestValues, i18n.resolvedLanguage)).then(() => {
      refresh();
      closeModal();
      refreshBabyModifyRecords();
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

  function handleApproveCreateFinish(values: ApproveCreateBabyFormValues) {
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

  function handleCloseAccount({ reason }: ArchiveBabyFormValues) {
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

  function handleChangeChw(selected: React.Key[]) {
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
            <ShadeButton onClick={openChangeChwModal}>{chw?.id ? t("changeCHW") : t("assignCHW")}</ShadeButton>
          )
        }
      >
        <StaticField label={t("chwID")}>{chw?.chw?.identity}</StaticField>
        <StaticField label={t("name")}>{chw?.realName}</StaticField>
        <StaticField label={t("contactPhone")}>{chw?.phone}</StaticField>
      </Card>

      <PageAssignChwModalTable
        id={chw?.id.toString()} // CHW id is number, unknown why give this value to Table id
        visible={changeChwVisible}
        width={900}
        onCancel={closeChangeChwModal}
        onFinish={handleChangeChw}
        refreshOnVisible
        rowSelectionType="radio"
        rowKey={(record: ChwUser) => record.user?.id.toString()}
        title={t("chooseCHW")}
        columns={[
          {
            title: t("name"),
            dataIndex: ["user", "realName"],
            width: 500,
            ellipsis: true,
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
            width: 200,
          },
        ]}
      />

      <Card
        data-testid="baby-info"
        title={t("babyInfo")}
        extra={
          !deleted && (
            <>
              <Button danger ghost onClick={resetLocation} style={{ marginRight: 10 }}>
                {t("locationCorrect")}
              </Button>
              <ShadeButton onClick={openModal}>{t("edit")}</ShadeButton>
            </>
          )
        }
      >
        <StaticField label={t("name")} history={oldValue["name"]}>
          {baby.name}
        </StaticField>
        <StaticField
          label={t("gender")}
          history={oldValue["gender"] && Gender[oldValue["gender"] as keyof typeof Gender]}
        >
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
                typeof oldValue["assistedFood"] === "boolean" ? (oldValue["assistedFood"] ? t("add") : t("noAdd")) : ""
              }
            >
              {baby.assistedFood ? t("add") : t("noAdd")}
            </StaticField>
            <StaticField
              label={t("feedingMethods")}
              history={
                oldValue["feedingPattern"] && FeedingPattern[oldValue["feedingPattern"] as keyof typeof FeedingPattern]
              }
            >
              {FeedingPattern[baby.feedingPattern as keyof typeof FeedingPattern]}
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

      <Carers babyId={id} deleted={deleted} onModify={refreshCarerModifyRecords} />
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
        dataSource={babyModifyRecords.map((modifyRecord, index) => ({ ...modifyRecord, number: index }))}
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
        dataSource={carerModifyRecords.map((modifyRecord, index) => ({ ...modifyRecord, number: index }))}
      />

      <BabyModalForm
        title={t("modifyBaby")}
        visible={visible}
        onCancel={closeModal}
        onFinish={handleChangeBaby}
        initialValues={initialValues()}
        // 一旦进入婴幼期则不可修改回待产期
        disableStage={baby.stage === "BIRTH"}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
      />
    </>
  );
}
