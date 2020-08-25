import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import { Modal, Button, Space, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { debounce } from 'lodash';

import { Gender } from '../constants/enums';
import { useManualFetch, useBoolState } from '../utils';
import {
  StatusTag,
  WithPage,
  ContentHeader,
  ZebraTable,
  SearchInput,
  AssignModalTable,
} from '../components/*';

function Curriculums({ loadData, onChangeSearch, ...props }) {
  const history = useHistory();
  const [visible, openModal, closeModal] = useBoolState(false);
  const [curriculumId, setCurriculumId] = useState();

  function openBabiesModal(id) {
    setCurriculumId(id);
    openModal();
  }

  return (
    <>
      <ContentHeader title="大纲管理">
        <Space size="large">
          <SearchInput
            onChange={(e) => onChangeSearch('search', e.target.value)}
            className="master"
            placeholder="请输入大纲名称搜索"
          />
          <Button type="primary" onClick={() => history.push('/curriculums/create')}>
            创建新大纲
          </Button>
        </Space>
      </ContentHeader>

      <ZebraTable
        {...props}
        rowKey="id"
        className="clickable"
        onRow={(record) => {
          return {
            onClick: (event) => {
              // do noting when click other target
              if (event.target.tagName === 'TD') {
                history.push(`/curriculums/${record.id}`);
              }
            },
          };
        }}
        columns={[
          {
            title: '大纲状态',
            dataIndex: 'published',
            width: 120,
            align: 'center',
            render: (h) => <StatusTag value={h} />,
          },
          {
            title: '大纲名称',
            dataIndex: 'name',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 200,
            align: 'center',
            render(id) {
              return (
                <Button type="link" size="small" onClick={() => openBabiesModal(id)}>
                  分配宝宝
                </Button>
              );
            },
          },
        ]}
      />

      <PageCurriculumBabiesModal
        curriculumId={curriculumId}
        visible={visible}
        onCancel={closeModal}
      />
    </>
  );
}

const PageCurriculumBabiesModal = WithPage(CurriculumBabiesModal);

function CurriculumBabiesModal({
  curriculumId,
  visible,
  onCancel,
  loadData,
  onChangeLoadURL,
  onChangeSearch,
  ...props
}) {
  const [assign, openModal, closeModal] = useBoolState();
  const [notAssignedDataSource, refreshNotAssigned] = useManualFetch(
    `/admin/curriculums/not_assigned/babies`,
    {},
    []
  );

  useEffect(() => {
    if (curriculumId) onChangeLoadURL(`/admin/curriculums/${curriculumId}/babies`);
    // eslint-disable-next-line
  }, [curriculumId]);

  useEffect(() => {
    if (assign) refreshNotAssigned();
    // eslint-disable-next-line
  }, [assign]);

  function handleAssign(babyIds) {
    Axios.post(`/admin/curriculums/${curriculumId}/babies`, babyIds).then(() => {
      loadData();
      closeModal();
    });
  }

  function handleReleaseBaby(id) {
    Axios.delete(`/admin/babies/${id}/curriculum`).then(() => loadData());
  }

  const debounceRefresh = debounce((search) => refreshNotAssigned({ search }), 400);

  return (
    <Modal
      title="宝宝列表"
      visible={visible}
      onCancel={onCancel}
      width={1152}
      footer={null}
      bodyStyle={{ padding: 0 }}
    >
      <ModalHeader>
        <Title>
          <label>大纲分配宝宝列表</label>
          <Tooltip title="宝宝将自动分配至最新发布的大纲版本" placement="right">
            <InfoCircleFilled />
          </Tooltip>
        </Title>
        <Button type="shade" onClick={openModal}>
          添加新宝宝
        </Button>
      </ModalHeader>

      <ZebraTable
        {...props}
        rowKey="id"
        columns={[
          {
            title: '宝宝姓名',
            dataIndex: 'name',
            width: 100,
          },
          {
            title: 'ID',
            dataIndex: 'identity',
            width: 120,
          },
          {
            title: '性别',
            dataIndex: 'gender',
            render: (h) => Gender[h],
            width: 80,
          },
          {
            title: '所在区域',
            dataIndex: 'area',
            width: 300,
          },
          {
            title: '主照料人',
            dataIndex: 'masterCarerName',
            width: 120,
          },
          {
            title: '联系电话',
            dataIndex: 'masterCarerPhone',
            width: 120,
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 100,
            align: 'center',
            render(id) {
              return (
                <Button type="link" size="small" onClick={() => handleReleaseBaby(id)}>
                  删除
                </Button>
              );
            },
          },
        ]}
      />

      <AssignModalTable
        title="添加新宝宝"
        visible={assign}
        onChangeSearch={(e) => debounceRefresh(e.target.value)}
        onCancel={closeModal}
        dataSource={notAssignedDataSource}
        onFinish={handleAssign}
        columns={[
          {
            title: '宝宝姓名',
            dataIndex: 'name',
          },
          {
            title: 'ID',
            dataIndex: 'identity',
          },
          {
            title: '所在区域',
            dataIndex: 'area',
          },
        ]}
      />
    </Modal>
  );
}

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  height: 70px;
  border-bottom: 2px solid #eee;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  label {
    color: #4a4a4a;
    font-size: 20px;
    font-weight: bold;
    margin-right: 5px;
  }
`;

export default WithPage(Curriculums, '/admin/curriculums?sort=id,desc');
