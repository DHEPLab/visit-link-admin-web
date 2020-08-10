import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal, Form, Button, Space, Input, Radio, message, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import Rules from '../constants/rules';
import Visit from '../utils/visit';
import { useFetch, useBoolState } from '../utils';
import {
  Gender,
  CurriculumBabyStage,
  FamilyTies,
  FeedingPattern,
  VisitStatus,
} from '../constants/enums';
import {
  Card,
  ZebraTable,
  BabyModalForm,
  StaticField,
  ModalForm,
  DetailHeader,
  DeleteConfirmModal,
  SelectEnum,
  BabyReviewBar,
} from '../components/*';

export default function Baby() {
  const { id } = useParams();
  const [baby, refresh] = useFetch(`/admin/babies/${id}`);
  const [visible, openModal, closeModal] = useBoolState();
  const [approveCreateVisible, openApproveCreateModal, closeApproveCreateModal] = useBoolState();

  const { chw, approved, actionFromApp } = baby;
  const initialValues = () => ({
    ...baby,
    chw: null,
    area: (baby.area && baby.area.split('/')) || [],
    edc: baby.edc && moment(baby.edc),
    birthday: baby.birthday && moment(baby.birthday),
  });

  function handleChangeBaby(values) {
    values.area = values.area.join('/');
    // format birthday and edc to string date
    values.birthday = values.birthday && moment(values.birthday).format('YYYY-MM-DD');
    values.edc = values.edc && moment(values.edc).format('YYYY-MM-DD');
    Axios.put(`/admin/babies/${id}`, { ...baby, ...values }).then(() => {
      refresh();
      closeModal();
    });
  }

  function handleApprove() {
    switch (actionFromApp) {
      case 'CREATE':
        openApproveCreateModal();
        break;
      default:
        break;
    }
  }

  function handleApproveCreateFinish(values) {
    Axios.put(`/admin/babies/${id}/approve`, values).then(() => {
      closeApproveCreateModal();
      refresh();
    });
  }

  if (!baby.id) return null;

  return (
    <>
      <DetailHeader
        icon="iconbaby-primary"
        menu="宝宝管理"
        title={baby.name}
        role={`宝宝ID ${baby.identity || '待核准'}`}
        extra={
          approved && (
            <Button ghost type="danger">
              注销宝宝
            </Button>
          )
        }
      />

      {!approved && <BabyReviewBar baby={baby} onApprove={handleApprove} />}
      <ApproveCreateBabyModal
        visible={approveCreateVisible}
        onCancel={closeApproveCreateModal}
        onFinish={handleApproveCreateFinish}
      />

      <Card title="负责社区工作者">
        <StaticField label="社区工作者ID">{chw?.chw?.identity}</StaticField>
        <StaticField label="真实姓名">{chw?.realName}</StaticField>
        <StaticField label="联系电话">{chw?.phone}</StaticField>
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
        <StaticField label="成长阶段">
          {CurriculumBabyStage[baby.stage]} {baby.months} 个月
        </StaticField>
        {baby.stage === 'EDC' ? (
          <StaticField label="预产期">{moment(baby.edc).format('YYYY-MM-DD')}</StaticField>
        ) : (
          <>
            <StaticField label="出生日期">{moment(baby.birthday).format('YYYY-MM-DD')}</StaticField>
            <StaticField label="辅食">{baby.assistedFood ? '已添加' : '未添加'}</StaticField>
            <StaticField label="喂养方式">{FeedingPattern[baby.feedingPattern]}</StaticField>
          </>
        )}
        <StaticField label="所在区域">{baby.area}</StaticField>
        <StaticField label="详细地址">{baby.location}</StaticField>
        <StaticField label="备注信息">{baby.remark}</StaticField>
      </Card>

      <Carers babyId={id} />
      <Visits babyId={id} />

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

function ApproveCreateBabyModal({ id, onCancel, onFinish, ...props }) {
  const [form] = Form.useForm();
  useEffect(() => {
    props.visible && form.resetFields();
  }, [props, form]);

  return (
    <Modal
      title="您确定要批准创建新宝宝账户的申请吗？"
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost type="danger" onClick={onCancel}>
            稍后再说
          </Button>
          <Button type="danger" onClick={form.submit}>
            批准申请
          </Button>
        </Space>
      }
      {...props}
    >
      <p>
        请先核对社区工作者提交的新宝宝账户信息，并设置宝宝
        ID，即可批准该账户新建申请。一旦批准申请后，宝宝ID将不可更改。
      </p>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 0 }}>
        <Form.Item label="宝宝ID" name="identity" rules={Rules.Required}>
          <Input autoFocus style={{ width: '100%' }} placeholder="请输入宝宝的ID" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function Visits({ babyId }) {
  const [dataSource] = useFetch(`/admin/babies/${babyId}/visits`, {}, []);

  return (
    <Card title="家访记录" noPadding>
      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: '家访状态',
            dataIndex: 'status',
            width: 140,
            align: 'center',
            render: (h) => VisitStatus[h],
          },
          {
            title: '家访时间',
            dataIndex: 'visitTime',
            width: 280,
            render: (h) => Visit.formatDateTimeCN(h),
          },
          {
            title: '课堂内容',
            dataIndex: 'lesson',
            width: 300,
            render: (h) => h?.modules?.map((m) => m.label).join(', '),
          },
          {
            title: '过期/未完成原因',
            dataIndex: 'remark',
          },
        ]}
      />
    </Card>
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

  async function submit(values) {
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

  function onFinish(values) {
    if (
      values.master &&
      dataSource.filter((item) => item.id !== carer.id).find((item) => item.master)
    ) {
      Modal.confirm({
        title: '确认',
        icon: <ExclamationCircleOutlined />,
        content: '设置当前看护人为主看护人时会替换原来的看护人，是否继续？',
        cancelText: '再想想',
        okText: '继续',
        onOk: () => submit(values),
      });
      return;
    }
    submit(values);
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
            <Button onClick={openModal} type="shade" data-testid="add-carer">
              新增看护人
            </Button>
          )}
        </>
      }
    >
      <ModalForm
        labelWidth={120}
        title={`${carer.id ? '编辑' : '新增'}看护人`}
        initialValues={carer}
        visible={visible}
        onCancel={safeCloseCarer}
        onFinish={onFinish}
      >
        <Form.Item label="主看护人" name="master" rules={Rules.Required}>
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="真实姓名" name="name" rules={Rules.Required}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          label="亲属关系"
          name="familyTies"
          rules={[
            ...Rules.Required,
            () => ({
              validator: (_, value) => {
                if (
                  !value ||
                  !dataSource
                    .filter((item) => item.id !== carer.id)
                    .find((item) => item.familyTies === value)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject('亲属关系不能重复选择');
              },
            }),
          ]}
        >
          <SelectEnum name="FamilyTies" />
        </Form.Item>
        <Form.Item label="联系电话" name="phone" rules={Rules.Phone}>
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
            width: 140,
            align: 'center',
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
            align: 'center',
            render(id, record) {
              return (
                <Space>
                  <DeleteConfirmModal
                    title="删除看护人"
                    content="确认要删除此看护人？"
                    onConfirm={() => handleDelete(record)}
                  >
                    <Button size="small" type="link">
                      删除
                    </Button>
                  </DeleteConfirmModal>
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
