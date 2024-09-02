import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Formik } from "formik";
import { Button, Col, Form, Input, message, Row, Space } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Factory from "../components/curriculum/factory";
import ModuleComponents from "../components/curriculum/ModuleComponents";
import Rules from "../constants/rules";
import { ModuleTopic, QrType } from "../constants/enums";
import { Card, DeleteConfirmModal, DetailHeader, DraftBar, SelectEnum, StaticField } from "../components";
import { moduleFinishActionOptions } from "../actions";
import { QRCodeSVG } from "qrcode.react";
import usePrompt from "@/hooks/usePrompt";
import styled from "styled-components";
import i18n from "@/i18n.js";

const CustomSelectorWrapper = styled.div`
  .ant-select.module-topic-selector .ant-select-selector {
    width: 560px;
  }
`;

export default function Module() {
  const { t } = useTranslation(["module", "error"]);
  const { id } = useParams();
  const { pathname } = useLocation();
  const [readonly, setReadonly] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isPrompt, setIsPrompt] = useState(true);
  const [form] = Form.useForm();
  const [title, setTitle] = useState(t("createNewModule"));
  const [submitURL, setSubmitURL] = useState();

  const [module, setModule] = useState({});
  const [components, setComponents] = useState([]);

  const [draftId, setDraftId] = useState();
  const [draftDate, setDraftDate] = useState();
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
      Axios.get(`/admin/modules/${id}`).then(({ data, headers }) => {
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

    Axios.get("/admin/modules", {
      params: {
        size: 1000,
        published: true,
      },
    }).then((response) => dispatch(moduleFinishActionOptions(response.data)));
  }, [id, form, readonly, pathname, dispatch]);

  function onSubmitFormik(values) {
    setComponents(values.components);
    form.submit();
  }

  function submitDraft(submit) {
    setSubmitURL("/admin/modules/draft");
    submit();
    setIsPrompt(false);
  }

  function submitPublish(submit) {
    setSubmitURL("/admin/modules");
    submit();
    setIsPrompt(false);
  }

  function isValidComponent(comp) {
    if (comp.type === "Media" && !comp.value.file) {
      message.warn(t("emptyMedia", { ns: "error" }));
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

  function onSubmit(values) {
    if (components.length === 0) return message.warn(t("atLeastOneComponent"));
    for (let i = 0; i < components.length; i++) {
      const comp = components[i];
      if (!isValidComponent(comp)) {
        return;
      }
    }
    const isEdit = pathname.includes("/modules/edit");
    Axios.post(submitURL, {
      id: isEdit ? id : null,
      components,
      ...values,
    }).then(() => {
      if (isEdit) {
        navigate(-1);
      } else {
        navigate("/modules");
      }
    });
  }

  function handleDelteDraft() {
    Axios.delete(`/admin/modules/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteModule() {
    Axios.delete(`/admin/modules/${id}`).then(() => {
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
              onRemove={handleDelteDraft}
              onClick={() => navigate(`/modules/edit/${draftId}`)}
            />
          )}

          <Card title={t("moduleInformation")}>
            <Row>
              <Col span={18}>
                {readonly ? (
                  <ReadonlyForm value={module} />
                ) : (
                  <Form
                    data-testid="basic-form"
                    labelCol={{ span: i18n.resolvedLanguage === "zh" ? 3 : 6 }}
                    form={form}
                    onFinish={onSubmit}
                  >
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
                    <Form.Item
                      label={t("moduleTheme")}
                      name="topic"
                      rules={[...Rules.Required, { message: t("selectModuleTheme") }]}
                    >
                      <CustomSelectorWrapper>
                        <SelectEnum
                          name="ModuleTopic"
                          placeholder={t("selectModuleTheme")}
                          style={{ width: 560 }}
                          className={"module-topic-selector"}
                        />
                      </CustomSelectorWrapper>
                    </Form.Item>
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

function ReadonlyForm({ value }) {
  const { t } = useTranslation("module");
  const labelWidth = i18n.resolvedLanguage === "zh" ? 80 : 150;
  return (
    <div data-testid="readonly-form">
      <StaticField label={t("moduleName")} labelStyle={{ width: labelWidth }}>
        {value.name}
      </StaticField>
      <StaticField label={t("moduleNumber")} labelStyle={{ width: labelWidth }}>
        {value.number}
      </StaticField>
      <StaticField label={t("moduleDescription")} labelStyle={{ width: labelWidth }}>
        {value.description}
      </StaticField>
      <StaticField label={t("moduleTheme")} labelStyle={{ width: labelWidth }}>
        {t(ModuleTopic[value.topic])}
      </StaticField>
    </div>
  );
}
