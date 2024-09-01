import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { Form, Space, Button, Input, message } from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Factory from "../components/curriculum/factory";
import SurveyComponents from "../components/curriculum/SurveyComponents";
import { DraftBar, Card, DetailHeader, StaticField, DeleteConfirmModal } from "../components";
import { debounce } from "lodash";
import Rules from "../constants/rules";
import usePrompt from "@/hooks/usePrompt";

export default function Survey() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("survey");

  const [isPrompt, setIsPrompt] = useState(true);
  const [readonly, setReadonly] = useState();
  const [title, setTitle] = useState(t("createNewSurvey"));
  const [submitURL, setSubmitURL] = useState();

  const [form] = Form.useForm();
  const navigate = useNavigate();

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
  }, [id, form, readonly, dispatch, i18n]);

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
    }).then(() => navigate(-1));
  }

  function handleDelteDraft() {
    Axios.delete(`/admin/questionnaires/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteModule() {
    Axios.delete(`/admin/questionnaires/${id}`).then(() => {
      navigate(-1);
    });
  }

  usePrompt({
    when: isPrompt,
    message: (location) => {
      const isStop = location.pathname.startsWith("/surveys/edit/");
      if (isStop || readonly) {
        return true;
      } else {
        return t("unsavedChangesWarning");
      }
    },
  });

  if (!questions) return null;

  return (
    <Formik initialValues={{ questions }} onSubmit={onSubmitFormik}>
      {({ values, handleSubmit, validateForm }) => (
        <>
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
                        <Button ghost danger>
                          {t("deleteSurvey")}
                        </Button>
                      </DeleteConfirmModal>
                    )}
                    {!draftId && (
                      <Button danger type="primary" onClick={() => navigate(`/surveys/edit/${id}`)}>
                        {t("editSurvey")}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button ghost danger onClick={() => submitDraft(handleSubmit, validateForm)}>
                      {t("saveToDraft")}
                    </Button>
                    <Button danger type="primary" onClick={() => submitPublish(handleSubmit, validateForm)}>
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
              onClick={() => navigate(`/surveys/edit/${draftId}`)}
            />
          )}

          <Card title={t("surveyInformation")}>
            {readonly ? (
              <ReadonlyForm value={module} />
            ) : (
              <Form
                data-testid="basic-form"
                form={form}
                onFinish={onSubmit}
                validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
              >
                <Form.Item
                  label={t("surveyName")}
                  name="name"
                  rules={[...Rules.Required, { message: t("enterSurveyNameWithLimit"), max: 40 }]}
                >
                  <Input placeholder={t("enterSurveyName")} />
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
