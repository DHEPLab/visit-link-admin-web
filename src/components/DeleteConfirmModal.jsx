import React from "react";
import { useTranslation } from "react-i18next";

import { useBoolState } from "../utils";
import { Space, Button, Modal } from "antd";

export default function DeleteConfirmModal(props) {
  const { t } = useTranslation(["common"]);
  const {
    title = t("delete"),
    content = `${t("confirm")} ${t("wordBreak")} ${t("delete")}?`,
    onConfirm,
    children,
    okText = t("delete"),
  } = props;
  const [visible, openModal, closeModal] = useBoolState();

  return (<>
    <div onClick={openModal}>{children}</div>
    <Modal
      style={{ top: "30%" }}
      closable={false}
      open={visible}
      title={title}
      footer={
        <Space size="large">
          <Button ghost danger onClick={closeModal}>
            {t("cancel")}
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
  </>);
}
