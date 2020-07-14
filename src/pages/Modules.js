import React from 'react';
import { Button, Space } from 'antd';
import { useHistory } from 'react-router-dom';

import { ModuleTopic } from '../constants/enums';
import { WithPage, ContentHeader, ZebraTable, SearchInput, Published } from '../components/*';

function Components({ loadData, onChangeSearch, ...props }) {
  const history = useHistory();

  return (
    <>
      <ContentHeader title="模块管理">
        <Space size="large">
          <SearchInput
            onChange={(e) => onChangeSearch('search', e.target.value)}
            className="master"
            placeholder="请输入模块名称搜索"
          />
          <Button type="primary" onClick={() => history.push('/modules/create')}>
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
              history.push(`/modules/${record.id}`);
            },
          };
        }}
        columns={[
          {
            title: '模块状态',
            dataIndex: 'published',
            width: 120,
            align: 'center',
            render: (h) => <Published value={h} />,
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

export default WithPage(Components, '/admin/modules');
