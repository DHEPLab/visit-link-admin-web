import React from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, Space, Tabs } from 'antd';

import { useBoolState } from '../utils';
import { Gender } from '../constants/enums';
import {
  WithPage,
  ContentHeader,
  CardTabs,
  ZebraTable,
  BabyModalForm,
  SearchInput,
} from '../components/*';

const { TabPane } = Tabs;

function Babies({ loadData, onChangeSearch, ...props }) {
  const history = useHistory();
  const [visible, openBaby, closeBaby] = useBoolState(false);

  function handleCreateBaby(values) {
    values.area = values.area.join('/');
    Axios.post('/admin/baby', values).then(() => {
      loadData();
      closeBaby();
    });
  }

  return (
    <>
      <ContentHeader title="宝宝管理">
        <Space size="large">
          <SearchInput
            className="master"
            placeholder="请输入宝宝姓名、ID或所在区域搜索"
            onChange={(e) => onChangeSearch('search', e.target.value)}
          />
          <Button ghost type="primary">
            批量创建宝宝
          </Button>
          <Button type="primary" onClick={openBaby}>
            创建新宝宝
          </Button>
        </Space>
      </ContentHeader>

      <CardTabs>
        <TabPane tab="已审核">
          <ZebraTable
            {...props}
            rowKey="id"
            className="clickable"
            onRow={(record) => ({
              onClick: () => {
                history.push(`/babies/${record.id}`);
              },
            })}
            columns={[
              {
                title: '宝宝姓名',
                align: 'center',
                dataIndex: 'name',
              },
              {
                title: 'ID',
                align: 'center',
                dataIndex: 'identity',
              },
              {
                title: '性别',
                align: 'center',
                dataIndex: 'gender',
                render: (h) => Gender[h],
              },
              {
                title: '所在区域',
                dataIndex: 'area',
              },
              {
                title: '负责社区工作者',
                align: 'center',
                dataIndex: 'chw',
              },
              // {
              //   title: '已上课程',
              //   dataIndex: 'area',
              // },
              // {
              //   title: '当前进度',
              //   dataIndex: 'area',
              // },
            ]}
          />
        </TabPane>
      </CardTabs>

      <BabyModalForm
        title="创建新宝宝"
        visible={visible}
        onFinish={handleCreateBaby}
        onCancel={closeBaby}
        initialValues={{ stage: 'EDC', gender: 'UNKNOWN' }}
      />
    </>
  );
}

export default WithPage(Babies, '/admin/baby?sort=id,desc');
