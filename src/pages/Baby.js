import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { Form, Modal, Button, Space, Input, Radio, Select } from 'antd';

import StaticField from '../components/StaticField';
import { Required } from '../constants';
import { useFetch, useBoolState } from '../utils';
import { Card, ZebraTable } from '../components/*';
import { Gender, BabyStage, FamilyTies } from '../constants/enums';

export default function Baby() {
  const { id } = useParams();
  const [baby] = useFetch(`/admin/baby/${id}`);

  const chw = () => baby.chw || {};

  return (
    <>
      <Card title="宝宝信息">
        <StaticField label="真实姓名">{baby.name}</StaticField>
        <StaticField label="ID">{baby.identity}</StaticField>
        <StaticField label="性别">{Gender[baby.gender]}</StaticField>
        <StaticField label="成长阶段">{BabyStage[baby.stage]}</StaticField>
        {baby.stage === 'EDC' ? (
          <StaticField label="预产期">{moment(baby.edc).format('YYYY-MM-DD')}</StaticField>
        ) : (
          <StaticField label="出生日期">{moment(baby.birthday).format('YYYY-MM-DD')}</StaticField>
        )}
        <StaticField label="详细地址">{baby.location}</StaticField>
        <StaticField label="备注信息">{baby.remark}</StaticField>
      </Card>
      <Carers babyId={id} />
      <Card title="负责社区工作者">
        <StaticField label="真实姓名">{chw().realName}</StaticField>
        <StaticField label="联系电话">{chw().phone}</StaticField>
      </Card>
    </>
  );
}

function Carers({ babyId }) {
  const [dataSource, refresh] = useFetch(`/admin/baby/${babyId}/carer`, {}, []);
  const [carer, setCarer] = useState({});
  const [visible, openCarer, closeCarer] = useBoolState(false);

  const openCarerEdit = (record) => {
    setCarer(record);
    openCarer();
  };

  const safeCloseCarer = () => {
    setCarer({});
    closeCarer();
  };

  function handleDelete(id) {
    Axios.delete(`/admin/carer/${id}`).then(refresh);
  }

  return (
    <Card
      title="照料人列表"
      noPadding
      extra={
        <Button onClick={openCarer} type="link">
          新增照看人
        </Button>
      }
    >
      <CarerFormModal
        carer={carer}
        babyId={babyId}
        visible={visible}
        onCancel={safeCloseCarer}
        onSuccess={() => {
          refresh();
          safeCloseCarer();
        }}
      />
      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: '主照看人',
            dataIndex: 'master',
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
            title: '微信号',
            dataIndex: 'wechat',
            align: 'center',
          },
          {
            title: '操作',
            dataIndex: 'id',
            align: 'center',
            width: 200,
            render(id, record) {
              return (
                <Space>
                  <Button size="small" type="link" onClick={() => handleDelete(id)}>
                    移除
                  </Button>
                  <Button size="small" type="link" onClick={() => openCarerEdit(record)}>
                    编辑
                  </Button>
                </Space>
              );
            },
          },
        ]}
      />
    </Card>
  );
}

function CarerFormModal({ carer, babyId, onSuccess, ...props }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!props.visible) return;
    carer.id ? form.setFieldsValue(carer) : form.resetFields();
  }, [props.visible, carer, form]);

  function onFinish(values) {
    const { id } = carer;
    const method = id ? 'put' : 'post';
    Axios[method](`/admin/carer${id ? `/${id}` : ''}`, {
      baby: {
        id: babyId,
      },
      ...values,
    }).then(onSuccess);
  }

  return (
    <Modal
      destroyOnClose
      title={`${carer.id ? '编辑' : '新增'}照看人`}
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
        initialValues={{ master: true }}
        labelCol={{ span: 4 }}
        wrapperCol={{ offset: 1 }}
        onFinish={onFinish}
      >
        <Form.Item label="看护状态" name="master" rules={Required}>
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
        <Form.Item label="微信号" name="wechat">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
