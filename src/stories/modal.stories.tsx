import { Modal } from "antd";
import { fn } from "@storybook/test";

const meta = {
  title: "Design System/Modal",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const BasicModalComponent = () => {
  return (
    <Modal title="Basic Modal" open={true} onOk={fn} onCancel={fn}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};
