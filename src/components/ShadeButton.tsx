import { Button } from "antd";
import styled from "@emotion/styled";

const ShadeButton = styled(Button)`
  border-width: 0;

  > span {
    color: #fff;
    position: relative;
  }

  &::before {
    content: "";
    background: linear-gradient(90deg, rgba(255, 148, 114, 1) 0%, rgba(242, 112, 156, 1) 100%);
    position: absolute;
    inset: 0;
    opacity: 1;
    transition: all 0.3s;
    border-radius: inherit;
  }

  &:focus::before,
  &:hover::before {
    opacity: 0.8;
  }
`;

export default ShadeButton;
