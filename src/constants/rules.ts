import { Rule } from "antd/es/form";
import i18n from "@/i18n";

export const NAME_REGEX = /^[\p{L}\p{M}\p{Zs}’'·-]{1,50}$/u;
export const PHONE_REGEX = /^\+?\d{5,19}$|^\d{5,20}$/;

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
        if (tags) {
          for (const tag of tags) {
            if (tag && tag.length > 100) {
              return Promise.reject(t("areaLengthInvalid"));
            }
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
