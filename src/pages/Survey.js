import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { Form, Space, Button, Input, message } from "antd";
import { useLocation, useHistory, useParams, Prompt } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Factory from "../components/curriculum/factory";
import { Rules } from "../constants/*";
import SurveyComponents from "../components/curriculum/SurveyComponents";
import { DraftBar, Card, DetailHeader, StaticField, DeleteConfirmModal } from "../components/*";
import { debounce } from "lodash";

export default function Survey() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation("survey");

  const [isPrompt, setIsPrompt] = useState(true);
  const [readonly, setReadonly] = useState();
  const [title, setTitle] = useState(t("createNewSurvey"));
  const [submitURL, setSubmitURL] = useState();

  const [form] = Form.useForm();
  const history = useHistory();

  const [module, setModule] = useState({});
  const [questions, setQuestions] = useState();
  const [stickyTop, setStickyTop] = useState(0);

  const [draftId, setDraftId] = useState();
  const [draftDate, setDraftDate] = useState();

  useEffect(() => {
    setReadonly(!pathname.includes("/surveys/edit") && !pathname.includes("/surveys/create"));
  }, [pathname, setReadonly]);

  useEffect(() => {
    if (readonly == null) return;

    if (!id) {
      setQuestions([Factory.createText()]);
    } else {
      Axios.get(`/admin/questionnaires/${id}`).then(({ data, headers }) => {
        if (!readonly) form.setFieldsValue(data);
        setModule(data);
        setTitle(data.name);
        setQuestions(data.questions.map((n, i) => ({ ...n, key: i })));
        setDraftId(headers["x-draft-id"]);
        setDraftDate(headers["x-draft-date"]);
      });
    }

    if (!readonly) {
      // A fixed value 687px that module component body offset top, can also use ref.current.offsetTop get this value
      return stickyScrollListener(422, setStickyTop);
    }
  }, [id, form, readonly, dispatch]);

  function onSubmitFormik(values) {
    setQuestions(values.questions);
    form.submit();
  }

  function submitDraft(submit, validateForm) {
    validateForm().then((r) => {
      const validateresult = r.questions || [];
      if (validateresult.length > 0) {
        message.warning(t("questionOrChoiceCannotBeEmpty"));
      }
    });
    setSubmitURL("/admin/questionnaires/draft");
    submit();
    setIsPrompt(false);
  }

  function submitPublish(submit, validateForm) {
    validateForm().then((r) => {
      const validateresult = r.questions || [];
      if (validateresult.length > 0) {
        message.warning(t("questionOrChoiceCannotBeEmpty"));
      }
    });
    setSubmitURL("/admin/questionnaires");
    submit();
    setIsPrompt(false);
  }

  function onSubmit(values) {
    if (questions.length === 0) return message.warn(t("atLeastOneQuestion"));

    Axios.post(submitURL, {
      id,
      questions,
      ...values,
    }).then(history.goBack);
  }

  function handleDelteDraft() {
    Axios.delete(`/admin/questionnaires/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteModule() {
    Axios.delete(`/admin/questionnaires/${id}`).then(() => {
      history.goBack();
    });
  }

  if (!questions) return null;

  return (
    <Formik initialValues={{ questions }} onSubmit={onSubmitFormik}>
      {({ values, handleSubmit, validateForm }) => (
        <>
          <Prompt
            when={isPrompt}
            message={(location) => {
              let isstop = location.pathname.startsWith("/surveys/edit/");
              if (isstop || readonly) {
                return true;
              } else {
                return t("unsavedChangesWarning");
              }
            }}
          />

          <DetailHeader
            icon="iconwenjuan-primary"
            menu={t("surveyManagement")}
            title={title}
            extra={
              <Space size="large">
                {readonly ? (
                  <>
                    {id && (
                      <DeleteConfirmModal
                        title={t("deleteSurvey")}
                        content={t("deleteSurveyWarning")}
                        onConfirm={handleDeleteModule}
                      >
                        <Button ghost type="danger">
                          {t("deleteSurvey")}
                        </Button>
                      </DeleteConfirmModal>
                    )}
                    {!draftId && (
                      <Button type="danger" onClick={() => history.push(`/surveys/edit/${id}`)}>
                        {t("editSurvey")}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button ghost type="danger" onClick={() => submitDraft(handleSubmit, validateForm)}>
                      {t("saveToDraft")}
                    </Button>
                    <Button type="danger" onClick={() => submitPublish(handleSubmit, validateForm)}>
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
              onClick={() => history.push(`/surveys/edit/${draftId}`)}
            />
          )}

          <Card title={t("surveyInformation")}>
            {readonly ? (
              <ReadonlyForm value={module} />
            ) : (
              <Form data-testid="basic-form" form={form} onFinish={onSubmit}>
                <Form.Item
                  label={t("surveyName")}
                  name="name"
                  rules={[{ required: true, message: t("enterSurveyName"), max: 40 }]}
                >
                  <Input placeholder={t("enterSurveyNameWithLimit")} />
                </Form.Item>
              </Form>
            )}
          </Card>

          <Card title={t("surveyContent")}>
            <SurveyComponents value={values.questions} readonly={readonly} stickyTop={stickyTop} />
          </Card>
        </>
      )}
    </Formik>
  );
}

function ReadonlyForm({ value }) {
  const { t } = useTranslation("survey");
  return (
    <div data-testid="readonly-form">
      <StaticField label={t("surveyName")}>{value.name}</StaticField>
    </div>
  );
}

function stickyScrollListener(offsetTop, onChangeStickyTop) {
  const onScroll = debounce((event) => {
    const diffTop = event.target.scrollTop - offsetTop;
    onChangeStickyTop(diffTop > 0 ? diffTop : 0);
  }, 100);
  document.getElementById("route-view").addEventListener("scroll", onScroll);
  return () => {
    document.getElementById("route-view").removeEventListener("scroll", onScroll);
  };
}
