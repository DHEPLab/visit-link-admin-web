import { useTranslation } from "react-i18next";
import { Button, Form, Modal, Select, Space } from "antd";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { debounce } from "radash";
import axios from "axios";
import Rules from "@/constants/rules";
import { Page } from "@/models/res/Page";
import { ChwUser } from "@/models/res/User";
import styled from "@emotion/styled";

interface CloseChwAccountModalProps {
  id?: string;
  visible: boolean;
  isBabiesEmpty: boolean;
  onCancel: MouseEventHandler;
  onFinish: (values: { userId: number }) => void;
}

const CustomSelectorWrapper = styled.div`
  .ant-select.baby-transfer-selector .ant-select-selector {
    width: 100%;
  }
`;

const CloseChwAccountModal: React.FC<CloseChwAccountModalProps> = ({
  id,
  visible,
  isBabiesEmpty,
  onCancel,
  onFinish,
}) => {
  const { t } = useTranslation(["user", "common"]);
  const [form] = Form.useForm();
  const [options, setOptions] = useState<ChwUser[]>([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const debounceSearch = debounce({ delay: 400 }, (search?: string) => {
    axios
      .get<Page<ChwUser>>("/admin/users/chw", {
        params: {
          search,
          size: 10,
        },
      })
      .then((response) => setOptions(response.data.content));
  });

  return (
    <Modal
      title={t("deleteChw")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      open={visible}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button danger type="primary" onClick={form.submit}>
            {t("delete")}
          </Button>
        </Space>
      }
    >
      <p>
        {t("generalDeleteMessage")}
        {!isBabiesEmpty && t("babyNotEmptyMessage")}
      </p>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 0 }}>
        {!isBabiesEmpty && (
          <CustomSelectorWrapper>
            <Form.Item label={t("chw")} name="userId" rules={Rules.Required}>
              <Select
                showSearch
                filterOption={false}
                onFocus={() => debounceSearch()}
                onSearch={debounceSearch}
                style={{ width: "100%" }}
                className={"baby-transfer-selector"}
                placeholder={t("selectBabyPlaceholder")}
              >
                {options
                  .filter((o) => o.user.id !== Number(id))
                  .map((o) => (
                    <Select.Option key={o.user.id}>
                      {o.user.realName}/{o.user.chw?.identity}/{(o.user.chw?.tags || []).join(",")} // TODO: fix the
                      lang en tags
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </CustomSelectorWrapper>
        )}
      </Form>
    </Modal>
  );
};

export default CloseChwAccountModal;
