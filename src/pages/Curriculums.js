import React from 'react';
import { Button, Space } from 'antd';
import { useHistory } from 'react-router-dom';

import { Published, WithPage, ContentHeader, ZebraTable, SearchInput } from '../components/*';

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
                <Button type="link" size="small">
                  分配宝宝
                </Button>
              );
            },
          },
        ]}
      />
    </>
  );
}

export default WithPage(Curriculums, '/admin/curriculums?sort=id,desc');
