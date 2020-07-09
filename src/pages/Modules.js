import React from 'react';
// import Axios from 'axios';
import { Button, Space } from 'antd';
import { useHistory } from 'react-router-dom';

import {
  WithPage,
  ContentHeader,
  ZebraTable,
  SearchInput,
  // DeletePopconfirm,
} from '../components/*';
import { ModuleTopic } from '../constants/enums';

function Components({ loadData, onChangeSearch, ...props }) {
  const history = useHistory();

  // function handleDelete(id) {
  //   Axios.delete(`/admin/module/${id}`).then(loadData);
  // }

  return (
    <>
      <ContentHeader title="模块管理">
        <Space size="large">
          <SearchInput
            onChange={(e) => onChangeSearch('search', e.target.value)}
            className="master"
            placeholder="请输入模块名称搜索"
          />
          <Button type="primary" onClick={() => history.push('/modules/new')}>
            创建新模块
          </Button>
        </Space>
      </ContentHeader>

      <ZebraTable
        {...props}
        rowKey="id"
        className="clickable"
        onRow={(record) => {
          return {
            onClick: () => {
              history.push(`/modules/edit/${record.id}`);
            },
          };
        }}
        columns={[
          {
            title: '模块状态',
            dataIndex: 'draftId',
            width: 150,
            render(h) {
              return h ? '有草稿' : '已发布';
            },
          },
          {
            title: '模块编号',
            dataIndex: 'number',
            width: 150,
          },
          {
            title: '模块名称',
            dataIndex: 'name',
          },
          {
            title: '模块主题',
            dataIndex: 'topic',
            render: (h) => ModuleTopic[h],
          },
        ]}
      />
    </>
  );
}

export default WithPage(Components, '/admin/module?sort=id,desc');
