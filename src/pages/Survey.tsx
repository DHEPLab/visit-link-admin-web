import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, FormikHandlers, FormikHelpers } from "formik";
import { Button, Form, FormProps, Input, message, Space } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SurveyFactory from "@/components/survey/surveyFactory";
import SurveyComponents from "@/components/survey/SurveyComponents";
import DraftBar from "@/components/DraftBar";
import Card from "@/components/Card";
import DetailHeader from "@/components/DetailHeader";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Rules from "../constants/rules";
import usePrompt from "@/hooks/usePrompt";
import ReadonlyForm from "@/components/ReadonlyForm";
import { stickyScrollListener } from "@/utils/domUtils";
import { SurveyComponentType } from "@/models/res/Survey";
import { Questionnaire } from "@/models/res/Questionnaire";

interface BasicFromValue {
  name: string;
}

interface QuestionsFromValue {
  questions: SurveyComponentType[];
}

export default function Survey() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation("survey");

  const [isPrompt, setIsPrompt] = useState<boolean>(true);
  const [readonly, setReadonly] = useState<boolean>(true);
  const [title, setTitle] = useState(t("createNewSurvey"));
  const [submitURL, setSubmitURL] = useState<string>("");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [module, setModule] = useState<Questionnaire>({} as Questionnaire);
  const [questions, setQuestions] = useState<SurveyComponentType[]>();
  const [stickyTop, setStickyTop] = useState(0);

  const [draftId, setDraftId] = useState<string>("");
  const [draftDate, setDraftDate] = useState<string>("");

  useEffect(() => {
    setReadonly(!pathname.includes("/surveys/edit") && !pathname.includes("/surveys/create"));
  }, [pathname, setReadonly]);

  useEffect(() => {
    if (readonly == null) return;
    let abortController: AbortController;

    if (!id) {
      setQuestions([SurveyFactory.createQuestionText()]);
    } else {
      abortController = new AbortController();
      axios
        .get<Questionnaire>(`/admin/questionnaires/${id}`, { signal: abortController.signal })
        .then(({ data, headers }) => {
          if (!readonly) form.setFieldsValue(data);
          setModule(data);
          setTitle(data.name);
          setQuestions(data.questions.map((n, i) => ({ ...n, key: i })));
          setDraftId(headers["x-draft-id"]);
          setDraftDate(headers["x-draft-date"]);
        })
        .catch((error) => {
          if (!axios.isCancel(error)) {
            throw error;
          }
        });
    }

    if (!readonly) {
      // A fixed value 687px that module component body offset top, can also use ref.current.offsetTop get this value
      return stickyScrollListener(422, setStickyTop);
    }

    return () => abortController?.abort();
  }, [id, form, readonly, i18n]);

  function onSubmitFormik(values: QuestionsFromValue) {
    setQuestions(values.questions);
    form.submit();
  }

  function submitDraft(
    handleSubmit: FormikHandlers["handleSubmit"],
    validateForm: FormikHelpers<QuestionsFromValue>["validateForm"],
  ) {
    validateForm().then((result) => {
      const validQuestions = result.questions || [];
      if (validQuestions.length > 0) {
        message.warning(t("questionOrChoiceCannotBeEmpty"));
      }
    });
    setSubmitURL("/admin/questionnaires/draft");
    handleSubmit();
    setIsPrompt(false);
  }

  function submitPublish(
    handleSubmit: FormikHandlers["handleSubmit"],
    validateForm: FormikHelpers<QuestionsFromValue>["validateForm"],
  ) {
    validateForm().then((result) => {
      const validQuestions = result.questions || [];
      if (validQuestions.length > 0) {
        message.warning(t("questionOrChoiceCannotBeEmpty"));
      }
    });
    setSubmitURL("/admin/questionnaires");
    handleSubmit();
    setIsPrompt(false);
  }

  function onSubmit(values: BasicFromValue) {
    if (questions?.length === 0) return message.warning(t("atLeastOneQuestion"));

    axios
      .post(submitURL, {
        id,
        questions,
        ...values,
      })
      .then(() => navigate(-1));
  }

  function handleDeleteDraft() {
    axios.delete(`/admin/questionnaires/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteModule() {
    axios.delete(`/admin/questionnaires/${id}`).then(() => {
      navigate(-1);
    });
  }

  usePrompt({
    message: t("unsavedChangesWarning"),
    when: ({ currentLocation, nextLocation }) => {
      const gotoEditPage = nextLocation.pathname.startsWith("/surveys/edit/");
      return isPrompt && currentLocation.pathname !== nextLocation.pathname && !(gotoEditPage || readonly);
    },
  });

  const readonlyFormFields = readonly
    ? [
        {
          label: t("surveyName"),
          value: module.name,
        },
      ]
    : [];

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
                        cancelText={t("cancelDeleteSurvey")}
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
              onRemove={handleDeleteDraft}
              onClick={() => navigate(`/surveys/edit/${draftId}`)}
            />
          )}

          <Card title={t("surveyInformation")}>
            {readonly ? (
              <ReadonlyForm fields={readonlyFormFields} />
            ) : (
              <Form
                data-testid="basic-form"
                form={form}
                onFinish={onSubmit}
                validateMessages={
                  t("validateMessages", {
                    ns: "common",
                    returnObjects: true,
                  }) as FormProps["validateMessages"]
                }
              >
                <Form.Item
                  label={t("surveyName")}
                  name="name"
                  rules={[...Rules.Required, { message: t("enterSurveyNameWithLimit"), max: 40 }]}
                >
                  <Input placeholder={t("enterSurveyName")} style={{ width: 560 }} />
                </Form.Item>
              </Form>
            )}
          </Card>

          <Card title={t("surveyContent")}>
            <SurveyComponents questions={values.questions} readonly={readonly} stickyTop={stickyTop} />
          </Card>
        </>
      )}
    </Formik>
  );
}
