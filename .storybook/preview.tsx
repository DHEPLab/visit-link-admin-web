import "antd/dist/reset.css";
import type { Preview } from "@storybook/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/i18n";
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
        <I18nextProvider i18n={i18n}>
          <ConfigProvider theme={visitLinkTheme(themeToken.token)} {...component}>
            <Story />
          </ConfigProvider>
        </I18nextProvider>
      );
    },
  ],
};

export default preview;
