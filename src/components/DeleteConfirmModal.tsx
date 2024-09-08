import React, { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import useBoolState from "@/hooks/useBoolState";
import { Space, Button, Modal } from "antd";

interface DeleteConfirmModalProps {
  title?: string;
  content?: string;
  onConfirm: VoidFunction;
  okText?: string;
  cancelText?: string;
}

const DeleteConfirmModal: React.FC<PropsWithChildren<DeleteConfirmModalProps>> = (props) => {
  const { t } = useTranslation(["common"]);
  const {
    title = t("delete"),
    content = `${t("confirm")} ${t("wordBreak")} ${t("delete")}?`,
    onConfirm,
    children,
    okText = t("delete"),
    cancelText = t("cancel"),
  } = props;
  const [visible, openModal, closeModal] = useBoolState();

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <Modal
        style={{ top: "30%" }}
        closable={false}
        open={visible}
        title={title}
        footer={
          <Space size="large">
            <Button ghost danger onClick={closeModal}>
              {cancelText}
            </Button>
            <Button
              danger
              type="primary"
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
};

export default DeleteConfirmModal;
