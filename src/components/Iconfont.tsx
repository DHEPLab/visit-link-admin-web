import Icon from "@ant-design/icons";
import styled from "styled-components";
import { IconFontProps } from "@ant-design/icons/es/components/IconFont";
import React from "react";

type IconfontProps = IconFontProps & {
  opacity?: number;
};

const Iconfont = styled(
  React.forwardRef<HTMLSpanElement, IconfontProps>((props, ref) => {
    const { type, children, ...restProps } = props;

    let content: React.ReactNode = null;
    if (props.type) {
      content = <use xlinkHref={`/__spritemap#${type}`} />;
    }
    if (children) {
      content = children;
    }
    return (
      <Icon {...restProps} ref={ref}>
        {content}
      </Icon>
    );
  }),
)`
  svg {
    ${({ opacity }) => opacity && `opacity: ${opacity};`}
    ${({ size }) => `
      width: ${size || 16}px;
      height: ${size || 16}px;
    `}
  }
`;

export default Iconfont;
