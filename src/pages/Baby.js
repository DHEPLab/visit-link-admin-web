import React from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Button, Table } from 'antd';

import { useFetch } from '../utils';
import { Card, StaticFormItem } from '../components/*';
import { Gender, BabyStage } from '../constants/enums';

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
      <Carers />
      <Card title="负责社区工作者">
        <StaticFormItem label="真实姓名">{chw().realName}</StaticFormItem>
        <StaticFormItem label="联系电话">{chw().phone}</StaticFormItem>
      </Card>
    </>
  );
}

function Carers() {
  return (
    <Card title="照料人列表" extra={<Button type="link">新增照看人</Button>}>
      <Table />
    </Card>
  );
}
