export const Required = [{ required: true }];
export const PHONE_RULES = [
  { required: true, message: '请输入手机号码', trigger: 'blur' },
  { pattern: /^1[0-9]{10}$/, message: '请输入11位手机号码', trigger: 'blur' },
];
export const REAL_NAME_RULES = [
  { required: true, message: '请输入真实姓名', trigger: 'blur' },
  {
    pattern: /^[\u4e00-\u9fa5]{2,10}$/,
    message: '请输入2个以上的汉字，最多10个字符',
    trigger: 'blur',
  },
];
export const CHW_AREA_RULES = [
  ...Required,
  () => ({
    validator(_, tags) {
      if (!tags || tags.length <= 3) {
        return Promise.resolve();
      }
      return Promise.reject('最多只能添加3个区域');
    },
  }),
];

export const OSS_HOST = 'https://healthy-future-dev.oss-cn-shanghai.aliyuncs.com';
