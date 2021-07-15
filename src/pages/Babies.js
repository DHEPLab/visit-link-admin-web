import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useQueryParam, StringParam } from "use-query-params";

import { Button, Space, Tabs, Modal } from "antd";

import { useBoolState } from "../utils";
import { Gender, ActionFromApp } from "../constants/enums";
import { WithPage, ContentHeader, CardTabs, ZebraTable, BabyModalForm, SearchInput, StatusTag, ImportExcel } from "../components/*";

const { TabPane } = Tabs;

function formatDate(datetime) {
  return moment(datetime).format("YYYY-MM-DD");
}

export default function Babies() {
  const history = useHistory();
  const [tab, setTab] = useQueryParam("tab", StringParam);
  const [visible, openBaby, closeBaby] = useBoolState(false);
  const [impoerModal, openImpoerModal, closeImpoerModal] = useBoolState(false);

  useEffect(() => {
    if (!tab) setTab("approved");
  }, [tab, setTab]);

  function handleCreateBaby(values) {
    values.area = values.area.join("/");
    values.birthday = values.birthday && formatDate(values.birthday);
    values.edc = values.edc && formatDate(values.edc);
    Axios.post("/admin/babies", values).then(() => {
      refresh();
      closeBaby();
    });
  }

  // change tab to refresh table
  function refresh() {
    const origin = tab;
    setTab(Math.random());
    setTab(origin);
  }

  return (
    <>
      <ContentHeader title="宝宝管理">
        <ImportButton onClick={openImpoerModal}>
          批量创建宝宝
        </ImportButton>
        <Button type="primary" onClick={openBaby}>
          创建新宝宝
        </Button>
      </ContentHeader>

      <CardTabs onChange={setTab} defaultActiveKey={tab}>
        <TabPane tab="已审核" key="approved">
          <PageApproved tab={tab} history={history} />
        </TabPane>
        <TabPane tab="待审核" key="unreviewed">
          <PageUnreviewed tab={tab} history={history} />
        </TabPane>
      </CardTabs>

      <BabyModalForm
        title="创建新宝宝"
        visible={visible}
        onFinish={handleCreateBaby}
        onCancel={closeBaby}
        initialValues={{ stage: "EDC", gender: "UNKNOWN" }}
      />
      <Modal visible={impoerModal} title="从Excel导入" onCancel={closeImpoerModal} style={{top: 50}} footer={false} >
        <ImportExcel refresh={refresh} close={closeImpoerModal} open={impoerModal} />
      </Modal>
    </>
  );
}

const PageApproved = WithPage(Approved, "/admin/babies/approved", {}, false);
const PageUnreviewed = WithPage(Unreviewed, "/admin/babies/unreviewed", {}, false);

function Unreviewed({ onChangeSearch, onChangePage, tab, history, loadData, ...props }) {
  useEffect(() => {
    tab === "unreviewed" && loadData();
  }, [tab, loadData]);

  const [sortField, setSortField] = useState(null);

  function sorterFun (pagination, filters, sorter) {
    const {order, field} = sorter
    const newSortField = order ? `${field},${order === 'ascend' ? 'asc' : 'desc'}` : null
    setSortField(newSortField)
    if (newSortField === sortField) {
      onChangePage(pagination)
    } else {
      onChangeSearch('sort', newSortField)
    }
  }

  return (
    <>
      <SearchBar>
        <Space size="large">
          <SearchInput
            className="master"
            placeholder="请输入宝宝姓名、ID或所在区域搜索"
            onChange={(e) => onChangeSearch("search", e.target.value)}
          />
        </Space>
      </SearchBar>
      <ZebraTable
        {...props}
        rowKey="id"
        className="clickable"
        onRow={(record) => ({
          onClick: () => {
            history.push(`/babies/${record.id}`);
          },
        })}
        onChange={sorterFun}
        scroll={{ x: '100vw' }}
        columns={[
          {
            title: "修改日期",
            dataIndex: "lastModifiedAt",
            align: "center",
            className: "sort-column-vertical-center",
            width: 220,
            sorter: true,
            render: (h, baby) => {
              return (
                <>
                  {formatDate(h)}
                  <Tag actionFromApp={baby.actionFromApp}>{ActionFromApp[baby.actionFromApp]}</Tag>
                </>
              );
            },
          },
          {
            title: "宝宝姓名",
            className: "sort-column-vertical-center",
            dataIndex: "name",
            width: 120,
            sorter: true
          },
          {
            title: "ID",
            width: 200,
            dataIndex: "identity",
            render: (h) => h || "待核准",
          },
          {
            title: "性别",
            width: 80,
            dataIndex: "gender",
            render: (h) => Gender[h],
          },
          {
            title: "所在区域",
            dataIndex: "area",
            width: 300,
          },
          {
            title: "负责社区工作者",
            dataIndex: "chw",
            width: 150,
          },
          {
            title: "已上课堂",
            dataIndex: "visitCount",
            width: 150,
            render: (h) => `${h} 节课堂`,
          },
          {
            title: "注册日期",
            dataIndex: "createdAt",
            align: "center",
            width: 150,
            render: (h) => formatDate(h)
          },
        ]}
      />
    </>
  );
}

const Tag = styled.span`
  ${(props) => {
    switch (props.actionFromApp) {
      case "CREATE":
        return `color: #ff794f; background: #ffede2`;
      case "MODIFY":
        return `color: #FF5555; background: #fff1f0`;
      default:
        return `color: #97979C; background: #EEEEEE`;
    }
  }};
  border-radius: 4px;
  padding: 3px 6px;
  margin-left: 20px;
  font-weight: bold;
  display: inline-block;
`;

function Approved({ tab, history, loadData, onChangeSearch, onChangePage, ...props }) {
  useEffect(() => {
    tab === "approved" && loadData();
  }, [tab, loadData]);

  const [sortField, setSortField] = useState(null);

  function sorterFun (pagination, filters, sorter) {
    const {order, field} = sorter
    const newSortField = order ? `${field},${order === 'ascend' ? 'asc' : 'desc'}` : null
    setSortField(newSortField)
    if (newSortField === sortField) {
      onChangePage(pagination)
    } else {
      onChangeSearch('sort', newSortField)
    }
  }

  return (
    <>
      <SearchBar>
        <Space size="large">
          <SearchInput
            className="master"
            placeholder="请输入宝宝姓名、ID或所在区域搜索"
            onChange={(e) => onChangeSearch("search", e.target.value)}
          />
        </Space>
      </SearchBar>
      <ZebraTable
        {...props}
        rowKey="id"
        className="clickable"
        onRow={(record) => ({
          onClick: () => {
            history.push(`/babies/${record.id}`);
          },
        })}
        onChange={sorterFun}
        scroll={{ x: '100vw' }}
        columns={[
          {
            title: "宝宝状态",
            dataIndex: "deleted",
            align: "center",
            width: 100,
            render: (h) => <StatusTag value={!h} trueText="正常" falseText="注销" />,
          },
          {
            title: "注册日期",
            dataIndex: "createdAt",
            className: "sort-column-vertical-center",
            align: "center",
            sorter: true,
            width: 150,
            render: (h) => formatDate(h)
          },
          {
            title: "宝宝姓名",
            dataIndex: "name",
            className: "sort-column-vertical-center",
            width: 140,
            sorter: true
          },
          {
            title: "ID",
            width: 200,
            dataIndex: "identity"
          },
          {
            title: "性别",
            width: 80,
            dataIndex: "gender",
            render: (h) => Gender[h],
          },
          {
            title: "所在区域",
            dataIndex: "area",
            width: 300,
          },
          {
            title: "负责社区工作者",
            dataIndex: "chw",
            width: 150,
          },
          {
            title: "已上课堂",
            dataIndex: "visitCount",
            width: 150,
            render: (h) => `${h} 节课堂`,
          },
          {
            title: "当前进度",
            dataIndex: "currentLessonName",
            width: 200,
          },
        ]}
      />
    </>
  );
}

const ImportButton = styled(Button)`
  border-color: #ff794f;
  color: #ff794f;
  margin-right: 10px;
`

const SearchBar = styled.div`
  height: 76px;
  padding-left: 30px;
  padding-right: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ffc3a0;
`;
