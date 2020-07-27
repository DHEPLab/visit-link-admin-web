import React from 'react';

import { useBoolState } from '../utils';
import { Space, Button, Modal } from 'antd';

export default function DeleteConfirmModal({ title, content, onConfirm, children }) {
  const [visible, openModal, closeModal] = useBoolState();

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <Modal
        style={{ top: '30%' }}
        closable={false}
        visible={visible}
        title={title}
        footer={
          <Space size="large">
            <Button ghost type="danger" onClick={closeModal}>
              再想想
            </Button>
            <Button
              type="danger"
              onClick={() => {
                closeModal();
                onConfirm();
              }}
            >
              删除
            </Button>
          </Space>
        }
      >
        {content}
      </Modal>
    </>
  );
}
