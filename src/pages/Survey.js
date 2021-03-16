import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Formik } from "formik";
import { Form, Space, Button, message } from "antd";
import { useLocation, useHistory, useParams, Prompt } from "react-router-dom";

import { DetailHeader, DeleteConfirmModal } from "../components/*";

export default function Survey() {
  const { id } = useParams();
  const { pathname } = useLocation();

  const [isPrompt, setIsPrompt] = useState(true);
  const [readonly, setReadonly] = useState();
  const [title, setTitle] = useState("创建新问卷");
  const [submitURL, setSubmitURL] = useState();

  const [form] = Form.useForm();
  const history = useHistory();

  const [components, setComponents] = useState();

  const [draftId, setDraftId] = useState();

  useEffect(() => {
    setReadonly(!pathname.includes("/surveys/edit") && !pathname.includes("/surveys/create"));
  }, [pathname, setReadonly]);

  function onSubmitFormik(values) {
    setComponents(values.components);
    form.submit();
  }

  function submitDraft(submit) {
    setSubmitURL("/admin/surveys/draft");
    submit();
    setIsPrompt(false);
  }

  function submitPublish(submit) {
    setSubmitURL("/admin/surveys");
    submit();
    setIsPrompt(false);
  }

  function onSubmit(values) {
    if (components.length === 0) return message.warn("至少添加一个问题");

    Axios.post(submitURL, {
      id,
      components,
      ...values,
    }).then(history.goBack);
  }

  function handleDeleteModule() {
    Axios.delete(`/admin/surveys/${id}`).then(() => {
      history.goBack();
    });
  }

  if (readonly == null || (id == null)) return null;

  return (
    <Formik initialValues={{ components }} onSubmit={onSubmitFormik}>
      {({ values, handleSubmit }) => (
        <>
          <Prompt
            when={isPrompt}
            message={(location) => {
              let isstop = location.pathname.startsWith("/surveys/edit/");
              if (isstop || readonly) {
                return true;
              } else {
                return "当前页面有未保存或未提交的内容，离开后将丢失已编辑内容，您确定要离开吗?";
              }
            }}
          />

          <DetailHeader
            icon="iconmodule-primary"
            menu="问卷管理"
            title={title}
            extra={
              <Space size="large">
                {readonly ? (
                  <>
                    {id && (
                      <DeleteConfirmModal
                        title="删除问卷"
                        content="删除后问卷内容将无法恢复是否继续？"
                        onConfirm={handleDeleteModule}
                      >
                        <Button ghost type="danger">
                          删除问卷
                        </Button>
                      </DeleteConfirmModal>
                    )}
                    {!draftId && (
                      <Button type="danger" onClick={() => history.push(`/modules/edit/${id}`)}>
                        编辑问卷
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button ghost type="danger" onClick={() => submitDraft(handleSubmit)}>
                      保存至草稿
                    </Button>
                    <Button type="danger" onClick={() => submitPublish(handleSubmit)}>
                      保存并发布
                    </Button>
                  </>
                )}
              </Space>
            }
          ></DetailHeader>
          
        </>
      )}
    </Formik>
  );
}
