import { Button, Flex } from "antd";

const meta = {
  title: "Design System/Button",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const ButtonComponent = () => {
  return (
    <Flex gap="large" align="flex-start" vertical>
      <Flex gap="small" wrap>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </Flex>
      <Flex gap="small" wrap>
        <Button type="primary" size={"large"}>
          Large
        </Button>

        <Button type="primary" size={"middle"}>
          Middle
        </Button>
        <Button type="primary" size={"small"}>
          Small
        </Button>
      </Flex>
      <Flex gap="small" wrap>
        <Button type="primary" disabled>
          Primary Disabled
        </Button>
        <Button danger disabled>
          Danger disabled
        </Button>
        <Button ghost disabled>
          Ghost disabled
        </Button>
      </Flex>
      <Flex gap="small" wrap>
        <Button type="primary" danger>
          Primary
        </Button>
        <Button danger>Default</Button>
        <Button type="dashed" danger>
          Dashed
        </Button>
        <Button type="text" danger>
          Text
        </Button>
        <Button type="link" danger>
          Link
        </Button>
      </Flex>
      <Flex gap="small" wrap>
        <Button type="primary" ghost>
          Primary
        </Button>
        <Button ghost>Default</Button>
        <Button type="dashed" ghost>
          Dashed
        </Button>
        <Button type="primary" danger ghost>
          Danger
        </Button>
      </Flex>
    </Flex>
  );
};
