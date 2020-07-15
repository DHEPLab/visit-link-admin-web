import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import { Modal, Button, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import { debounce } from 'lodash';

import { useManualFetch, useBoolState } from '../utils';
import { Gender } from '../constants/enums';
import {
  Published,
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
      <ContentHeader title="课程管理">
        <Space size="large">
          <SearchInput
            onChange={(e) => onChangeSearch('search', e.target.value)}
            className="master"
            placeholder="请输入课程名称搜索"
          />
          <Button type="primary" onClick={() => history.push('/curriculums/create')}>
            创建新课程
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
            title: '课程状态',
            dataIndex: 'published',
            width: 120,
            align: 'center',
            render: (h) => <Published value={h} />,
          },
          {
            title: '课程名称',
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

      <CurriculumBabiesModal curriculumId={curriculumId} visible={visible} onCancel={closeModal} />
    </>
  );
}

function CurriculumBabiesModal({ curriculumId, visible, onCancel }) {
  const [assign, openModal, closeModal] = useBoolState();
  const [assignedDataSource, refreshAssigned] = useManualFetch(
    `/admin/curriculums/${curriculumId}/babies`,
    {},
    []
  );

  const [notAssignedDataSource, refreshNotAssigned] = useManualFetch(
    `/admin/curriculums/not_assigned/babies`,
    {},
    []
  );

  useEffect(() => {
    if (curriculumId) refreshAssigned();
    // eslint-disable-next-line
  }, [curriculumId]);

  useEffect(() => {
    if (assign) refreshNotAssigned();
    // eslint-disable-next-line
  }, [assign]);

  function handleAssign(babyIds) {
    Axios.post(`/admin/curriculums/${curriculumId}/babies`, babyIds).then(() => {
      refreshAssigned();
      closeModal();
    });
  }

  function handleReleaseBaby(id) {
    Axios.delete(`/admin/babies/${id}/curriculum`).then(() => refreshAssigned());
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
        <Title>课程分配宝宝列表</Title>
        <Button type="shade" onClick={openModal}>
          添加新宝宝
        </Button>
      </ModalHeader>
      <ZebraTable
        rowKey="id"
        dataSource={assignedDataSource}
        pagination={false}
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
            title: '性别',
            dataIndex: 'gender',
            render: (h) => Gender[h],
          },
          {
            title: '所在区域',
            dataIndex: 'area',
          },
          {
            title: '主照料人',
            dataIndex: 'masterCarerName',
          },
          {
            title: '联系电话',
            dataIndex: 'masterCarerPhone',
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
  color: #4a4a4a;
  font-size: 20px;
  font-weight: bold;
`;

export default WithPage(Curriculums, '/admin/curriculums?sort=id,desc');
