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

  // async function handleDelete(id) {
  //   await Axios.delete(`/admin/module/${id}`);
  //   loadData();
  // }

  return (
    <>
      <ContentHeader title="模块管理">
        <Space size="large">
          <SearchInput className="master" placeholder="请输入模块名称搜索" />
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
                  {/* <DeletePopconfirm onConfirm={() => handleDelete(id)}>
                    <Button size="small" type="link">
                      删除
                    </Button>
                  </DeletePopconfirm> */}
                  {draftId ? (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => history.push(`/modules/edit/${draftId}`)}
                    >
                      编辑草稿
                    </Button>
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
