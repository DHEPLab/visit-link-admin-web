import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal, Popconfirm, Radio, Space} from "antd";
import ContentHeader from "./ContentHeader";
import StatusTag from "./StatusTag";
import ZebraTable from "./ZebraTable";
import Axios from "axios";
import Rules from "../constants/rules";
import ModalForm from "./ModalForm";
import {ProjectStatus} from "../constants/enums";

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [formModal, setFormModal] = useState({
        visible : false,
        values: {status: 0}
    })
    const openFormModal = (values) => {
        setFormModal({visible: true, values})
    }
    const closeFormModal = () => {
        setFormModal({visible: false, values: {status: 0}})
    }
    const fetchProject = () => {
        Axios.get("/admin/project/all").then(({data}) => {
            setProjects(data)
        })
    }
    const onSubmit = (value) => {
        const {id} = formModal.values
        const url = id? `/admin/project/update/${id}` : "/admin/project/create"
        Axios.post(url, value)
            .then(({data}) => {
                if (!id) {
                    Modal.info({
                        title: "该项目的初始管理员账号信息已经创建完成(请妥善保管密码)",
                        content: (
                            <div>
                                <p>用户名：{data.username}</p>
                                <p>密码：{data.password}</p>
                            </div>
                        ),
                        onOk() {},
                    });
                }
                fetchProject()
                closeFormModal()
            })
    }
    const onUpdateStatus = (id, status) => {
        Axios.post(`/admin/project/update/status/${id}`, {status})
            .then(() => setProjects(projects.map(p => {
                if (p.id === id) {
                    return {...p, status}
                }
                return p
            })))
    }
    useEffect(() => {
        fetchProject()
    }, [])

    return (
        <>
            <ContentHeader title="项目管理">
                <Space size="large">
                    <Button type="primary" onClick={() => openFormModal({status: 1})}>
                        创建新项目
                    </Button>
                </Space>
            </ContentHeader>
            <ZebraTable
                dataSource={projects}
                pagination={false}
                rowKey="id"
                className="clickable"
                columns={[
                    {
                        title: "项目状态",
                        dataIndex: "status",
                        width: 120,
                        align: "center",
                        render: (h) => <StatusTag value={h===1} trueText="已启用" falseText="已停用"/>,
                    },
                    {
                        title: "项目名称",
                        dataIndex: "name",
                    },
                    {
                        title: "操作",
                        dataIndex: "id",
                        width: 200,
                        align: "center",
                        render(id, v) {
                            const title = v.status===1?"停用":"重新发布";
                            return (
                                <>
                                    <Button type="link" size="small"
                                            onClick={()=>openFormModal({...projects.find(p => p.id === id)})}>
                                        编辑
                                    </Button>
                                    <Popconfirm placement="leftTop" title={`确认${title}？`} okText="确认" cancelText="取消"
                                                onConfirm={()=>onUpdateStatus(id, v.status===1? 0 : 1)}>
                                        <Button type="link" size="small" style={{width: 50}}>
                                            {title}
                                        </Button>
                                    </Popconfirm>
                                </>
                            );
                        },
                    },
                ]}
            />
            <ModalForm title="编辑课堂"
                visible={formModal.visible}
                initialValues={formModal.values}
                onCancel={closeFormModal}
                onFinish={onSubmit}
            >
                <Form.Item label="项目名称" name="name" rules={[...Rules.Required, { max: 20 }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="项目状态" name="status" rules={[...Rules.Required]}>
                    <Radio.Group>
                        {Object.keys(ProjectStatus).map((key) => (
                            <Radio key={key} value={parseInt(key)}>
                                {ProjectStatus[key]}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
            </ModalForm>
        </>
    )
}