import i18n from "@/i18n";
import { Select, Space } from "antd";
import React from "react";

const { Option } = Select;

interface LanguageOption {
  value: string;
  label: string;
  flagUrl: string;
}

const LanguageSelect: React.FC = () => {
  const languages: LanguageOption[] = [
    {
      value: "en",
      label: "English",
      flagUrl: "https://flagcdn.com/us.svg",
    },
    {
      value: "zh",
      label: "中文",
      flagUrl: "https://flagcdn.com/cn.svg",
    },
  ];

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      defaultValue={i18n.resolvedLanguage}
      onChange={handleChange}
      dropdownRender={(menu) => <div>{menu}</div>}
      size={"small"}
      style={{ width: "150px" }}
    >
      {languages.map((lang) => (
        <Option key={lang.value} value={lang.value}>
          <Space align="center">
            <img src={lang.flagUrl} alt={lang.label} style={{ width: 20, height: 14 }} />
            {lang.label}
          </Space>
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSelect;
