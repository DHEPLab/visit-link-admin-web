import React, {useEffect, useState} from "react";
import Axios from "axios";
import {Formik} from "formik";
import {Button, Col, Form, Input, message, Row, Space} from "antd";
import {useDispatch} from "react-redux";
import {Prompt, useHistory, useLocation, useParams} from "react-router-dom";

import Factory from "../components/curriculum/factory";
import ModuleComponents from "../components/curriculum/ModuleComponents";
import {Rules} from "../constants/*";
import {ModuleTopic, QrType} from "../constants/enums";
import {Card, DeleteConfirmModal, DetailHeader, DraftBar, SelectEnum, StaticField} from "../components/*";
import {moduleFinishActionOptions} from "../actions";
import QRCode from 'qrcode.react'

export default function Module() {
    const {id} = useParams();
    const {pathname} = useLocation();
    const [readonly, setReadonly] = useState();
    const history = useHistory();
    const dispatch = useDispatch();

    const [isPrompt, setIsPrompt] = useState(true);
    const [form] = Form.useForm();
    const [title, setTitle] = useState("创建新模块");
    const [submitURL, setSubmitURL] = useState();

    const [module, setModule] = useState({});
    const [components, setComponents] = useState([]);

    const [draftId, setDraftId] = useState();
    const [draftDate, setDraftDate] = useState();

    useEffect(() => {
        setReadonly(!pathname.includes("/modules/edit") && !pathname.includes("/modules/create") && !pathname.includes("/modules/copy"));
    }, [pathname, setReadonly]);

    useEffect(() => {
        if (readonly == null) return;

        if (!id) {
            setComponents([Factory.createText()]);
        } else {
            Axios.get(`/admin/modules/${id}`).then(({data, headers}) => {
                const formValue = pathname.includes("/modules/edit") ? data : {
                    ...data,
                    id: null,
                    name: `${data.name}（1）`,
                    number: `${data.number}-1`,
                }
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
            message.warn("有媒体组件没有上传文件！");
            return false
        }
        if (comp.type !== "Switch") {
            return true
        }
        const {cases} = comp.value
        if (cases.length === 0) {
            return true
        }
        for (let i = 0; i < cases.length; i++) {
            const comps = cases[i].components
            for (let j = 0; j < comps.length; j++) {
                if (!isValidComponent(comps[j])) {
                    return false
                }
            }
        }
        return true
    }

    function onSubmit(values) {
        if (components.length === 0) return message.warn("至少添加一个组件");
        for (let i = 0; i < components.length; i++) {
            const comp = components[i]
            if (!isValidComponent(comp)) {
                return
            }
        }
        return
        const isEdit = pathname.includes("/modules/edit")
        Axios.post(submitURL, {
            id: isEdit ? id : null,
            components,
            ...values,
        }).then(() => {
            if (isEdit) {
                history.goBack()
            } else {
                history.push('/modules')
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
            history.goBack();
        });
    }

    function copy() {
        history.push(`/modules/copy/${id}`)
    }

    if (!components) {
        return null;
    }
    return (
        <Formik initialValues={{components}} onSubmit={onSubmitFormik}>
            {({values, handleSubmit}) => (
                <>
                    <Prompt
                        when={isPrompt}
                        message={(location) => {
                            let isstop = location.pathname.startsWith("/modules/edit/");
                            if (isstop || readonly) {
                                return true;
                            } else {
                                return "当前页面有未保存或未提交的内容，离开后将丢失已编辑内容，您确定要离开吗?";
                            }
                        }}
                    />
                    <DetailHeader
                        icon="iconmodule-primary"
                        menu="模块管理"
                        title={title}
                        extra={
                            <Space size="large">
                                {readonly ? (
                                    <>
                                        {id && (
                                            <Button ghost type="danger" onClick={copy}>
                                                复制模块
                                            </Button>
                                        )}
                                        {id && (
                                            <DeleteConfirmModal
                                                title="删除模块"
                                                content="删除后模块内容将无法恢复是否继续？"
                                                onConfirm={handleDeleteModule}
                                            >
                                                <Button ghost type="danger">
                                                    删除模块
                                                </Button>
                                            </DeleteConfirmModal>
                                        )}
                                        {!draftId && (
                                            <Button type="danger" onClick={() => history.push(`/modules/edit/${id}`)}>
                                                编辑模块
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

                    {draftId && (
                        <DraftBar
                            title="本模块有1个尚未发布的草稿："
                            lastModifiedDraftAt={draftDate}
                            onRemove={handleDelteDraft}
                            onClick={() => history.push(`/modules/edit/${draftId}`)}
                        />
                    )}

                    <Card title="模块基本信息">
                        <Row>
                            <Col span={12}>
                                {readonly ? (
                                    <ReadonlyForm value={module}/>
                                ) : (
                                    <Form data-testid="basic-form" form={form} onFinish={onSubmit}>
                                        <Form.Item label="模块名称" name="name" rules={[...Rules.Required, {max: 40}]}>
                                            <Input placeholder="请输入模块名称，限40个字符"/>
                                        </Form.Item>
                                        <Form.Item label="模块编号" name="number" rules={[...Rules.Required, {max: 20}]}>
                                            <Input placeholder="请输入模块编号，限20个字符"/>
                                        </Form.Item>
                                        <Form.Item label="模块描述" name="description"
                                                   rules={[...Rules.Required, {max: 200}]}>
                                            <Input.TextArea rows={4} placeholder="请输入模块描述，限200个字符"/>
                                        </Form.Item>
                                        <Form.Item label="模块主题" name="topic" rules={Rules.Required}>
                                            <SelectEnum name="ModuleTopic" placeholder="请选择模块主题"/>
                                        </Form.Item>
                                    </Form>
                                )}
                            </Col>
                            <Col offset={6} span={6}>
                                {readonly && (
                                    <>
                                        <div style={{fontSize: 14}}>登录APP -> 个人中心 -> 扫码预览</div>
                                        <QRCode value={JSON.stringify({type: QrType.MODULE_ID, data: module.id})}
                                                size={200} fgColor="black"/>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </Card>

                    <Card title="模块内容">
                        <ModuleComponents value={values.components} readonly={readonly}/>
                    </Card>
                </>
            )}
        </Formik>
    );
}

function ReadonlyForm({value}) {
    return (
        <div data-testid="readonly-form">
            <StaticField label="模块名称">{value.name}</StaticField>
            <StaticField label="模块编号">{value.number}</StaticField>
            <StaticField label="模块描述">{value.description}</StaticField>
            <StaticField label="模块主题">{ModuleTopic[value.topic]}</StaticField>
        </div>
    );
}