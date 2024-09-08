import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Form, Input, Radio, Row } from "antd";
import ModalForm from "@/components/ModalForm";
import Rules from "@/constants/rules";
import { ProjectStatus } from "@/constants/enums";
import styled from "@emotion/styled";
import { Admin } from "@/models/res/Admin";
import { Project } from "@/models/res/Project";
import { enumKeysIterator } from "@/utils/enumUtils";

export interface ProjectFromValues {
  name: string;
  status: number;
}

interface ProjectModalFormProp {
  visible: boolean;
  initialValues?: Project;
  onCancel: () => void;
  onFinish: (values: ProjectFromValues) => void;
}

const Label = styled.label`
  display: inline-block;
  width: 100%;
  padding-right: 4px;
  text-align: end;
`;

const ProjectModalForm: React.FC<ProjectModalFormProp> = ({ visible, initialValues, onCancel, onFinish }) => {
  const { t } = useTranslation(["project", "menu", "common"]);
  const [admin, setAdmin] = useState<Admin>({} as Admin);
  const fetchAdminByProjectId = (id: number) => {
    axios.get<Admin>(`/admin/users/project/${id}`).then(({ data }) => setAdmin(data));
  };
  useEffect(() => {
    if (initialValues?.id) {
      fetchAdminByProjectId(initialValues.id);
    }
  }, [initialValues?.id]);

  return visible ? (
    <ModalForm
      width={630}
      title={initialValues?.id ? t("editProject") : t("createProject")}
      visible={visible}
      initialValues={initialValues}
      onCancel={onCancel}
      onFinish={onFinish}
    >
      <Form.Item label={t("projectName")} name="name" rules={[...Rules.Required, { max: 20 }]}>
        <Input />
      </Form.Item>

      <Form.Item label={t("projectStatus")} name="status" rules={[...Rules.Required]}>
        <Radio.Group>
          {enumKeysIterator(ProjectStatus).map((key) => (
            <Radio key={key} value={parseInt(key)}>
              {ProjectStatus[key]}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      {initialValues?.id && (
        <>
          <Row>
            <Col span={6}>
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
};

export default ProjectModalForm;
