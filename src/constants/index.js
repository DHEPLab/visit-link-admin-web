export const Required = [{ required: true }];
export const PHONE_RULES = [
  { required: true, message: '请输入手机号码', trigger: 'blur' },
  { pattern: /^1[0-9]{10}$/, message: '请输入11位手机号码', trigger: 'blur' },
];

export const OSS_HOST = 'https://healthy-future-dev.oss-cn-shanghai.aliyuncs.com';
