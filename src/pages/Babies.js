import React, { useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Modal, Form, Table, Button, Input, Space, Radio, DatePicker, Select } from 'antd';
import { useHistory } from 'react-router-dom';

import { useBoolState } from '../utils';
import { WithPage } from '../components/*';
import { Gender, BabyStage, FeedingPattern } from '../constants/enums';
import { Required } from '../constants';

function Babies({ dataSource, loadData, pagination, onChangePage }) {
  const history = useHistory();
  const [visible, openBaby, closeBaby] = useBoolState(false);

  return (
    <>
      <h1>宝宝管理</h1>
      <ButtonGroup>
        <Button type="primary" onClick={openBaby}>
          创建新宝宝
        </Button>
      </ButtonGroup>
      <Table
        rowKey="id"
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChangePage}
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
                <Button type="link" onClick={() => history.push(`/babies/${id}`)}>
                  查看
                </Button>
              );
            },
          },
        ]}
      />
      <BabyFormModal
        visible={visible}
        onCancel={closeBaby}
        onSuccess={() => {
          loadData();
          closeBaby();
        }}
      />
    </>
  );
}

function BabyFormModal({ onSuccess, ...props }) {
  const [form] = Form.useForm();

  useEffect(() => {
    props.visible && form.resetFields();
  }, [props.visible, form]);

  function onFinish(values) {
    Axios.post('/admin/baby', values).then(onSuccess);
  }

  return (
    <Modal
      title="创建新宝宝"
      destroyOnClose
      {...props}
      footer={
        <Space>
          <Button ghost type="primary" onClick={props.onCancel}>
            放弃
          </Button>
          <Button type="primary" onClick={form.submit}>
            提交
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        initialValues={{ stage: 'EDC' }}
        labelCol={{ span: 4 }}
        wrapperCol={{ offset: 1 }}
        onFinish={onFinish}
      >
        <Form.Item label="真实姓名" name="name" rules={Required}>
          <Input />
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
      </Form>
    </Modal>
  );
}

const ButtonGroup = styled.div`
  padding: 10px 0;
  text-align: right;
`;

export default WithPage(Babies, '/admin/baby');
