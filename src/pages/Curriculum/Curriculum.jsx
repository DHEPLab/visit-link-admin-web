import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, message, Space } from "antd";

import Rules from "@/constants/rules";
import CurriculumUtils from "@/utils/curriculum";
import Card from "@/components/Card";
import DetailHeader from "@/components/DetailHeader";
import DraftBar from "@/components/DraftBar";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useTranslation } from "react-i18next";
import usePrompt from "@/hooks/usePrompt";
import i18n from "@/i18n";
import Schedules from "./Schedules";
import Lessons from "./Lessons";
import ReadonlyForm from "./ReadonlyForm";

export default function Curriculum() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { t } = useTranslation("curriculum");

  const [isPrompt, setIsPrompt] = useState(true);
  const [readonly, setReadonly] = useState();
  const [title, setTitle] = useState(t("createNewCurriculum"));
  const [submitURL, setSubmitURL] = useState();

  const [form] = Form.useForm();
  const [curriculum, setCurriculum] = useState({});
  const [lessons, setLessons] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [draftId, setDraftId] = useState();
  const [draftDate, setDraftDate] = useState();

  useEffect(() => {
    setReadonly(!pathname.includes("/curriculums/edit") && !pathname.includes("/curriculums/create"));
  }, [pathname, setReadonly]);

  useEffect(() => {
    if (readonly == null || !id) return;
    axios.get(`/admin/curriculums/${id}`).then(({ data, headers }) => {
      if (!readonly) form.setFieldsValue(data);
      setTitle(data.name);
      setDraftId(headers["x-draft-id"]);
      setDraftDate(headers["x-draft-date"]);
      setLessons(data.lessons.map((n) => ({ ...n, questionnaire: n.questionnaire?.id })));
      setSchedules(data.schedules);
      setCurriculum({ ...data, lessons: [], schedules: [] });
    });
  }, [id, form, readonly]);

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

  function onFinish(values) {
    if (!validate()) return;
    const lessonResult = lessons.map((n) => ({
      ...n,
      questionnaire: n.questionnaire ? { id: n.questionnaire } : null,
    }));
    axios
      .post(submitURL, {
        id,
        ...values,
        lessons: lessonResult,
        schedules,
      })
      .then(() => navigate(-1));
  }

  function handleDelteDraft() {
    axios.delete(`/admin/curriculums/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteCurriculum() {
    axios.delete(`/admin/curriculums/${id}`).then(() => {
      navigate(-1);
    });
  }

  function onChangeLessons(_lessons) {
    setLessons(_lessons);
    setSchedules(CurriculumUtils.cleanInvalidLessons(schedules, _lessons));
  }

  usePrompt({
    message: t("unsavedChangesWarning"),
    when: ({ currentLocation, nextLocation }) => {
      const gotoEditPage = nextLocation.pathname.startsWith("/curriculums/edit/");
      return isPrompt && currentLocation.pathname !== nextLocation.pathname && !(gotoEditPage || readonly);
    },
  });

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
          onRemove={handleDelteDraft}
          onClick={() => navigate(`/curriculums/edit/${draftId}`)}
        />
      )}

      <Card title={t("curriculumInformation")}>
        {readonly ? (
          <ReadonlyForm value={curriculum} />
        ) : (
          <Form
            data-testid="basic-form"
            form={form}
            labelCol={{ span: i18n.resolvedLanguage === "zh" ? 2 : 5 }}
            onFinish={onFinish}
            validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
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

      <Lessons disabled={readonly} value={lessons} onChange={onChangeLessons} />
      <Schedules disabled={readonly} value={schedules} lessonOptions={lessons} onChange={setSchedules} />
    </>
  );
}
