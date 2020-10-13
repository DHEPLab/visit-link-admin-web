import React from "react";

import { useBoolState } from "../utils";
import { Space, Button, Modal } from "antd";

export default function DeleteConfirmModal({
  title = "删除",
  content = "确认删除？",
  onConfirm,
  children,
  okText = "删除",
}) {
  const [visible, openModal, closeModal] = useBoolState();

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <Modal
        style={{ top: "30%" }}
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
              {okText}
            </Button>
          </Space>
        }
      >
        {content}
      </Modal>
    </>
  );
}
