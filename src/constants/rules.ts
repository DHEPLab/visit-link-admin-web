import { Rule } from "antd/es/form";
import i18n from "@/i18n";

const NAME_REGEX = /^[\p{L}\p{M}\p{Zs}’'·-]{1,50}$/u;
const PHONE_REGEX = /^[0-9]{5,20}$/;

const t = i18n.getFixedT(null, "form");

// Notes:
// Antd Rule use the rc-field-form, and the validateTrigger not work
// It should config the validateTrigger prop on the Form.Item
// e.g. <Form.Item name="phone" rules={Rules.Phone} validateTrigger="onBlur" />
// ref: https://github.com/ant-design/ant-design/issues/41091
const Rules: { [key: string]: Rule[] } = {
  Required: [{ required: true }],
  Password: [{ required: true, min: 6 }],
  Phone: [{ required: true }, { pattern: PHONE_REGEX, message: t("phoneInvalid") }],
  RealName: [
    { required: true },
    {
      pattern: NAME_REGEX,
      message: t("nameInvalid"),
    },
  ],
  Area: [
    { required: true },
    () => ({
      validator(_rule, tags) {
        if (!tags || tags.length <= 3) {
          return Promise.resolve();
        }
        return Promise.reject("最多只能添加3个区域");
      },
    }),
    () => ({
      validator(_rule, tags) {
        if (!tags) return;
        for (const tag of tags) {
          if (tag && tag.length > 50) {
            return Promise.reject("自定义标签不能超过50个字");
          }
        }
        return Promise.resolve();
      },
    }),
  ],
  Location: [{ required: true }, { max: 200 }],
  Remark: [{ max: 500 }],
};

export default Rules;
