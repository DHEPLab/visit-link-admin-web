import { useEffect, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import { Button, Col, Form, Input, message, Row, Space } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Factory from "@/components/curriculum/factory";
import ModuleComponents from "@/components/curriculum/ModuleComponents";
import Rules from "@/constants/rules";
import { ModuleTopic, QrType } from "@/constants/enums";
import Card from "@/components/Card";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import DetailHeader from "@/components/DetailHeader";
import DraftBar from "@/components/DraftBar";
import SelectEnum from "@/components/SelectEnum";
import { QRCodeSVG } from "qrcode.react";
import usePrompt from "@/hooks/usePrompt";
import styled from "styled-components";
import { useModuleStore } from "@/store/module";
import ReadonlyForm from "./ReadonlyForm";
import { ModuleResponse, ModuleComponentType } from "@/models/res/Moduel";
import { FormikHandlers } from "formik/dist/types";

const CustomSelectorWrapper = styled.div`
  .ant-select.module-topic-selector .ant-select-selector {
    width: 560px;
  }
`;

interface ModuleInformationFormValues {
  id?: string;
  description: string;
  name: string;
  number: string;
  topic: keyof typeof ModuleTopic;
}

export default function Module() {
  const { t } = useTranslation(["module", "error"]);
  const { id } = useParams();
  const { pathname } = useLocation();
  const [readonly, setReadonly] = useState<boolean>(true);
  const navigate = useNavigate();
  const moduleFinishActionOptions = useModuleStore((state) => state.moduleFinishActionOptions);

  const [isPrompt, setIsPrompt] = useState(true);
  const [form] = Form.useForm();
  const [title, setTitle] = useState(t("createNewModule"));
  const [submitURL, setSubmitURL] = useState<string>("");

  const [module, setModule] = useState<ModuleResponse>({} as ModuleResponse);
  const [components, setComponents] = useState<ModuleComponentType[]>([]);

  const [draftId, setDraftId] = useState<string>("");
  const [draftDate, setDraftDate] = useState<string>("");
  const mode = (() => {
    const routes = {
      "/modules/edit": "edit",
      "/modules/copy": "copy",
      "/modules/create": "create",
    };

    return Object.entries(routes).find(([key]) => pathname.includes(key))?.[1] || "view";
  })();

  useEffect(() => {
    setReadonly(
      !pathname.includes("/modules/edit") &&
        !pathname.includes("/modules/create") &&
        !pathname.includes("/modules/copy"),
    );
  }, [pathname, setReadonly]);

  useEffect(() => {}, [components]);

  useEffect(() => {
    if (readonly == null) return;

    if (!id) {
      setComponents([Factory.createText()]);
    } else {
      axios.get<ModuleResponse>(`/admin/modules/${id}`).then(({ data, headers }) => {
        const formValue = pathname.includes("/modules/edit")
          ? data
          : {
              ...data,
              id: null,
              name: `${data.name}（1）`,
              number: `${data.number}-1`,
            };
        if (!readonly) form.setFieldsValue(formValue);
        setModule(data);
        setTitle(data.name);
        setComponents(data.components);
        setDraftId(headers["x-draft-id"]);
        setDraftDate(headers["x-draft-date"]);
      });
    }

    axios
      .get("/admin/modules", {
        params: {
          size: 1000,
          published: true,
        },
      })
      .then((response) => moduleFinishActionOptions(response.data));
  }, [id, form, readonly, pathname, moduleFinishActionOptions]);

  function onSubmitFormik(values: { components: ModuleComponentType[] }) {
    setComponents(values.components);
    form.submit();
  }

  function submitDraft(submit: FormikHandlers["handleSubmit"]) {
    setSubmitURL("/admin/modules/draft");
    submit();
    setIsPrompt(false);
  }

  function submitPublish(submit: FormikHandlers["handleSubmit"]) {
    setSubmitURL("/admin/modules");
    submit();
    setIsPrompt(false);
  }

  function isValidComponent(comp: ModuleComponentType) {
    if (comp.type === "Media" && !comp.value.file) {
      message.warning(t("emptyMedia", { ns: "error" }));
      return false;
    }
    if (comp.type !== "Switch") {
      return true;
    }
    const { cases } = comp.value;
    if (cases.length === 0) {
      return true;
    }
    for (let i = 0; i < cases.length; i++) {
      const comps = cases[i].components;
      for (let j = 0; j < comps.length; j++) {
        if (!isValidComponent(comps[j])) {
          return false;
        }
      }
    }
    return true;
  }

  function onSubmit(values: ModuleInformationFormValues) {
    if (components.length === 0) return message.warning(t("atLeastOneComponent"));
    for (let i = 0; i < components.length; i++) {
      const comp = components[i];
      if (!isValidComponent(comp)) {
        return;
      }
    }
    const isEdit = pathname.includes("/modules/edit");
    axios
      .post(submitURL, {
        id: isEdit ? id : null,
        components,
        ...values,
      })
      .then(() => {
        if (isEdit) {
          navigate(-1);
        } else {
          navigate("/modules");
        }
      });
  }

  function handleDeleteDraft() {
    axios.delete(`/admin/modules/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteModule() {
    axios.delete(`/admin/modules/${id}`).then(() => {
      navigate(-1);
    });
  }

  function copy() {
    navigate(`/modules/copy/${id}`);
  }

  usePrompt({
    message: t("unsavedChangesWarning"),
    when: ({ currentLocation, nextLocation }) => {
      const gotoEditPage = nextLocation.pathname.startsWith("/modules/edit/");
      return isPrompt && currentLocation.pathname !== nextLocation.pathname && !(gotoEditPage || readonly);
    },
  });

  if (!components || components.length === 0) {
    return null;
  }
  return (
    <Formik initialValues={{ components }} onSubmit={onSubmitFormik}>
      {({ values, handleSubmit }) => (
        <>
          <DetailHeader
            icon="iconmodule-primary"
            menu={t("moduleManagement")}
            title={title}
            extra={
              <Space size="large">
                {readonly ? (
                  <>
                    {id && (
                      <Button ghost danger onClick={copy}>
                        {t("copyMoudle")}
                      </Button>
                    )}
                    {id && (
                      <DeleteConfirmModal
                        title={t("deleteModule")}
                        content={t("deleteModuleWarning")}
                        onConfirm={handleDeleteModule}
                        cancelText={t("cancelDeleteModule")}
                      >
                        <Button ghost danger>
                          {t("deleteModule")}
                        </Button>
                      </DeleteConfirmModal>
                    )}
                    {!draftId && (
                      <Button danger type="primary" onClick={() => navigate(`/modules/edit/${id}`)}>
                        {t("editModule")}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button ghost danger onClick={() => submitDraft(handleSubmit)}>
                      {t("saveToDraft")}
                    </Button>
                    <Button danger type="primary" onClick={() => submitPublish(handleSubmit)}>
                      {t("saveAndPublish")}
                    </Button>
                  </>
                )}
              </Space>
            }
          ></DetailHeader>

          {draftId && (
            <DraftBar
              title={t("unpublishedDraft")}
              lastModifiedDraftAt={draftDate}
              onRemove={handleDeleteDraft}
              onClick={() => navigate(`/modules/edit/${draftId}`)}
            />
          )}

          <Card title={t("moduleInformation")}>
            <Row>
              <Col span={18}>
                {readonly ? (
                  <ReadonlyForm value={module} />
                ) : (
                  <Form data-testid="basic-form" labelCol={{ span: 6 }} form={form} onFinish={onSubmit}>
                    <Form.Item
                      label={t("moduleName")}
                      name="name"
                      rules={[...Rules.Required, { max: 40, message: t("moduleNameTooLong") }]}
                    >
                      <Input placeholder={t("enterModuleNameWithLimit")} style={{ width: 560 }} />
                    </Form.Item>
                    <Form.Item
                      label={t("moduleNumber")}
                      name="number"
                      rules={[...Rules.Required, { max: 20, message: t("moduleNumberTooLong") }]}
                    >
                      <Input placeholder={t("enterModuleNumberWithLimit")} style={{ width: 560 }} />
                    </Form.Item>
                    <Form.Item
                      label={t("moduleDescription")}
                      name="description"
                      rules={[...Rules.Required, { max: 200, message: t("moduleDescriptionTooLong") }]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder={t("enterModuleDescriptionWithLimit")}
                        style={{ width: 560 }}
                      />
                    </Form.Item>
                    <CustomSelectorWrapper>
                      <Form.Item
                        label={t("moduleTheme")}
                        name="topic"
                        rules={[...Rules.Required, { message: t("selectModuleTheme") }]}
                      >
                        <SelectEnum
                          name="ModuleTopic"
                          placeholder={t("selectModuleTheme")}
                          style={{ width: 560 }}
                          className={"module-topic-selector"}
                        />
                      </Form.Item>
                    </CustomSelectorWrapper>
                  </Form>
                )}
              </Col>
              <Col span={6}>
                {readonly && (
                  <>
                    <div style={{ fontSize: 14 }}>
                      {t("loginApp")} -&gt; {t("myAccount")} -&gt; {t("scan")}
                    </div>
                    <QRCodeSVG
                      value={JSON.stringify({ type: QrType.MODULE_ID, data: module.id })}
                      size={200}
                      fgColor="black"
                    />
                  </>
                )}
              </Col>
            </Row>
          </Card>

          <Card title={t("moduleContent")}>
            <ModuleComponents value={values.components} readonly={readonly} key={`model-component-${mode}`} />
          </Card>
        </>
      )}
    </Formik>
  );
}
