import React from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, Input, Space, Tabs } from 'antd';

import { useBoolState } from '../utils';
import { Gender } from '../constants/enums';
import { WithPage, ContentHeader, CardTabs, ZebraTable, BabyModalForm } from '../components/*';

const { TabPane } = Tabs;

function Babies({ loadData, ...props }) {
  const history = useHistory();
  const [visible, openBaby, closeBaby] = useBoolState(false);

  function handleCreateBaby(values) {
    Axios.post('/admin/baby', values).then(() => {
      loadData();
      closeBaby();
    });
  }

  return (
    <>
      <ContentHeader title="宝宝管理">
        <Space size="large">
          <Input className="master" placeholder="请输入宝宝姓名、ID或所在区域搜索" />
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
            rowKey="id"
            {...props}
            columns={[
              {
                title: '宝宝姓名',
                dataIndex: 'name',
                align: 'center',
              },
              {
                title: 'ID',
                dataIndex: 'identity',
                align: 'center',
              },
              {
                title: '性别',
                dataIndex: 'gender',
                align: 'center',
                render: (h) => Gender[h],
              },
              {
                title: '负责社区工作者',
                dataIndex: ['chw', 'realName'],
                align: 'center',
              },
              {
                title: '操作',
                dataIndex: 'id',
                width: 200,
                align: 'center',
                render(id) {
                  return (
                    <Button size="small" type="link" onClick={() => history.push(`/babies/${id}`)}>
                      查看
                    </Button>
                  );
                },
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

export default WithPage(Babies, '/admin/baby?sort=id,desc');
