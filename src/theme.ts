import { css } from "@emotion/css";
import { GlobalToken } from "antd";
import {
  ButtonConfig,
  CascaderConfig,
  DatePickerConfig,
  InputConfig,
  ModalConfig,
  RangePickerConfig,
  SelectConfig,
  TableConfig,
  TextAreaConfig,
} from "antd/es/config-provider/context";

const ColorPalette = {
  primary: "#ff794f",
  heading: "#8e8e93",
};

export const visitLinkTheme = (token: GlobalToken) => {
  return {
    cssVar: true,
    token: {
      colorPrimary: ColorPalette.primary,
      colorTextHeading: ColorPalette.heading,
      colorLink: ColorPalette.primary,
      fontSize: 16,
      fontSizeSM: 14,
      borderRadius: 8,
      controlHeight: 40,
    },
    components: {
      Input: {
        paddingBlock: 6,
        paddingBlockLG: 10,
        paddingInline: 30,
        paddingInlineLG: 30,
        borderRadius: 26,
        borderRadiusLG: 26,
        colorText: token.colorTextSecondary,
      },
      Select: {
        borderRadius: 26,
        colorText: token.colorTextSecondary,
      },
      Button: {
        controlHeight: 40,
        controlHeightLG: 50,
        paddingBlockLG: 8,
        paddingInline: 30,
        paddingInlineLG: 60,
        borderRadiusLG: 26,
        contentFontSize: 16,
        contentFontSizeSM: 14,
        contentFontSizeLG: 20,
        fontWeight: 700,
        colorError: "#f2709c",
        borderRadius: 26,
        colorLink: ColorPalette.primary,
        colorLinkActive: ColorPalette.primary,
        colorLinkHover: ColorPalette.primary,
        algorithm: true,
      },
      Modal: {
        headerBg: "linear-gradient(90deg, rgba(255, 148, 114, 1) 0%, rgba(242, 112, 156, 1) 100%)",
        titleColor: "#ffffff",
        titleFontSize: 16,
        colorText: token.colorTextSecondary,
      },
      Form: {
        colorText: ColorPalette.heading,
        labelColonMarginInlineEnd: 14,
      },
      Radio: {
        colorText: token.colorTextSecondary,
      },
      Tabs: {
        cardPadding: "6px 16px",
      },
      DatePicker: {
        borderRadius: 26,
        paddingInline: 30,
      },
      InputNumber: {
        borderRadius: 26,
        colorText: token.colorTextSecondary,
      },
      Steps: {
        colorText: token.colorTextSecondary,
      },
      Table: {
        headerBg: "#ffffff",
        headerColor: "#8e8e93",
        fontSize: 14,
        cellPaddingInline: 19,
        cellPaddingBlock: 19,
        headerSplitColor: "transparent",
        headerBorderRadius: 0,
      },
      Pagination: {
        fontSize: 14,
        itemSize: 32,
      },
    },
  };
};

export const componentConfig = (rootPrefixCls: string) => {
  const buttonCss = css`
    &.${rootPrefixCls}-btn-lg {
      min-width: 200px;
    }

    &.${rootPrefixCls}-btn-background-ghost {
      border-width: 2px;
    }
  `;

  const inputCss = css`
    &.${rootPrefixCls}-input.master,
      &.${rootPrefixCls}-input-password.master,
      &.${rootPrefixCls}-input-affix-wrapper.master,
      &.${rootPrefixCls}-input-affix-wrapper.master
      .${rootPrefixCls}-input,
      &.${rootPrefixCls}-input-password.master
      .${rootPrefixCls}-input {
      &::placeholder {
        color: #ffc3a0;
      }

      &:hover {
        border-color: #ff9c78;
      }

      color: #4a4a4a;
      background: #fff9f5;
      border-color: #ffc3a0;
    }

    &.${rootPrefixCls}-input,
      &.${rootPrefixCls}-picker,
      &.${rootPrefixCls}-input-password,
      &.${rootPrefixCls}-input-affix-wrapper {
      width: 400px;
    }
  `;

  const textAreaCss = css`
    &.${rootPrefixCls}-input {
      border-radius: 16px;
    }
  `;

  const modalCss = css`
    &.${rootPrefixCls}-modal {
      .${rootPrefixCls}-modal-content {
        padding: 0;
      }

      .${rootPrefixCls}-modal-header {
        padding: 12px 24px;
      }

      .${rootPrefixCls}-modal-body {
        padding: 24px;
      }

      .${rootPrefixCls}-modal-footer {
        border: none;
        padding: 0 16px 30px;
        text-align: center;
      }

      .${rootPrefixCls}-modal-close, .${rootPrefixCls}-modal-close:focus, .${rootPrefixCls}-modal-close:hover {
        color: #fff;
        text-decoration: none;
        top: 6px;
      }
    }
  `;

  const tableCss = css`
    .${rootPrefixCls}-table {
      .${rootPrefixCls}-table-row {
        cursor: pointer;

        &.even-row {
          td {
            background: #fff9f5;
          }

          &:hover > td {
            background: #fff6f0;
          }
        }

        &.odd-row {
          background: #fff;
        }
      }

      .${rootPrefixCls}-table-thead > tr > th {
        padding-top: 30px;
        padding-bottom: 12px;
        font-weight: 400;
        border-color: #ffc3a0;
      }
    }
  `;

  const selectCss = css`
    &.${rootPrefixCls}-select {
      width: 400px;

      .${rootPrefixCls}-select-selector {
        width: 400px;
        padding-left: 30px;
      }
    }
  `;

  const cascaderCss = css`
    &.${rootPrefixCls}-cascader {
      width: 400px;
      font-weight: 400;
    }
  `;

  const dataPickerCss = css`
    &.${rootPrefixCls}-picker {
      width: 400px;
    }
  `;

  const rangePickerCss = css`
    &.${rootPrefixCls}-picker {
      width: 400px;
    }
  `;

  return {
    input: {
      className: inputCss,
    } as InputConfig,
    textArea: {
      className: textAreaCss,
    } as TextAreaConfig,
    button: {
      className: buttonCss,
    } as ButtonConfig,
    modal: {
      className: modalCss,
    } as ModalConfig,
    table: {
      className: tableCss,
    } as TableConfig,
    select: {
      className: selectCss,
    } as SelectConfig,
    cascader: {
      className: cascaderCss,
    } as CascaderConfig,
    datePicker: {
      className: dataPickerCss,
    } as DatePickerConfig,
    rangePicker: {
      className: rangePickerCss,
    } as RangePickerConfig,
  };
};
