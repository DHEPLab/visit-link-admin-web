import React, { useEffect, useState } from "react";
import moment from "moment";
import Axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { Modal, Form, Button, Space, Input, Radio, message, Tooltip } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

import Rules from "../constants/rules";
import Visit from "../utils/visit";
import { useFetch, useBoolState } from "../utils";
import { Gender, BabyStage, FamilyTies, FeedingPattern, VisitStatus } from "../constants/enums";
import {
  Card,
  ZebraTable,
  BabyModalForm,
  StaticField,
  ModalForm,
  DetailHeader,
  DeleteConfirmModal,
  SelectEnum,
  BabyReviewBar,
  AssignModalTable,
  WithPage,
} from "../components/*";
import styled from "styled-components";
const { confirm } = Modal;

export default function Baby() {
  const { t } = useTranslation(["baby", "common"]);
  const { id } = useParams();
  const history = useHistory();
  const [baby, refresh] = useFetch(`/admin/babies/${id}`);
  const [visible, openModal, closeModal] = useBoolState();

  const [approveCreateVisible, openApproveCreateModal, closeApproveCreateModal] = useBoolState();
  const [approveModifyVisible, openApproveModifyModal, closeApproveModifyModal] = useBoolState();
  const [approveDeleteVisible, openApproveDeleteModal, closeApproveDeleteModal] = useBoolState();
  const [closeAccountVisible, openCloseAccountModal, closeCloseAccountModal] = useBoolState();
  const [revertAccountVisible, openRevertAccountModal, closeRevertAccountModal] = useBoolState();
  const [changeChwVisible, openChangeChwModal, closeChangeChwModal] = useBoolState();

  const { chw, approved, actionFromApp, deleted } = baby;
  const [dataSource, refreshHistory] = useFetch('/admin/babies/modify-records', { babyId: id }, []);
  const [careModifyRecords, refreshCareModifyRecords] = useFetch('/admin/carers/modify-records', { babyId: id }, []);
  const oldValue =
    !dataSource || dataSource.length === 0
      ? {}
      : Object.fromEntries((dataSource[0].columnName || []).map((e, i) => [e, dataSource[0].oldValue[i]]));
  const initialValues = () => ({
    ...baby,
    chw: null,
    area: (baby.area && baby.area.split("/")) || [],
    edc: baby.edc && moment(baby.edc),
    birthday: baby.birthday && moment(baby.birthday),
  });

  function handleChangeBaby(values) {
    values.area = values.area.join("/");
    // format birthday and edc to string date
    values.birthday = values.birthday && moment(values.birthday).format("YYYY-MM-DD");
    values.edc = values.edc && moment(values.edc).format("YYYY-MM-DD");
    Axios.put(`/admin/babies/${id}`, { ...baby, ...values }).then(() => {
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
      title: t('rejectTitle'),
      content: t('rejectContent'),
      onOk() {
        Axios.put(`/admin/babies/${id}/reject`, baby).then(() => {
          refresh();
        });
      },
      onCancel() { }
    });
  }

  function handleApproveCreateFinish(values) {
    Axios.put(`/admin/babies/${id}/approve`, values).then(() => {
      closeApproveCreateModal();
      refresh();
    });
  }

  function handleApproveModifyFinish() {
    Axios.put(`/admin/babies/${id}/approve`, {}).then(() => {
      closeApproveModifyModal();
      refresh();
    });
  }

  function handleApproveDeleteFinish() {
    Axios.put(`/admin/babies/${id}/approve`, {}).then(() => {
      closeApproveDeleteModal();
      history.goBack();
    });
  }

  function handleCloseAccount({ reason }) {
    Axios.delete(`/admin/babies/${id}?reason=${reason}`).then(() => {
      history.goBack();
    });
  }

  function handleRevertAccount() {
    Axios.put(`/admin/babies/${id}/revert`).then(() => {
      closeRevertAccountModal();
      refresh();
    });
  }

  function handleChangeChw(selected) {
    if (selected.length === 0) return message.warning(t('noSelectedChwWarning'));
    const [userId] = selected;
    Axios.put(`/admin/babies/${id}/chw/${userId}`).then(() => {
      closeChangeChwModal();
      refresh();
    });
  }

  if (!baby.id) return null;

  function headerExtra() {
    if (!approved) return;
    if (deleted) {
      return (
        <Button ghost type="danger" onClick={openRevertAccountModal}>
          {t('reactiveBaby')}
        </Button>
      );
    } else {
      return (
        <Button ghost type="danger" onClick={openCloseAccountModal}>
          {t('archiveBaby')}
        </Button>
      );
    }
  }

  function resetLocation() {
    Axios.post(`/admin/babies/reset/location/${id}`).then(() => {
      message.success(t('locationCorrectSuccessfully'))
      refresh();
    });
  }

  return (
    <>
      <DetailHeader
        icon="iconbaby-primary"
        menu={t('babyManagement')}
        title={baby.name}
        role={`${t('id')} ${baby.identity || t('waitingApproval')}`}
        extra={headerExtra()}
      />
      <CloseAccountBabyModal
        visible={closeAccountVisible}
        onCancel={closeCloseAccountModal}
        onOk={handleCloseAccount}
      />
      <RevertAccountBabyModal
        visible={revertAccountVisible}
        onCancel={closeRevertAccountModal}
        onOk={handleRevertAccount}
      />

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
        title={t('chw')}
        extra={
          !deleted && (
            <Button type="shade" onClick={openChangeChwModal}>
              {chw?.id ? t('changeCHW') : t('assignCHW')}
            </Button>
          )
        }
      >
        <StaticField label={t('chwID')}>{chw?.chw?.identity}</StaticField>
        <StaticField label={t('name')}>{chw?.realName}</StaticField>
        <StaticField label={t('contactPhone')}>{chw?.phone}</StaticField>
      </Card>

      <PageAssignChwModalTable
        id={chw?.id}
        visible={changeChwVisible}
        onCancel={closeChangeChwModal}
        onFinish={handleChangeChw}
        refreshOnVisible
        rowSelectionType="radio"
        rowKey={(record) => record.user?.id}
        title={t('chooseCHW')}
        columns={[
          {
            title: t('name'),
            dataIndex: ["user", "realName"],
            width: 120,
          },
          {
            title: "ID",
            dataIndex: ["user", "chw", "identity"],
            width: 100,
          },
          {
            title: t('area'),
            dataIndex: ["user", "chw", "tags"],
            render: (tags) => tags && tags.join(", "),
            width: 300,
          },
        ]}
      />

      <Card
        title={t('babyInfo')}
        extra={
          !deleted && (
            <>
              <Button type="danger" ghost onClick={resetLocation} style={{ marginRight: 10 }}>
                {t('locationCorrect')}
              </Button>
              <Button type="shade" onClick={openModal}>
                {t('edit')}
              </Button>
            </>
          )
        }
      >
        <StaticField label={t('name')} history={oldValue["name"]}>{baby.name}</StaticField>
        <StaticField label={t('gender')} history={oldValue["gender"] && Gender[oldValue["gender"]]}>{Gender[baby.gender]}</StaticField>
        <StaticField label={t('growthStage')}>
          {BabyStage[baby.stage]} {baby.days} {t('unit.day', { ns: "common" })}
        </StaticField>

        {baby.stage === "EDC" ? (
          <StaticField label={t('dueDay')} history={oldValue["edc"]} >{moment(baby.edc).format("YYYY-MM-DD")}</StaticField>
        ) : (
          <>
            <StaticField label={t('birthDay')} history={oldValue["birthday"]}>{moment(baby.birthday).format("YYYY-MM-DD")}</StaticField>
            <StaticField label={t('supplementaryFood')} history={typeof oldValue["assistedFood"] === 'boolean' && (oldValue["assistedFood"] ? t('add') : t('noAdd'))}>{baby.assistedFood ? t('add') : t('noAdd')}</StaticField>
            <StaticField label={t('feedingMethods')} history={oldValue["feedingPattern"] && FeedingPattern[oldValue["feedingPattern"]]}>{FeedingPattern[baby.feedingPattern]}</StaticField>
          </>
        )}

        <StaticField label={t('area')} history={oldValue["area"]}>{baby.area}</StaticField>
        <StaticField label={t('address')} history={oldValue["location"]}>{baby.location}</StaticField>

        <StaticField
          label={t('latAndLong')}
          history={
            oldValue["longitude"] || oldValue["latitude"]
              ? `${oldValue["longitude"] || baby["longitude"]}，${oldValue["latitude"] || baby["latitude"]}`
              : ""
          }
        >
          {baby.longitude && `${baby.longitude}，${baby.latitude}`}
        </StaticField>
        <StaticField label={t('comments')} history={oldValue["remark"]}>{baby.remark}</StaticField>
        {deleted && <StaticField label={t('archiveReason')}>{baby.closeAccountReason}</StaticField>}
      </Card>

      <Carers babyId={id} deleted={deleted} onModify={refreshCareModifyRecords} />
      <Visits babyId={id} />
      <History title={t('babyInfoChangeRecord')} columnValues={{
        chw: t('chw'),
        name: t('name'),
        gender: t('gender'),
        edc: t('edc'),
        birthday: t('birthDay'),
        assistedFood: t('supplementaryFood'),
        feedingPattern: t('feedingMethods'),
        area: t('area'),
        location: t('address'),
        longitude: t('longitude'),
        latitude: t('latitude'),
        remark: t('comments')
      }} dataSource={dataSource.map((e, i) => ({ ...e, number: i }))} />
      <History title={t('caregiverInfoChangeRecord')} columnValues={{
        master: t('master'),
        name: t('name'),
        phone: t('phone'),
        wechat: t('wechat'),
        familyTies: t('relatives'),
      }} dataSource={careModifyRecords.map((e, i) => ({ ...e, number: i }))} />

      <BabyModalForm
        width={650}
        title={t('modifyBaby')}
        visible={visible}
        onCancel={closeModal}
        onFinish={handleChangeBaby}
        initialValues={initialValues()}
        // 一旦进入婴幼期则不可修改回待产期
        disableStage={baby.stage === "BIRTH"}
        validateMessages={t('validateMessages', { ns: "common", returnObjects: true })}
      />
    </>
  );
}

const PageAssignChwModalTable = WithPage(AssignModalTable, "/admin/users/chw");

function RevertAccountBabyModal({ visible, onCancel, onOk }) {
  const { t } = useTranslation("baby");
  return (
    <Modal
      title={t('reactiveBaby')}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost type="danger" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="danger" onClick={onOk}>
            {t('reactive')}
          </Button>
        </Space>
      }
      visible={visible}
    >
      <p>{t('reactiveBabyConfirm')}</p>
    </Modal>
  );
}

function CloseAccountBabyModal({ visible, onCancel, onOk }) {
  const { t } = useTranslation(["baby", "common"]);
  const [form] = Form.useForm();

  return (
    <Modal
      title={t('archiveBaby')}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost type="danger" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="danger" onClick={form.submit}>
            {t('archive')}
          </Button>
        </Space>
      }
      visible={visible}
    >
      <p>{t('archiveTip')}</p>
      <Form form={form} onFinish={onOk} labelCol={{ span: 0 }}>
        <Form.Item label={t('archiveReason')} name="reason" rules={Rules.Required}>
          <Input style={{ width: "100%" }} placeholder={`${t('enter', { ns: 'common' })}${t('archiveReason')}`} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function ApproveDeleteBabyModal({ visible, onCancel, onFinish }) {
  const { t } = useTranslation("baby");
  return (
    <Modal
      title={t('archiveBabyTitle')}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost type="danger" onClick={onCancel}>
            {t('later')}
          </Button>
          <Button type="danger" onClick={onFinish}>
            {t('approve')}
          </Button>
        </Space>
      }
      visible={visible}
    >
      <p>
        {t('approveArchiveTip')}
      </p>
    </Modal>
  );
}

function ApproveModifyBabyModal({ visible, onCancel, onFinish }) {
  const { t } = useTranslation("baby");
  return (
    <Modal
      title={t('modifyBabyTitle')}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost type="danger" onClick={onCancel}>
            {t('later')}
          </Button>
          <Button type="danger" onClick={onFinish}>
            {t('approve')}
          </Button>
        </Space>
      }
      visible={visible}
    >
      <p>{t('approveModifyTip')}</p>
    </Modal>
  );
}

function ApproveCreateBabyModal({ id, onCancel, onFinish, ...props }) {
  const { t } = useTranslation(["baby", "common"]);
  const [form] = Form.useForm();
  useEffect(() => {
    props.visible && form.resetFields();
  }, [props, form]);

  return (
    <Modal
      title={t('batchNewBabiesTitle')}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost type="danger" onClick={onCancel}>
            {t('later')}
          </Button>
          <Button type="danger" onClick={form.submit}>
            {t('approve')}
          </Button>
        </Space>
      }
      {...props}
    >
      <p>
        {t('batchNewBabiesTip')}
      </p>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 0 }}>
        <Form.Item label={t('id')} name="identity" rules={Rules.Required}>
          <Input autoFocus style={{ width: "100%" }} placeholder={`${t('enter', { ns: 'common' })}${t('id')}`} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function Visits({ babyId }) {
  const { t } = useTranslation("baby");
  const [dataSource] = useFetch(`/admin/babies/${babyId}/visits`, {}, []);

  return (
    <Card title={t('visitHistory')} noPadding>
      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t('visitStatus'),
            dataIndex: "status",
            width: 140,
            align: "center",
            render: (h) => VisitStatus[h],
          },
          {
            title: t('visitTime'),
            dataIndex: "visitTime",
            width: 280,
            render: (h) => Visit.formatDateTimeCN(h),
          },
          {
            title: t('sessionContent'),
            dataIndex: "lesson",
            width: 300,
            render: (h) => h?.modules?.map((m) => m.label).join(", "),
          },
          {
            title: t('reasonOfUncompleteOrExpired'),
            dataIndex: "remark",
          },
          {
            title: t('locationInfo'),
            dataIndex: "distance",
            render: (v) => t('homeVisitDistance', { distance: v || 0 })
          }
        ]}
      />
    </Card>
  );
}

function History({ title, dataSource, columnValues }) {
  const { t } = useTranslation(["baby", "common", "enum"]);

  function getValue(key, value) {
    switch (key) {
      case 'gender':
        return Gender[value];
      case 'assistedFood':
        return value ? t('AssistedFood.TRUE', { ns: "enum" }) : t('AssistedFood.FALSE', { ns: "enum" });
      case 'feedingPattern':
        return FeedingPattern[value];
      case 'master':
        return value ? t('yes') : t('no');
      case 'familyTies':
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
            title: t('time'),
            dataIndex: "lastModifiedAt",
            width: 200,
            align: "center",
            render: (h) => moment(h).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: t('content'),
            dataIndex: "newValue",
            render: (h, record) => {
              const { columnName, newValue, oldValue, roleName, userName } = record;
              const changeValues = (columnName || []).filter(e => e !== "chw").map((e, i) => {
                return columnValues[e] ? {
                  columnName: columnValues[e],
                  oldValue: getValue(e, oldValue[i]),
                  newValue: getValue(e, newValue[i]),
                } : null;
              }).filter(e => !!e)
              return (
                <div>
                  {changeValues.map((e, i) => {
                    const obj = e || {}
                    return (
                      <div key={i}>
                        <BlobFont>{`${roleName} ${userName}`}</BlobFont>{t('changed')}<BlobFont>{obj.columnName}</BlobFont>{t('from')}<BlobFont>{obj.oldValue}</BlobFont>{t('to')}<BlobFont>{obj.newValue}</BlobFont>；
                      </div>
                    )
                  })}
                </div>
              )
            }
          }
        ]}
      />
    </Card>
  );
}

function Carers({ babyId, deleted, onModify }) {
  const { t } = useTranslation("baby");
  const [carer, setCarer] = useState({ master: false });
  const [visible, openModal, closeModal] = useBoolState(false);
  const [dataSource, refresh] = useFetch(`/admin/babies/${babyId}/carers`, {}, []);

  const openCarerEdit = (record) => {
    setCarer(record);
    openModal();
  };

  const safeCloseCarer = () => {
    setCarer({ master: false });
    closeModal();
  };

  async function handleDelete({ id, master }) {
    if (master) return message.warn(t('deleteMasterWarning'));
    await Axios.delete(`/admin/carers/${id}`);
    refresh();
  }

  async function submit(values) {
    const { id } = carer;
    const method = id ? "put" : "post";
    await Axios[method](`/admin/carers${id ? `/${id}` : ""}`, {
      baby: {
        id: babyId,
      },
      ...values,
    });
    refresh();
    safeCloseCarer();
    if (id) {
      onModify && onModify()
    }
  }

  function onFinish(values) {
    if (values.master && dataSource.filter((item) => item.id !== carer.id).find((item) => item.master)) {
      Modal.confirm({
        title: t('confirm'),
        icon: <ExclamationCircleOutlined />,
        content: t('changeMasterConfirm'),
        cancelText: t('cancel'),
        okText: t('proceed'),
        onOk: () => submit(values),
      });
      return;
    }
    submit(values);
  }

  return (
    <Card
      title={t('caregiverList')}
      noPadding
      extra={
        !deleted && (
          <>
            {dataSource.length > 3 ? (
              <Tooltip title={t('maxTo4Caregiver')}>
                <Button disabled={true} type="shade">
                  {t('newCaregiver')}
                </Button>
              </Tooltip>
            ) : (
              <Button onClick={openModal} type="shade" data-testid="add-carer">
                {t('newCaregiver')}
              </Button>
            )}
          </>
        )
      }
    >
      <ModalForm
        width={650}
        labelWidth={120}
        title={carer.id ? t('editCaregiver') : t('newCaregiver')}
        initialValues={carer}
        visible={visible}
        onCancel={safeCloseCarer}
        onFinish={onFinish}
        validateMessages={t('validateMessages', { ns: "common", returnObjects: true })}
      >
        <Form.Item label={t('master')} name="master" rules={Rules.Required}>
          <Radio.Group>
            <Radio value={true}>{t('yes')}</Radio>
            <Radio value={false}>{t('no')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('name')} name="name" rules={Rules.RealName}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          label={t('relatives')}
          name="familyTies"
          rules={[
            ...Rules.Required,
            () => ({
              validator: (_, value) => {
                if (
                  !value ||
                  !dataSource.filter((item) => item.id !== carer.id).find((item) => item.familyTies === value)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(t('repeatRelatives'));
              },
            }),
          ]}
        >
          <SelectEnum name="FamilyTies" />
        </Form.Item>
        <Form.Item label={t('contactPhone')} name="phone" rules={Rules.Phone}>
          <Input />
        </Form.Item>
        <Form.Item label={t('wechat')} name="wechat">
          <Input />
        </Form.Item>
      </ModalForm>

      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t('master'),
            dataIndex: "master",
            width: 140,
            align: "center",
            render(h) {
              return h ? t('yes') : t('no');
            },
          },
          {
            title: t('caregiverName'),
            dataIndex: "name",
          },
          {
            title: t('relatives'),
            dataIndex: "familyTies",
            render: (h) => FamilyTies[h],
          },
          {
            title: t('contactPhone'),
            dataIndex: "phone",
          },
          {
            title: t('wechat'),
            dataIndex: "wechat",
          },
          {
            title: t('operation'),
            dataIndex: "id",
            width: 200,
            align: "center",
            render(_, record) {
              return (
                !deleted && (
                  <Space>
                    <DeleteConfirmModal
                      title={t('deleteCaregiver')}
                      content={t('deleteCaregiverConfirm')}
                      onConfirm={() => handleDelete(record)}
                    >
                      <Button size="small" type="link">
                        {t('delete')}
                      </Button>
                    </DeleteConfirmModal>
                    <Button size="small" type="link" onClick={() => openCarerEdit(record)}>
                      {t('edit')}
                    </Button>
                  </Space>
                )
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
`