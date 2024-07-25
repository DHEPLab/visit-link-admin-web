const Required = [{ required: true }];

export default {
  Required,

  Password: [{ required: true, min: 6 }],
  Phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[0-9]{10}$/, message: "请输入11位手机号码", trigger: "blur" },
  ],
  RealName: [
    { required: true, message: "请输入真实姓名", trigger: "blur" },
    {
      pattern: /^[\u4e00-\u9fa5]{2,10}$/,
      message: "请输入2个以上的汉字，最多10个字符",
      trigger: "blur",
    },
  ],
  Area: [
    ...Required,
    () => ({
      validator(_, tags) {
        if (!tags || tags.length <= 3) {
          return Promise.resolve();
        }
        return Promise.reject("最多只能添加3个区域");
      },
    }),
    () => ({
      validator(_, tags) {
        if (!tags) return;
        for (let tag of tags) {
          if (tag && tag.length > 50) {
            return Promise.reject("自定义标签不能超过50个字");
          }
        }
        return Promise.resolve();
      },
    }),
  ],
  Location: [...Required, { max: 200 }],
  Remark: [{ max: 500 }],
};
