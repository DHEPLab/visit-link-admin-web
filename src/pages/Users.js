import React, {useEffect, useState} from "react";
import Axios from "axios";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {Button, Form, Input, message, Modal, Radio, Steps, Table, Tabs, Upload} from "antd";
import {StringParam, useQueryParam} from "use-query-params";

import Rules from "../constants/rules";
import {useBoolState} from "../utils";
import {Role} from "../constants/enums";
import {CardTabs, ChwTagSelector, ContentHeader, ModalForm, SearchInput, WithPage, ZebraTable} from "../components/*";
import UploadButton from "../components/UploadButton";
import Column from "antd/lib/table/Column";

const {TabPane} = Tabs;
export default function Users() {
    const history = useHistory();
    const [tab, setTab] = useQueryParam("tab", StringParam);
    const [visible, openUser, closeUser] = useBoolState();
    const [visibleImportModal, openImportModal, closeImportModal] = useBoolState(false)
    const {user} = useSelector((state) => state.users);
    const isAdmin = user?.role === "ROLE_ADMIN";

    useEffect(() => {
        if (!tab) setTab("chw");
    }, [tab, setTab]);

    // change tab to refresh table
    function refresh() {
        const origin = tab;
        setTab(Math.random());
        setTab(origin);
    }

    function handleCreateUser(value) {
        Axios.post("/admin/users", value).then(() => {
            refresh();
            closeUser();
        });
    }

    return (
        <>
            <ContentHeader title="账户管理">
                <Button style={{marginRight: 28, borderColor: "#ff794f", color: "#ff794f"}} onClick={openImportModal}>
                    批量创建账户
                </Button>
                <BatchImportModal visible={visibleImportModal} onClose={closeImportModal}/>
                <Button type="primary" onClick={openUser}>
                    创建新用户
                </Button>
            </ContentHeader>

            {user.id && (
                <CardTabs onChange={setTab} defaultActiveKey={tab}>
                    <TabPane tab="社区工作者" key="chw">
                        <PageCHW tab={tab} history={history}/>
                    </TabPane>
                    {isAdmin && (
                        <>
                            <TabPane tab="督导员" key="supervisor">
                                <PageSupervisor tab={tab} history={history}/>
                            </TabPane>
                            <TabPane tab="管理员" key="admin">
                                <PageAdmin tab={tab} history={history}/>
                            </TabPane>
                        </>
                    )}
                </CardTabs>
            )}

            <ModalForm
                title="创建新用户"
                visible={visible}
                onCancel={closeUser}
                onFinish={handleCreateUser}
                initialValues={{role: "ROLE_CHW"}}
            >
                <h3>用户信息</h3>
                <Form.Item label="权限" name="role" rules={Rules.Required}>
                    <Radio.Group>
                        {Object.keys(Role)
                            .filter((key) => {
                                if (isAdmin) return true;
                                return key === "ROLE_CHW";
                            })
                            .map((key) => (
                                <Radio key={key} value={key}>
                                    {Role[key]}
                                </Radio>
                            ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="真实姓名" name="realName" rules={Rules.RealName}>
                    <Input autoFocus/>
                </Form.Item>
                <Form.Item noStyle shouldUpdate={(old, curr) => old.role !== curr.role}>
                    {({getFieldValue}) => (
                        <>
                            {getFieldValue("role") === "ROLE_CHW" && (
                                <>
                                    <Form.Item label="ID" name={["chw", "identity"]} rules={Rules.Required}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item label="所在区域" name={["chw", "tags"]} rules={Rules.Area}>
                                        <ChwTagSelector/>
                                    </Form.Item>
                                </>
                            )}
                        </>
                    )}
                </Form.Item>
                <Form.Item label="联系电话" name="phone" rules={Rules.Phone}>
                    <Input/>
                </Form.Item>
                <h3>账户信息</h3>
                <Form.Item label="账户名称" name="username" rules={Rules.Required}>
                    <Input/>
                </Form.Item>
                <Form.Item label="账户密码" name="password" rules={Rules.Password}>
                    <Input.Password/>
                </Form.Item>
            </ModalForm>
        </>
    );
}

const PageCHW = WithPage(CHW, "/admin/users/chw", {}, false);
const PageSupervisor = WithPage(Supervisor, "/admin/users/supervisor", {}, false);
const PageAdmin = WithPage(Admin, "/admin/users/admin?sort=id,desc", {}, false);

function CHW({tab, history, loadData, onChangeSearch, ...props}) {
    useEffect(() => {
        tab === "chw" && loadData();
    }, [tab, loadData]);

    return (
        <div>
            <ChwBar>
                <SearchInput
                    style={{width: "420px"}}
                    onChange={(e) => onChangeSearch("search", e.target.value)}
                    placeholder="请输入社区工作者姓名、ID或所在区域搜索"
                />
                {/* <Button ghost type="primary">
          批量创建社区工作者
        </Button> */}
            </ChwBar>
            <ZebraTable
                {...props}
                className="clickable"
                scroll={{x: true}}
                rowKey={(record) => record.user.id}
                onRow={(record) => onRow(history, record.user.id)}
                columns={[
                    realName,
                    {
                        title: "ID",
                        width: 150,
                        dataIndex: ["user", "chw", "identity"],
                    },
                    {
                        title: "所在区域",
                        width: 350,
                        dataIndex: ["user", "chw", "tags"],
                        render: (tags) => tags && tags.join(", "),
                    },
                    phone,
                    {
                        title: "督导员",
                        width: 120,
                        dataIndex: ["user", "chw", "supervisor", "realName"],
                    },
                    {
                        title: "负责宝宝",
                        width: 90,
                        dataIndex: "babyCount",
                        render: (h) => `${h} 位`,
                    },
                    username,
                    {
                        title: "已完成/应完成",
                        width: 120,
                        dataIndex: "hasFinish",
                        render: (hasFinish, v) => `${hasFinish} / ${v.shouldFinish}`,
                    },
                    {
                        title: "完成率",
                        width: 100,
                        dataIndex: "shouldFinish",
                        render: (shouldFinish, v) => `${shouldFinish === 0 ? 0 : Number(v.hasFinish / shouldFinish * 100).toFixed(2) * 1}%`,
                    }
                ]}
            />
        </div>
    );
}

const ChwBar = styled.div`
  height: 76px;
  padding-left: 30px;
  padding-right: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ffc3a0;
`;

function Supervisor({tab, history, loadData, ...props}) {
    useEffect(() => {
        tab === "supervisor" && loadData();
    }, [tab, loadData]);

    return (
        <div>
            <ZebraTable
                {...props}
                scroll={{x: true}}
                className="clickable"
                rowKey={(record) => record.user.id}
                onRow={(record) => onRow(history, record.user.id)}
                columns={[
                    realName,
                    phone,
                    {
                        title: "负责社区工作者",
                        dataIndex: "chwCount",
                        width: 200,
                        render: (h) => `${h} 位`,
                    },
                    username,
                ]}
            />
        </div>
    );
}

function Admin({tab, history, loadData, ...props}) {
    useEffect(() => {
        tab === "admin" && loadData();
    }, [tab, loadData]);

    return (
        <div>
            <ZebraTable
                {...props}
                scroll={{x: true}}
                rowKey="id"
                className="clickable"
                onRow={(record) => onRow(history, record.id)}
                columns={[
                    {...realName, dataIndex: "realName"},
                    {...phone, dataIndex: "phone"},
                    {...username, dataIndex: "username"},
                ]}
            />
        </div>
    );
}

function BatchImportModal({visible, onClose}) {
    const [result, setResult] = useState({
        errData: [],
        total: 0
    })
    useEffect(() => {
        setResult({
            errData: [],
            total: 0
        })
    }, [visible])
    const {errData} = result
    const successTotal = result.total - errData.length
    const onUpload = ({file}) => {
        const formData = new FormData();
        formData.append("records", file)
        Axios.post("/admin/users/import", formData)
            .then(({data}) => {
                if (data.errData.length > 0) {
                    setResult(data)
                    return
                }
                message.success("导入成功")
                onClose && onClose()
            })
    }
    return visible ?
        <Modal visible={true} onCancel={onClose} title="从Excel导入" footer={null}>
            <Steps progressDot current={3} size="small">
                <Steps.Step title="下载模板"/>
                <Steps.Step title="导入数据"/>
                <Steps.Step title="导入完成"/>
            </Steps>
            <div style={{marginTop: 12, display: "flex", justifyContent: "center"}}>
                <Upload customRequest={onUpload} accept=".xls,.xlsx,.csv" showUploadList={false} name="records">
                    <UploadButton title="点击上传Excel" icon="iconimport-excel">
                        支持支持 xls/xlsx
                        <br/>
                        大小不超过5M
                        <br/>
                        单次导入数据最好不超过500条
                    </UploadButton>
                </Upload>
                <a style={{alignSelf: "end"}} href="/static/template/import_chw.xlsx" download>下载模板</a>
            </div>
            {(result.total > 0 || errData.length > 0) && <div>
                <Table
                    size="small"
                    dataSource={errData.map((element, index) => ({...element, key: index}))}
                    pagination={false}
                    scroll={{y: 200}}
                >
                    <Column title="行号" align="left" dataIndex="number" key="number" width={50}/>
                    <Column title="姓名" align="left" dataIndex="name" key="name"/>
                    <Column title="错误事项" align="left" dataIndex="matters" key="matters"
                            render={(matters) => <span style={{color: 'red', fontSize: 12}}>{matters}</span>}/>
                </Table>
                <Result>成功校验数据{successTotal}条， 共{result.total}条</Result>
            </div>}
        </Modal>
        : null
}

const realName = {
    title: "姓名",
    align: "center",
    width: 100,
    dataIndex: ["user", "realName"],
};

const phone = {
    title: "联系电话",
    width: 200,
    dataIndex: ["user", "phone"],
};

const username = {
    title: "账户名称",
    dataIndex: ["user", "username"],
    width: 200,
};

const onRow = (history, id) => {
    return {
        onClick: () => {
            history.push(`/users/${id}`);
        },
    };
};

const ImportLine = styled.div`
  margin-top: 10px;
  padding: 0px 60px;
  height: 30px;
`;

const Result = styled.div`
  text-align: right;
  font-size: 14px;
  line-height: 30px;
  font-family: fantasy;
`
const CloseButton = styled(Button)`
  border-color: #ff794f;
  color: #ff794f;
  margin-right: 10px;
  float: left;
  width: 160px;
`