import { useEffect, useState } from "react";
import { Button, Modal, Popconfirm, Space } from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ContentHeader from "@/components/ContentHeader";
import ZebraTable from "@/components/ZebraTable";
import StatusTag from "@/components/StatusTag";
import ProjectModalForm, { ProjectFromValues } from "@/pages/Projects/ProjectModalForm";
import { Project, ProjectStatus } from "@/models/res/Project";

const EmptyProject = { name: "", status: 0 } as Project;
const NewProject = { name: "", status: 1 } as Project;

export default function Projects() {
  const { t } = useTranslation(["project", "menu", "common"]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formModal, setFormModal] = useState<{ visible: boolean; values: Project }>({
    visible: false,
    values: EmptyProject,
  });

  const openFormModal = (values: Project) => {
    setFormModal({ visible: true, values });
  };
  const closeFormModal = () => {
    setFormModal({ visible: false, values: EmptyProject });
  };
  const fetchProject = () => {
    axios.get<Project[]>("/admin/project/all").then(({ data }) => {
      setProjects(data);
    });
  };
  const onSubmit = (value: ProjectFromValues) => {
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
  const onUpdateProjectStatus = (id: number, status: ProjectStatus) => {
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
          <Button type="primary" onClick={() => openFormModal(NewProject)}>
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
            render(id: number, record: Project) {
              const title = record.status === 1 ? t("inactive") : t("active");
              return (
                <>
                  <Button type="link" size="small" onClick={() => openFormModal({ ...record })}>
                    {t("edit")}
                  </Button>
                  <Popconfirm
                    placement="leftTop"
                    title={`${t("confirm")} ${title}？`}
                    okText={t("confirm")}
                    cancelText={t("cancel")}
                    onConfirm={() => onUpdateProjectStatus(id, record.status === 1 ? 0 : 1)}
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
        visible={formModal.visible}
        initialValues={formModal.values}
        onCancel={closeFormModal}
        onFinish={onSubmit}
      />
    </>
  );
}
