import React from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Form, Button, Input, Space, Radio, DatePicker, Select, Tabs } from 'antd';

import { Required } from '../constants';
import { useBoolState } from '../utils';
import { Gender, BabyStage, FeedingPattern } from '../constants/enums';
import { WithPage, ContentHeader, CardTabs, ZebraTable, ModalForm } from '../components/*';

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

      <ModalForm
        title="创建新宝宝"
        visible={visible}
        onFinish={handleCreateBaby}
        onCancel={closeBaby}
        initialValues={{ stage: 'EDC', gender: 'UNKNOWN' }}
      >
        <Form.Item label="真实姓名" name="name" rules={Required}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item label="ID" name="identity" rules={Required}>
          <Input />
        </Form.Item>
        <Form.Item label="性别" name="gender" rules={Required}>
          <Radio.Group>
            {Object.keys(Gender).map((key) => (
              <Radio key={key} value={key}>
                {Gender[key]}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="成长阶段" name="stage" rules={Required}>
          <Radio.Group>
            {Object.keys(BabyStage).map((key) => (
              <Radio key={key} value={key}>
                {BabyStage[key]}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(old, curr) => old.stage !== curr.stage}>
          {({ getFieldValue }) => {
            const stage = getFieldValue('stage');
            if (stage === 'EDC') {
              return (
                <Form.Item label="待产日期" name="edc" rules={Required}>
                  <DatePicker />
                </Form.Item>
              );
            } else {
              return (
                <>
                  <Form.Item label="出生日期" name="birthday" rules={Required}>
                    <DatePicker />
                  </Form.Item>
                  <Form.Item label="喂养方式" name="feedingPattern" rules={Required}>
                    <Select>
                      {Object.keys(FeedingPattern).map((key) => (
                        <Select.Option key={key} value={key}>
                          {FeedingPattern[key]}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              );
            }
          }}
        </Form.Item>
        <Form.Item label="详细地址" name="location" rules={Required}>
          <Input />
        </Form.Item>
        <Form.Item label="备注信息" name="remark">
          <Input />
        </Form.Item>
      </ModalForm>
    </>
  );
}

export default WithPage(Babies, '/admin/baby');
