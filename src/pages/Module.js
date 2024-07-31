import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Formik } from "formik";
import { Form, Space, Button, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useHistory, useParams, Prompt } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Factory from "../components/curriculum/factory";
import ModuleComponents from "../components/curriculum/ModuleComponents";
import { Rules } from "../constants/*";
import { ModuleTopic } from "../constants/enums";
import { DraftBar, Card, DetailHeader, SelectEnum, StaticField, DeleteConfirmModal } from "../components/*";
import { moduleFinishActionOptions } from "../actions";

export default function Module() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [readonly, setReadonly] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation("module");

  const [isPrompt, setIsPrompt] = useState(true);
  const [form] = Form.useForm();
  const [title, setTitle] = useState(t("createNewModule"));
  const [submitURL, setSubmitURL] = useState();

  const [module, setModule] = useState({});
  const [components, setComponents] = useState();

  const [draftId, setDraftId] = useState();
  const [draftDate, setDraftDate] = useState();

  useEffect(() => {
    setReadonly(!pathname.includes("/modules/edit") && !pathname.includes("/modules/create"));
  }, [pathname, setReadonly]);

  useEffect(() => {
    if (readonly == null) return;

    if (!id) {
      setComponents([Factory.createText()]);
    } else {
      Axios.get(`/admin/modules/${id}`).then(({ data, headers }) => {
        if (!readonly) form.setFieldsValue(data);
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
  }, [id, form, readonly, dispatch]);

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

  function onSubmit(values) {
    if (components.length === 0) return message.warn(t("atLeastOneComponent"));

    Axios.post(submitURL, {
      id,
      components,
      ...values,
    }).then(history.goBack);
  }

  function handleDelteDraft() {
    Axios.delete(`/admin/modules/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteModule() {
    Axios.delete(`/admin/modules/${id}`).then(() => {
      history.goBack();
    });
  }

  if (!components) {
    return null;
  }

  return (
    <Formik initialValues={{ components }} onSubmit={onSubmitFormik}>
      {({ values, handleSubmit }) => (
        <>
          <Prompt
            when={isPrompt}
            message={(location) => {
              let isstop = location.pathname.startsWith("/modules/edit/");
              if (isstop || readonly) {
                return true;
              } else {
                return t("unsavedChangesWarning");
              }
            }}
          />
          <DetailHeader
            icon="iconmodule-primary"
            menu={t("moduleManagement")}
            title={title}
            extra={
              <Space size="large">
                {readonly ? (
                  <>
                    {id && (
                      <DeleteConfirmModal
                        title={t("deleteModule")}
                        content={t("deleteModuleWarning")}
                        onConfirm={handleDeleteModule}
                      >
                        <Button ghost type="danger">
                          {t("deleteModule")}
                        </Button>
                      </DeleteConfirmModal>
                    )}
                    {!draftId && (
                      <Button type="danger" onClick={() => history.push(`/modules/edit/${id}`)}>
                        {t("editModule")}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button ghost type="danger" onClick={() => submitDraft(handleSubmit)}>
                      {t("saveToDraft")}
                    </Button>
                    <Button type="danger" onClick={() => submitPublish(handleSubmit)}>
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
              onClick={() => history.push(`/modules/edit/${draftId}`)}
            />
          )}

          <Card title={t("moduleInformation")}>
            {readonly ? (
              <ReadonlyForm value={module} />
            ) : (
              <Form data-testid="basic-form" form={form} onFinish={onSubmit}>
                <Form.Item label={t("moduleName")} name="name" rules={[...Rules.Required, { max: 40 }]}>
                  <Input placeholder={t("enterModuleName")} />
                </Form.Item>
                <Form.Item label={t("moduleNumber")} name="number" rules={[...Rules.Required, { max: 20 }]}>
                  <Input placeholder={t("enterModuleNumber")} />
                </Form.Item>
                <Form.Item label={t("moduleDescription")} name="description" rules={[...Rules.Required, { max: 200 }]}>
                  <Input.TextArea rows={4} placeholder={t("enterModuleDescription")} />
                </Form.Item>
                <Form.Item label={t("moduleTheme")} name="topic" rules={Rules.Required}>
                  <SelectEnum name="ModuleTopic" placeholder={t("selectModuleTheme")} />
                </Form.Item>
              </Form>
            )}
          </Card>

          <Card title={t("moduleContent")}>
            <ModuleComponents value={values.components} readonly={readonly} />
          </Card>
        </>
      )}
    </Formik>
  );
}

function ReadonlyForm({ value }) {
  const { t } = useTranslation("module");
  return (
    <div data-testid="readonly-form">
      <StaticField label={t("moduleName")}>{value.name}</StaticField>
      <StaticField label={t("moduleNumber")}>{value.number}</StaticField>
      <StaticField label={t("moduleDescription")}>{value.description}</StaticField>
      <StaticField label={t("moduleTheme")}>{t(ModuleTopic[value.topic])}</StaticField>
    </div>
  );
}
