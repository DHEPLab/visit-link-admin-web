import React, { useEffect } from 'react';
import moment from 'moment';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { Form, Modal, Button, Table, Space, Input, Radio, Select } from 'antd';

import { Required } from '../constants';
import { useFetch, useBoolState } from '../utils';
import { Card, StaticFormItem } from '../components/*';
import { Gender, BabyStage, FamilyTies } from '../constants/enums';

export default function Baby() {
  const { id } = useParams();
  const [baby] = useFetch(`/admin/baby/${id}`);

  const chw = () => baby.chw || {};

  return (
    <>
      <Card title="宝宝信息">
        <StaticFormItem label="真实姓名">{baby.name}</StaticFormItem>
        <StaticFormItem label="ID">{baby.identity}</StaticFormItem>
        <StaticFormItem label="性别">{Gender[baby.gender]}</StaticFormItem>
        <StaticFormItem label="成长阶段">{BabyStage[baby.stage]}</StaticFormItem>
        {baby.stage === 'EDC' ? (
          <StaticFormItem label="预产期">{moment(baby.edc).format('YYYY-MM-DD')}</StaticFormItem>
        ) : (
          <StaticFormItem label="出生日期">
            {moment(baby.birthday).format('YYYY-MM-DD')}
          </StaticFormItem>
        )}
        <StaticFormItem label="详细地址">{baby.location}</StaticFormItem>
        <StaticFormItem label="备注信息">{baby.remark}</StaticFormItem>
      </Card>
      <Carers babyId={id} />
      <Card title="负责社区工作者">
        <StaticFormItem label="真实姓名">{chw().realName}</StaticFormItem>
        <StaticFormItem label="联系电话">{chw().phone}</StaticFormItem>
      </Card>
    </>
  );
}

function Carers({ babyId }) {
  const [dataSource, refresh] = useFetch(`/admin/baby/${babyId}/carer`, {}, []);
  const [visible, openCarer, closeCarer] = useBoolState(false);

  function handleDelete(id) {
    Axios.delete(`/admin/carer/${id}`).then(refresh);
  }

  return (
    <Card
      title="照料人列表"
      extra={
        <Button onClick={openCarer} type="link">
          新增照看人
        </Button>
      }
    >
      <CarerFormModal
        babyId={babyId}
        visible={visible}
        onCancel={closeCarer}
        onSuccess={() => {
          refresh();
          closeCarer();
        }}
      />
      <Table
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: '主照看人',
            dataIndex: 'primary',
            align: 'center',
            render(h) {
              return h ? '是' : '否';
            },
          },
          {
            title: '照料人姓名',
            dataIndex: 'name',
            align: 'center',
          },
          {
            title: '亲属关系',
            dataIndex: 'familyTies',
            align: 'center',
            render: (h) => FamilyTies[h],
          },
          {
            title: '联系电话',
            dataIndex: 'phone',
            align: 'center',
          },
          {
            title: '操作',
            dataIndex: 'id',
            align: 'center',
            width: 200,
            render(id) {
              return (
                <Space>
                  <Button type="link" onClick={() => handleDelete(id)}>
                    移除
                  </Button>
                  <Button type="link">编辑</Button>
                </Space>
              );
            },
          },
        ]}
      />
    </Card>
  );
}

function CarerFormModal({ babyId, onSuccess, ...props }) {
  const [form] = Form.useForm();

  useEffect(() => {
    props.visible && form.resetFields();
  }, [props.visible, form]);

  function onFinish(values) {
    Axios.post('/admin/carer', {
      baby: {
        id: babyId,
      },
      ...values,
    }).then(onSuccess);
  }

  return (
    <Modal
      destroyOnClose
      title="新增照看人"
      footer={
        <Space>
          <Button ghost type="primary" onClick={props.onCancel}>
            放弃
          </Button>
          <Button type="primary" onClick={form.submit}>
            确定
          </Button>
        </Space>
      }
      {...props}
    >
      <Form
        form={form}
        initialValues={{ primary: true }}
        labelCol={{ span: 4 }}
        wrapperCol={{ offset: 1 }}
        onFinish={onFinish}
      >
        <Form.Item label="看护状态" name="primary" rules={Required}>
          <Radio.Group>
            <Radio value={true}>主看护人</Radio>
            <Radio value={false}>次看护人</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="真实姓名" name="name" rules={Required}>
          <Input />
        </Form.Item>
        <Form.Item label="亲属关系" name="familyTies" rules={Required}>
          <Select>
            {Object.keys(FamilyTies).map((key) => (
              <Select.Option key={key} value={key}>
                {FamilyTies[key]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="联系电话" name="phone" rules={Required}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
