import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Popconfirm, Radio, Row, Space } from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Rules from "../constants/rules";
import { ProjectStatus } from "../constants/enums";
import ContentHeader from "../components/ContentHeader";
import ZebraTable from "../components/ZebraTable";
import StatusTag from "../components/StatusTag";
import ModalForm from "../components/ModalForm";
import styled from "@emotion/styled";

const Label = styled.label`
  display: inline-block;
  width: 100%;
  padding-right: 4px;
  text-align: end;
`;

export default function Projects() {
  const { t } = useTranslation("project", "menu", "common");
  const [projects, setProjects] = useState([]);
  const [formModal, setFormModal] = useState({
    visible: false,
    values: { status: 0 },
  });
  const openFormModal = (values) => {
    setFormModal({ visible: true, values });
  };
  const closeFormModal = () => {
    setFormModal({ visible: false, values: { status: 0 } });
  };
  const fetchProject = () => {
    axios.get("/admin/project/all").then(({ data }) => {
      setProjects(data);
    });
  };
  const onSubmit = (value) => {
    const { id } = formModal.values;
    const url = id ? `/admin/project/update/${id}` : "/admin/project/create";
    axios.post(url, value).then(({ data }) => {
      if (!id) {
        Modal.info({
          title: t("superadminCreatedTip"),
          content: (
            <div>
              <p>
                {t("user")}：{data.username}
              </p>
              <p>
                {t("password")}：{data.password}
              </p>
            </div>
          ),
          onOk() {},
        });
      }
      fetchProject();
      closeFormModal();
    });
  };
  const onUpdateStatus = (id, status) => {
    axios.post(`/admin/project/update/status/${id}`, { status }).then(() =>
      setProjects(
        projects.map((p) => {
          if (p.id === id) {
            return { ...p, status };
          }
          return p;
        }),
      ),
    );
  };
  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <>
      <ContentHeader title={t("projectManagement", { ns: "menu" })}>
        <Space size="large">
          <Button type="primary" onClick={() => openFormModal({ status: 1 })}>
            {t("createProject")}
          </Button>
        </Space>
      </ContentHeader>
      <ZebraTable
        dataSource={projects}
        pagination={false}
        rowKey="id"
        className="clickable"
        columns={[
          {
            title: t("projectStatus"),
            dataIndex: "status",
            width: 120,
            align: "center",
            render: (h) => <StatusTag value={h === 1} trueText={t("active")} falseText={t("inactive")} />,
          },
          {
            title: t("projectName"),
            dataIndex: "name",
          },
          {
            title: t("operation"),
            dataIndex: "id",
            width: 200,
            align: "center",
            render(id, v) {
              const title = v.status === 1 ? t("inactive") : t("active");
              return (
                <>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => openFormModal({ ...projects.find((p) => p.id === id) })}
                  >
                    {t("edit")}
                  </Button>
                  <Popconfirm
                    placement="leftTop"
                    title={`${t("confirm")} ${title}？`}
                    okText={t("confirm")}
                    cancelText={t("cancel")}
                    onConfirm={() => onUpdateStatus(id, v.status === 1 ? 0 : 1)}
                  >
                    <Button type="link" size="small" style={{ width: 50 }}>
                      {title}
                    </Button>
                  </Popconfirm>
                </>
              );
            },
          },
        ]}
      />
      <ProjectModalForm
        title={formModal.values?.id ? t("editProject") : t("createProject")}
        visible={formModal.visible}
        values={formModal.values}
        onCancel={closeFormModal}
        onFinish={onSubmit}
      />
    </>
  );
}

function ProjectModalForm({ visible, values, onCancel, onFinish }) {
  const { t } = useTranslation("project", "menu", "common");
  const [admin, setAdmin] = useState({});
  const fetchAdminByProjectId = (id) => {
    axios.get(`/admin/users/project/${id}`).then(({ data }) => setAdmin(data));
  };
  useEffect(() => {
    if (values?.id) {
      fetchAdminByProjectId(values.id);
    }
  }, [values?.id]);
  return visible ? (
    <ModalForm
      width={630}
      title={values?.id ? t("editProject") : t("createProject")}
      visible={visible}
      initialValues={values}
      onCancel={onCancel}
      onFinish={onFinish}
    >
      <Form.Item label={t("projectName")} name="name" rules={[...Rules.Required, { max: 20 }]}>
        <Input />
      </Form.Item>

      <Form.Item label={t("projectStatus")} name="status" rules={[...Rules.Required]}>
        <Radio.Group>
          {Object.keys(ProjectStatus).map((key) => (
            <Radio key={key} value={parseInt(key)}>
              {ProjectStatus[key]}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      {values?.id && (
        <>
          <Row>
            <Col span={6} flex={{}}>
              <Label>{t("adminUsername")}：</Label>
            </Col>
            <Col>{admin.name}</Col>
          </Row>
          <Row>
            <Col span={6}>
              <Label>{t("adminPassword")}：</Label>
            </Col>
            <Col>{admin.password}</Col>
          </Row>
        </>
      )}
    </ModalForm>
  ) : null;
}
