import "antd/dist/reset.css";
import type { Preview } from "@storybook/react";
import { componentConfig, visitLinkTheme } from "../src/theme";
import { ConfigProvider, theme } from "antd";
import { useContext } from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
      const rootPrefixCls = getPrefixCls();
      const component = componentConfig(rootPrefixCls);
      const themeToken = theme.useToken();

      return (
        <ConfigProvider theme={visitLinkTheme(themeToken.token)} {...component}>
          <Story />
        </ConfigProvider>
      );
    },
  ],
};

export default preview;
