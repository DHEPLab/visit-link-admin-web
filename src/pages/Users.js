import React, { useEffect } from "react";
import Axios from "axios";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Form, Input, Modal, Radio, Tabs } from "antd";
import { StringParam, useQueryParam } from "use-query-params";
import { useTranslation } from 'react-i18next';

import i18next from '../i18n';
import Rules from "../constants/rules";
import { useBoolState } from "../utils";
import { Role } from "../constants/enums";
import { CardTabs, ChwTagSelector, ContentHeader, ModalForm, SearchInput, WithPage, ZebraTable } from "../components/*";
import ImportUserExcel from "../components/ImportUserExcel";

const { TabPane } = Tabs;
export default function Users() {
  const { t } = useTranslation(["users", "common"]);
  const history = useHistory();
  const [tab, setTab] = useQueryParam("tab", StringParam);
  const [visible, openUser, closeUser] = useBoolState();
  const [importModal, openImportModal, closeImportModal] = useBoolState(false);
  const { user } = useSelector((state) => state.users);
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
      <ContentHeader title={t('accountManagement')}>
        <Button style={{ marginRight: 28, borderColor: "#ff794f", color: "#ff794f" }} onClick={openImportModal}>
          {
            t('batchNewAccounts')
          }
        </Button>
        <Modal visible={importModal} title="从Excel导入" onCancel={closeImportModal} style={{ top: 50 }} footer={false} >
          <ImportUserExcel refresh={refresh} close={closeImportModal} open={importModal} />
        </Modal>
        <Button type="primary" onClick={openUser}>
          {t('createNewUser')}
        </Button>
      </ContentHeader>

      {user.id && (
        <CardTabs onChange={setTab} defaultActiveKey={tab}>
          <TabPane tab={t('chw')} key="chw">
            <PageCHW tab={tab} history={history} />
          </TabPane>
          {isAdmin && (
            <>
              <TabPane tab={t('supervisor')} key="supervisor">
                <PageSupervisor tab={tab} history={history} />
              </TabPane>
              <TabPane tab={t('admin')} key="admin">
                <PageAdmin tab={tab} history={history} />
              </TabPane>
            </>
          )}
        </CardTabs>
      )}

      <ModalForm
        title={t('createNewUser')}
        visible={visible}
        onCancel={closeUser}
        onFinish={handleCreateUser}
        initialValues={{ role: "ROLE_CHW" }}
        validateMessages={t('validateMessages', { ns: "common", returnObjects: true })}
      >
        <h3>{t('generalInformation')}</h3>
        <Form.Item label={t('permissions')} name="role" rules={Rules.Required}>
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
        <Form.Item label={t('name')} name="realName" rules={Rules.RealName}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(old, curr) => old.role !== curr.role}>
          {({ getFieldValue }) => (
            <>
              {getFieldValue("role") === "ROLE_CHW" && (
                <>
                  <Form.Item label="ID" name={["chw", "identity"]} rules={Rules.Required}>
                    <Input />
                  </Form.Item>
                  <Form.Item label={t('area')} name={["chw", "tags"]} rules={Rules.Area}>
                    <ChwTagSelector />
                  </Form.Item>
                </>
              )}
            </>
          )}
        </Form.Item>
        <Form.Item label={t('phone')} name="phone" rules={Rules.Phone}>
          <Input />
        </Form.Item>
        <h3>{t('accountInformation')}</h3>
        <Form.Item label={t('username')} name="username" rules={Rules.Required}>
          <Input />
        </Form.Item>
        <Form.Item label={t('password')} name="password" rules={Rules.Password}>
          <Input.Password />
        </Form.Item>
      </ModalForm>
    </>
  );
}

const PageCHW = WithPage(CHW, "/admin/users/chw", {}, false);
const PageSupervisor = WithPage(Supervisor, "/admin/users/supervisor", {}, false);
const PageAdmin = WithPage(Admin, "/admin/users/admin?sort=id,desc", {}, false);

function CHW({ historyPageState, tab, history, loadData, onChangeSearch, ...props }) {
  const { t } = useTranslation(["users", "common"]);
  useEffect(() => {
    tab === "chw" && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <ChwBar>
        <SearchInput
          defaultValue={historyPageState?.search}
          style={{ width: "420px" }}
          onChange={(e) => onChangeSearch("search", e.target.value)}
          placeholder={t('searchChwPlaceholder')}
        />
        {/* <Button ghost type="primary">
          批量创建社区工作者
        </Button> */}
      </ChwBar>
      <ZebraTable
        {...props}
        className="clickable"
        scroll={{ x: true }}
        rowKey={(record) => record.user.id}
        onRow={(record) => onRow(history, record.user.id)}
        columns={[
          realName,
          {
            title: t('id'),
            width: 150,
            dataIndex: ["user", "chw", "identity"],
          },
          {
            title: t('area'),
            width: 350,
            dataIndex: ["user", "chw", "tags"],
            render: (tags) => tags && tags.join(", "),
          },
          phone,
          {
            title: t('supervisor'),
            width: 120,
            dataIndex: ["user", "chw", "supervisor", "realName"],
          },
          {
            title: t('babyCount'),
            width: 100,
            dataIndex: "babyCount",
            render: (h) => `${h} ${t('unit.person', { ns: 'common' })}`,
          },
          username,
          {
            title: t('completion'),
            width: 120,
            dataIndex: "hasFinish",
            render: (hasFinish, v) => `${hasFinish} / ${v.shouldFinish}`,
          },
          {
            title: t('completionRate'),
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

function Supervisor({ tab, history, loadData, ...props }) {
  const { t } = useTranslation(["users", "common"]);
  useEffect(() => {
    tab === "supervisor" && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <ZebraTable
        {...props}
        scroll={{ x: true }}
        className="clickable"
        rowKey={(record) => record.user.id}
        onRow={(record) => onRow(history, record.user.id)}
        columns={[
          realName,
          phone,
          {
            title: t('chw'),
            dataIndex: "chwCount",
            width: 200,
            render: (h) => `${h} ${t('unit.person', { ns: 'common' })}`,
          },
          username,
        ]}
      />
    </div>
  );
}

function Admin({ tab, history, loadData, ...props }) {
  useEffect(() => {
    tab === "admin" && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <ZebraTable
        {...props}
        scroll={{ x: true }}
        rowKey="id"
        className="clickable"
        onRow={(record) => onRow(history, record.id)}
        columns={[
          { ...realName, dataIndex: "realName" },
          { ...phone, dataIndex: "phone" },
          { ...username, dataIndex: "username" },
        ]}
      />
    </div>
  );
}

const realName = {
  title: i18next.t('name', { ns: "users" }),
  align: "center",
  width: 100,
  dataIndex: ["user", "realName"],
};

const phone = {
  title: i18next.t('phone', { ns: "users" }),
  width: 200,
  dataIndex: ["user", "phone"],
};

const username = {
  title: i18next.t('username', { ns: "users" }),
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