import { CurriculumResponse } from "@/models/res/Curriculum";
import { LessonFormValue } from "@/pages/Curriculum/schema/Lesson";
import { ScheduleFormValue } from "@/pages/Curriculum/schema/Schedule";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormProps, Input, message, Space } from "antd";

import Rules from "@/constants/rules";
import { cleanInvalidLessons } from "./utils";
import Card from "@/components/Card";
import DetailHeader from "@/components/DetailHeader";
import DraftBar from "@/components/DraftBar";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useTranslation } from "react-i18next";
import usePrompt from "@/hooks/usePrompt";
import Schedules from "./Schedules";
import Lessons from "./Lessons";
import ReadonlyForm from "@/components/ReadonlyForm";

type CurriculumBasicInfoFormValues = {
  name: string;
  description: string;
};

const Curriculum: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { t } = useTranslation("curriculum");

  const [isPrompt, setIsPrompt] = useState(true);
  const [readonly, setReadonly] = useState(true);
  const [title, setTitle] = useState(t("createNewCurriculum"));
  const [submitURL, setSubmitURL] = useState("");

  const [form] = Form.useForm();
  const [curriculum, setCurriculum] = useState<CurriculumResponse>({} as CurriculumResponse);
  const [lessons, setLessons] = useState<LessonFormValue[]>([]);
  const [schedules, setSchedules] = useState<ScheduleFormValue[]>([]);

  const [draftId, setDraftId] = useState("");
  const [draftDate, setDraftDate] = useState("");

  useEffect(() => {
    setReadonly(!pathname.includes("/curriculums/edit") && !pathname.includes("/curriculums/create"));
  }, [pathname, setReadonly]);

  useEffect(() => {
    if (readonly == null || !id) return;
    const abortController = new AbortController();
    axios
      .get<CurriculumResponse>(`/admin/curriculums/${id}`, { signal: abortController.signal })
      .then(({ data, headers }) => {
        if (!readonly) form.setFieldsValue(data);
        setTitle(data.name);
        setDraftId(headers["x-draft-id"]);
        setDraftDate(headers["x-draft-date"]);
        //todo rename all lesson into session
        setLessons(data.sessions.map((n) => ({ ...n, questionnaire: n.questionnaire?.id }) satisfies LessonFormValue));
        setSchedules(data.schedules);
        setCurriculum({ ...data, sessions: [], schedules: [] });
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          throw error;
        }
      });

    return () => abortController.abort();
  }, []);

  function submitDraft() {
    setSubmitURL("/admin/curriculums/draft");
    form.submit();
    setIsPrompt(false);
  }

  function submitPublish() {
    setSubmitURL("/admin/curriculums");
    form.submit();
    setIsPrompt(false);
  }

  function validate() {
    if (lessons.length === 0) {
      message.warning(t("atLeastOneSession"));
      return false;
    }
    if (schedules.length === 0) {
      message.warning(t("atLeastOneMatchingPlan"));
      return false;
    }
    for (const schedule of schedules) {
      if (!schedule.lessons || schedule.lessons.length === 0) {
        message.warning(t("matchingPlanAtLeastOneSession", { name: schedule.name }));
        return false;
      }
    }
    return true;
  }

  function onFinish(values: CurriculumBasicInfoFormValues) {
    if (!validate()) return;
    const lessonResult = lessons.map((n) => ({
      ...n,
      questionnaire: n.questionnaire ? { id: n.questionnaire } : null,
    }));
    axios
      .post(submitURL, {
        id,
        ...values,
        sessions: lessonResult,
        schedules,
      })
      .then(() => navigate(-1));
  }

  function handleDeleteDraft() {
    axios.delete(`/admin/curriculums/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteCurriculum() {
    axios.delete(`/admin/curriculums/${id}`).then(() => {
      navigate(-1);
    });
  }

  function onChangeLessons(lessonFormValues: LessonFormValue[]) {
    setLessons(lessonFormValues);
    setSchedules(cleanInvalidLessons(schedules, lessonFormValues));
  }

  usePrompt({
    message: t("unsavedChangesWarning"),
    when: ({ currentLocation, nextLocation }) => {
      const gotoEditPage = nextLocation.pathname.startsWith("/curriculums/edit/");
      return isPrompt && currentLocation.pathname !== nextLocation.pathname && !(gotoEditPage || readonly);
    },
  });

  const readonlyFormFields = readonly
    ? [
        {
          label: t("curriculumName"),
          value: curriculum.name,
        },
        {
          label: t("curriculumDescription"),
          value: curriculum.description,
        },
      ]
    : [];

  // fix page flash
  if (readonly == null || (id && curriculum.name == null)) return null;

  return (
    <>
      <DetailHeader
        icon="iconcurriculum-primary"
        menu={t("curriculumManagement")}
        title={title}
        role={readonly && dayjs(curriculum.lastPublishedAt).format("YYYY/MM/DD HH:mm")}
        extra={
          <Space size="large">
            {readonly ? (
              <>
                <DeleteConfirmModal
                  title={t("deleteCurriculum")}
                  content={t("deleteCurriculumWarning")}
                  onConfirm={handleDeleteCurriculum}
                  cancelText={t("cancelDeleteCurriculum")}
                >
                  <Button ghost danger>
                    {t("deleteCurriculum")}
                  </Button>
                </DeleteConfirmModal>

                {!draftId && (
                  <Button danger type="primary" onClick={() => navigate(`/curriculums/edit/${id}`)}>
                    {t("editCurriculum")}
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button ghost danger onClick={submitDraft}>
                  {t("saveToDraft")}
                </Button>
                <Button danger type="primary" onClick={submitPublish}>
                  {t("publish")}
                </Button>
              </>
            )}
          </Space>
        }
      />

      {draftId && (
        <DraftBar
          title={t("unpublishedDraft")}
          lastModifiedDraftAt={draftDate}
          onRemove={handleDeleteDraft}
          onClick={() => navigate(`/curriculums/edit/${draftId}`)}
        />
      )}

      <Card title={t("curriculumInformation")}>
        {readonly ? (
          <ReadonlyForm fields={readonlyFormFields} labelWidth={180} />
        ) : (
          <Form
            data-testid="basic-form"
            form={form}
            labelCol={{ span: 5 }}
            onFinish={onFinish}
            validateMessages={
              t("validateMessages", {
                ns: "common",
                returnObjects: true,
              }) as FormProps["validateMessages"]
            }
          >
            <Form.Item
              label={t("curriculumName")}
              name="name"
              rules={[...Rules.Required, { max: 100, message: t("curriculum:curriculumNameTooLong") }]}
            >
              <Input placeholder={t("enterCurriculumNameWithLimit")} style={{ width: "600px" }} />
            </Form.Item>
            <Form.Item
              label={t("curriculumDescription")}
              name="description"
              rules={[...Rules.Required, { max: 1000, message: t("curriculumDescriptionTooLong") }]}
            >
              <Input.TextArea rows={5} placeholder={t("enterCurriculumDescriptionWithLimit")} style={{ width: 600 }} />
            </Form.Item>
          </Form>
        )}
      </Card>

      <Lessons readonly={readonly} lessons={lessons} onChange={onChangeLessons} />
      <Schedules readonly={readonly} schedules={schedules} lessons={lessons} onChange={setSchedules} />
    </>
  );
};

export default Curriculum;
