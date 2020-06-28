export default {
  Required: [{ required: true }],
  Password: [{ required: true, min: 6 }],
  Phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
};
