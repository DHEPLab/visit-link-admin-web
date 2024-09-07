import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import useBoolState from "@/hooks/useBoolState";
import useFetch from "@/hooks/useFetch";
import { Button, Form, FormProps, Input, message, Modal, Radio, Space, Tooltip } from "antd";
import axios from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Card from "@/components/Card";
import ModalForm from "@/components/ModalForm";
import SelectEnum from "@/components/SelectEnum";
import ZebraTable from "@/components/ZebraTable";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Rules from "@/constants/rules";
import { FamilyTies } from "@/constants/enums";
import ShadeButton from "@/components/ShadeButton";
import { CarerFormValues } from "./schema/Carer";
import { Carer, CarersResponse } from "@/models/res/Carer";

interface CarersProps {
  babyId: number;
  deleted: boolean;
  onModify: VoidFunction;
}

const carerFormDefaultValues = {
  master: false,
} as CarerFormValues;

const Carers: React.FC<CarersProps> = ({ babyId, deleted, onModify }) => {
  const { t } = useTranslation("baby");

  const [carer, setCarer] = useState<CarerFormValues>(carerFormDefaultValues);
  const [visible, openModal, closeModal] = useBoolState(false);
  const [dataSource, refresh] = useFetch<CarersResponse>(`/admin/babies/${babyId}/carers`, {}, []);

  const openCarerEdit = (record: Carer) => {
    setCarer(record as CarerFormValues);
    openModal();
  };

  const safeCloseCarer = () => {
    setCarer(carerFormDefaultValues);
    closeModal();
  };

  async function handleDelete({ id, master }: Carer) {
    if (master) return message.warning(t("deleteMasterWarning"));
    await axios.delete(`/admin/carers/${id}`);
    refresh();
  }

  async function submit(values: CarerFormValues) {
    const { id } = carer;
    const method = id ? "put" : "post";
    await axios[method](`/admin/carers${id ? `/${id}` : ""}`, {
      baby: {
        id: babyId,
      },
      ...values,
    });
    refresh();
    safeCloseCarer();
    if (id) {
      onModify?.();
    }
  }

  function onFinish(values: CarerFormValues) {
    if (values.master && dataSource.filter((item) => item.id !== carer.id).find((item) => item.master)) {
      Modal.confirm({
        title: t("confirm"),
        icon: <ExclamationCircleOutlined />,
        content: t("changeMasterConfirm"),
        cancelText: t("cancel"),
        okText: t("proceed"),
        onOk: () => submit(values),
      });
      return;
    }
    submit(values);
  }

  const canNotAdd = dataSource.length > 3;

  return (
    <Card
      title={t("caregiverList")}
      noPadding
      extra={
        !deleted && (
          <>
            <Tooltip title={canNotAdd ? t("maxTo4Caregiver") : ""}>
              <ShadeButton onClick={openModal} disabled={canNotAdd} data-testid="add-carer">
                {t("newCaregiver")}
              </ShadeButton>
            </Tooltip>
          </>
        )
      }
    >
      <ModalForm
        width={650}
        title={carer.id ? t("editCaregiver") : t("newCaregiver")}
        initialValues={carer}
        visible={visible}
        onCancel={safeCloseCarer}
        onFinish={onFinish}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
      >
        <Form.Item label={t("master")} name="master" rules={Rules.Required}>
          <Radio.Group>
            <Radio value={true}>{t("yes")}</Radio>
            <Radio value={false}>{t("no")}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t("name")} name="name" rules={Rules.RealName}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          label={t("relatives")}
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
                return Promise.reject(t("repeatRelatives"));
              },
            }),
          ]}
        >
          <SelectEnum name="FamilyTies" />
        </Form.Item>
        <Form.Item label={t("contactPhone")} name="phone" rules={Rules.Phone}>
          <Input />
        </Form.Item>
        <Form.Item label={t("wechat")} name="wechat">
          <Input />
        </Form.Item>
      </ModalForm>

      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t("master"),
            dataIndex: "master",
            width: 140,
            align: "center",
            render(h) {
              return h ? t("yes") : t("no");
            },
          },
          {
            title: t("caregiverName"),
            dataIndex: "name",
          },
          {
            title: t("relatives"),
            dataIndex: "familyTies",
            render: (h) => FamilyTies[h as keyof typeof FamilyTies],
          },
          {
            title: t("contactPhone"),
            dataIndex: "phone",
          },
          {
            title: t("wechat"),
            dataIndex: "wechat",
          },
          {
            title: t("operation"),
            dataIndex: "id",
            width: 200,
            align: "center",
            render(_, record) {
              return (
                !deleted && (
                  <Space>
                    <DeleteConfirmModal
                      title={t("deleteCaregiver")}
                      content={t("deleteCaregiverConfirm")}
                      onConfirm={() => handleDelete(record)}
                    >
                      <Button size="small" type="link">
                        {t("delete")}
                      </Button>
                    </DeleteConfirmModal>
                    <Button size="small" type="link" onClick={() => openCarerEdit(record)}>
                      {t("edit")}
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
};

export default Carers;
