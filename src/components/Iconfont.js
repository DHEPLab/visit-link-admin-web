import { createFromIconfontCN } from "@ant-design/icons";
import styled from "styled-components";

// iconfont project healthy-future-admin
// https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=1901605
export default styled(
  createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_1901605_40b1eml7bxn.js",
  })
)`
  svg {
    ${({ opacity }) => opacity && `opacity: ${opacity};`}
    ${({ size }) => `
      width: ${size || 16}px;
      height: ${size || 16}px;
    `}
  }
`;
