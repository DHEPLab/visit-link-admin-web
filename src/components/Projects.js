import React, {useEffect, useState} from "react";
import {Button, Space} from "antd";
import ContentHeader from "./ContentHeader";
import StatusTag from "./StatusTag";
import ZebraTable from "./ZebraTable";
import Axios from "axios";

export default function Projects() {
    const [projects, setProjects] = useState([])
    const fetchProject = () => {
        Axios.get("/admin/project/all").then(res => {
            setProjects(res)
        })
    }
    useEffect(() => {
        fetchProject()
    }, [])

    return (
        <>
            <ContentHeader title="项目管理">
                <Space size="large">
                    <Button type="primary" >
                        创建新项目
                    </Button>
                </Space>
            </ContentHeader>
            <ZebraTable
                dataSource={projects}
                rowKey="id"
                className="clickable"
                onRow={(record) => {
                    return {
                        onClick: (event) => {
                            // do noting when click other target
                            if (event.target.tagName === "TD") {
                                //history.push(`/curriculums/${record.id}`);
                            }
                        },
                    };
                }}
                columns={[
                    {
                        title: "项目状态",
                        dataIndex: "published",
                        width: 120,
                        align: "center",
                        render: (h) => <StatusTag value={h} />,
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
                        render(id) {
                            return (
                                <Button type="link" size="small">
                                    注销
                                </Button>
                            );
                        },
                    },
                ]}
            />
        </>
    )
}