import React, { useState } from 'react';
import moment from 'moment';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { Form, Button, Space, Input, Radio, message, Tooltip } from 'antd';

import { Required } from '../constants';
import { useFetch, useBoolState } from '../utils';
import { Gender, BabyStage, FamilyTies, FeedingPattern } from '../constants/enums';
import {
  Card,
  ZebraTable,
  BabyModalForm,
  StaticField,
  ModalForm,
  DetailHeader,
  DeleteConfirmModal,
  SelectEnum,
} from '../components/*';

export default function Baby() {
  const { id } = useParams();
  const [baby, refresh] = useFetch(`/admin/babies/${id}`);
  const [visible, openModal, closeModal] = useBoolState();

  const chw = () => baby.chw || {};
  const initialValues = () => ({
    ...baby,
    chw: null,
    area: (baby.area && baby.area.split('/')) || [],
    edc: baby.edc && moment(baby.edc),
    birthday: baby.birthday && moment(baby.birthday),
  });

  function handleChangeBaby(values) {
    values.area = values.area.join('/');
    values.birthday = values.birthday && moment(values.birthday).format('YYYY-MM-DD');
    values.edc = values.edc && moment(values.edc).format('YYYY-MM-DD');
    Axios.put(`/admin/babies/${id}`, { ...baby, ...values }).then(() => {
      refresh();
      closeModal();
    });
  }

  return (
    <>
      <DetailHeader
        icon="iconbaby-primary"
        menu="宝宝管理"
        title={baby.name}
        role={`宝宝ID ${baby.identity || ''}`}
        extra={
          <Button ghost type="danger">
            注销宝宝
          </Button>
        }
      />
      <Card title="负责社区工作者">
        <StaticField label="社区工作者ID">{chw().chw?.identity}</StaticField>
        <StaticField label="真实姓名">{chw().realName}</StaticField>
        <StaticField label="联系电话">{chw().phone}</StaticField>
      </Card>

      <Card
        title="宝宝信息"
        extra={
          <Button type="shade" onClick={openModal}>
            编辑资料
          </Button>
        }
      >
        <StaticField label="真实姓名">{baby.name}</StaticField>
        <StaticField label="性别">{Gender[baby.gender]}</StaticField>
        {baby.feedingPattern && (
          <StaticField label="喂养方式">{FeedingPattern[baby.feedingPattern]}</StaticField>
        )}
        <StaticField label="成长阶段">{BabyStage[baby.stage]}</StaticField>
        {baby.stage === 'EDC' ? (
          <StaticField label="预产期">{moment(baby.edc).format('YYYY-MM-DD')}</StaticField>
        ) : (
          <StaticField label="出生日期">{moment(baby.birthday).format('YYYY-MM-DD')}</StaticField>
        )}
        <StaticField label="所在区域">{baby.area}</StaticField>
        <StaticField label="详细地址">{baby.location}</StaticField>
        <StaticField label="备注信息">{baby.remark}</StaticField>
      </Card>

      <Carers babyId={id} />
      <BabyModalForm
        title="修改宝宝信息"
        visible={visible}
        onCancel={closeModal}
        onFinish={handleChangeBaby}
        initialValues={initialValues()}
        // 一旦进入婴幼期则不可修改回待产期
        disableStage={baby.stage === 'BIRTH'}
      />
    </>
  );
}

function Carers({ babyId }) {
  const [carer, setCarer] = useState({ master: false });
  const [visible, openModal, closeModal] = useBoolState(false);
  const [dataSource, refresh] = useFetch(`/admin/babies/${babyId}/carers`, {}, []);

  const openCarerEdit = (record) => {
    setCarer(record);
    openModal();
  };

  const safeCloseCarer = () => {
    setCarer({ master: false });
    closeModal();
  };

  async function handleDelete({ id, master }) {
    if (master) return message.warn('主看护人不可删除，请更换主看护人后进行此操作');
    await Axios.delete(`/admin/carers/${id}`);
    refresh();
  }

  async function onFinish(values) {
    const { id } = carer;
    const method = id ? 'put' : 'post';
    await Axios[method](`/admin/carers${id ? `/${id}` : ''}`, {
      baby: {
        id: babyId,
      },
      ...values,
    });
    refresh();
    safeCloseCarer();
  }

  return (
    <Card
      title="看护人列表"
      noPadding
      extra={
        <>
          {dataSource.length > 3 ? (
            <Tooltip title="看护人最多可添加4人">
              <Button disabled={true} type="shade">
                新增看护人
              </Button>
            </Tooltip>
          ) : (
            <Button onClick={openModal} type="shade">
              新增看护人
            </Button>
          )}
        </>
      }
    >
      <ModalForm
        title={`${carer.id ? '编辑' : '新增'}看护人`}
        initialValues={carer}
        visible={visible}
        onCancel={safeCloseCarer}
        onFinish={onFinish}
      >
        <Form.Item label="看护状态" name="master" rules={Required}>
          <Radio.Group>
            <Radio value={true}>主看护人</Radio>
            <Radio value={false}>次看护人</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="真实姓名" name="name" rules={Required}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item label="亲属关系" name="familyTies" rules={Required}>
          <SelectEnum name="FamilyTies" />
        </Form.Item>
        <Form.Item label="联系电话" name="phone" rules={Required}>
          <Input />
        </Form.Item>
        <Form.Item label="微信号" name="wechat">
          <Input />
        </Form.Item>
      </ModalForm>

      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: '主看护人',
            dataIndex: 'master',
            render(h) {
              return h ? '是' : '否';
            },
          },
          {
            title: '看护人姓名',
            dataIndex: 'name',
          },
          {
            title: '亲属关系',
            dataIndex: 'familyTies',
            render: (h) => FamilyTies[h],
          },
          {
            title: '联系电话',
            dataIndex: 'phone',
          },
          {
            title: '微信号',
            dataIndex: 'wechat',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 200,
            render(id, record) {
              return (
                <Space>
                  <Button size="small" type="link" onClick={() => openCarerEdit(record)}>
                    编辑
                  </Button>
                  <DeleteConfirmModal
                    title="删除看护人"
                    content="确认要删除此看护人？"
                    onConfirm={() => handleDelete(record)}
                  >
                    <Button size="small" type="link">
                      删除
                    </Button>
                  </DeleteConfirmModal>
                </Space>
              );
            },
          },
        ]}
      />
    </Card>
  );
}
