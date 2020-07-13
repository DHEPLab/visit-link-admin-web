import React from 'react';
import { Button, Space } from 'antd';
import { useHistory } from 'react-router-dom';

import { WithPage, ContentHeader, ZebraTable, SearchInput } from '../components/*';

function Curriculums({ loadData, onChangeSearch, ...props }) {
  const history = useHistory();

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
            onClick: () => {
              history.push(`/curriculum/${record.id}`);
            },
          };
        }}
        columns={[
          {
            title: '课程状态',
            dataIndex: 'published',
            width: 120,
            align: 'center',
            render(h) {
              return h ? '已发布' : '草稿';
            },
          },
          {
            title: '课程名称',
            dataIndex: 'name',
          },
        ]}
      />
    </>
  );
}

export default WithPage(Curriculums, '/admin/curriculum?sort=id,desc');
