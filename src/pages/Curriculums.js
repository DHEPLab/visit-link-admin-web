import React, { useState } from 'react';
import Axios from 'axios';
import { Form, Space, Button, Input, InputNumber } from 'antd';

import Rules from '../constants/rules';
import { useBoolState } from '../utils';
import { RadioEnum, Card, DetailHeader, DraftBar, ZebraTable, ModalForm } from '../components/*';

export default function Curriculum() {
  const [form] = Form.useForm();
  const [lessons, setLessons] = useState([]);
  const [schedules, setSchedules] = useState([]);

  function onFinish(values) {
    Axios.post('/admin/curriculum', {
      ...values,
      lessons,
      schedules,
    });
  }

  return (
    <>
      <DetailHeader
        icon="iconcurriculum-primary"
        menu="课程管理"
        extra={
          <Space size="large">
            <Button ghost type="danger">
              保存草稿
            </Button>
            <Button type="danger" onClick={form.submit}>
              保存并发布
            </Button>
          </Space>
        }
      />

      <DraftBar />

      <Card title="课程基本信息">
        <Form form={form} onFinish={onFinish}>
          <Form.Item label="课程名称" name="name" rules={Rules.Required}>
            <Input />
          </Form.Item>
          <Form.Item label="课程描述" name="description" rules={Rules.Required}>
            <Input />
          </Form.Item>
        </Form>
      </Card>

      <Lessons value={lessons} onChange={setLessons} />
      <Schedules value={schedules} onChange={setSchedules} />
    </>
  );
}

function Lessons({ value, onChange }) {
  const [visible, openModal, closeModal] = useBoolState();

  function onFinish(values) {
    onChange([...value, values]);
    closeModal();
  }

  return (
    <>
      <Card
        title="课堂列表"
        extra={
          <Button type="shade" onClick={openModal}>
            添加新课堂
          </Button>
        }
        noPadding
      >
        <ZebraTable
          rowKey="number"
          pagination={false}
          dataSource={value}
          columns={[
            {
              title: '序号',
              dataIndex: 'number',
            },
            {
              title: '适用宝宝成长时期区间',
              dataIndex: 'stage',
            },
            {
              title: '包含模块',
            },
            {
              title: '操作',
            },
          ]}
        />
      </Card>

      <ModalForm title="编辑课堂" visible={visible} onCancel={closeModal} onFinish={onFinish}>
        <Form.Item label="课堂序号" name="number">
          <Input />
        </Form.Item>
        <Form.Item label="课堂名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="课堂描述" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="适用宝宝" name="stage">
          <RadioEnum name="BabyStage" />
        </Form.Item>
        <Form.Item label="开始" name="startOfApplicableDays">
          <InputNumber />
        </Form.Item>
        <Form.Item label="结束" name="endOfApplicableDays">
          <InputNumber />
        </Form.Item>
        <Form.Item label="调查问卷" name="questionnaireAddress">
          <Input />
        </Form.Item>
        <Form.Item label="短信问卷" name="smsQuestionnaireAddress">
          <Input />
        </Form.Item>
      </ModalForm>
    </>
  );
}

function Schedules({ value, onChange }) {
  const [visible, openModal, closeModal] = useBoolState();

  function onFinish(values) {
    onChange([...value, values]);
    closeModal();
  }

  return (
    <>
      <Card
        title="课程区间匹配规则"
        extra={
          <Button type="shade" onClick={openModal}>
            添加规则
          </Button>
        }
        noPadding
      >
        <ZebraTable
          rowKey="name"
          pagination={null}
          dataSource={value}
          columns={[
            {
              title: '规则',
              dataIndex: 'name',
            },
            {
              title: '适用宝宝成长时期区间',
              dataIndex: 'stage',
            },
            {
              title: '包含课堂',
            },
            {
              title: '规则',
            },
          ]}
        />
      </Card>
      <ModalForm title="编辑规则" visible={visible} onCancel={closeModal} onFinish={onFinish}>
        <Form.Item label="规则名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="适用宝宝" name="stage">
          <RadioEnum name="BabyStage" />
        </Form.Item>
        <Form.Item label="开始" name="startOfApplicableMonths">
          <InputNumber />
        </Form.Item>
        <Form.Item label="结束" name="endOfApplicableMonths">
          <InputNumber />
        </Form.Item>
      </ModalForm>
    </>
  );
}
