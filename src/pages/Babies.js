import React from 'react';
import Axios from 'axios';
import moment from 'moment';
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
    values.birthday = values.birthday && moment(values.birthday).format('YYYY-MM-DD');
    values.edc = values.edc && moment(values.edc).format('YYYY-MM-DD');
    Axios.post('/admin/babies', values).then(() => {
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
          {/* <Button ghost type="primary">
            批量创建宝宝
          </Button> */}
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
                dataIndex: 'name',
                align: 'center',
                width: 120,
              },
              {
                title: 'ID',
                width: 200,
                dataIndex: 'identity',
              },
              {
                title: '性别',
                width: 80,
                dataIndex: 'gender',
                render: (h) => Gender[h],
              },
              {
                title: '所在区域',
                dataIndex: 'area',
                width: 300,
              },
              {
                title: '负责社区工作者',
                dataIndex: 'chw',
                width: 150,
              },
              {
                title: '已上课堂',
                dataIndex: 'visitCount',
                width: 150,
                render: (h) => `${h} 节课堂`,
              },
              {
                title: '当前进度',
                dataIndex: 'currentLessonName',
                width: 200,
              },
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

export default WithPage(Babies, '/admin/babies');
