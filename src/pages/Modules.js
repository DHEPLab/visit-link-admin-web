import React from 'react';
import Axios from 'axios';
import { Button, Space } from 'antd';
import { useHistory } from 'react-router-dom';

import {
  WithPage,
  ContentHeader,
  ZebraTable,
  SearchInput,
  DeletePopconfirm,
} from '../components/*';
import { ModuleTopic } from '../constants/enums';

function Components({ loadData, onChangeSearch, ...props }) {
  const history = useHistory();

  function handleDelete(id) {
    Axios.delete(`/admin/module/${id}`).then(loadData);
  }

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
        columns={[
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
          {
            title: '操作',
            width: 200,
            align: 'center',
            dataIndex: 'id',
            render(id, { draftId }) {
              return (
                <Space>
                  {draftId ? (
                    <Space size="large">
                      <Button
                        size="small"
                        type="link"
                        onClick={() => history.push(`/modules/edit/${draftId}`)}
                      >
                        编辑草稿
                      </Button>
                      <DeletePopconfirm onConfirm={() => handleDelete(draftId)}>
                        <Button size="small" type="link">
                          删除草稿
                        </Button>
                      </DeletePopconfirm>
                    </Space>
                  ) : (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => history.push(`/modules/edit/${id}`)}
                    >
                      编辑
                    </Button>
                  )}
                </Space>
              );
            },
          },
        ]}
      />
    </>
  );
}

export default WithPage(Components, '/admin/module?sort=id,desc');
