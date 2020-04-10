import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
  Typography,
} from 'antd';
import styled from 'styled-components';
import axios from 'axios';

const { Option } = Select;
const { Title } = Typography;

function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios
      .get('/api/user', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOIiwiZXhwIjoxNTg2NzQ1ODc0fQ.DqHmchjcJ-huXrX86Ua7YMyhLt_w2_Jknj5_EPZrE3mLOb8EtkCKkL9oRS0hNEwYqAb_IbxJ4_p-s1twY_0GQA',
        },
      })
      .then((response) => {
        setUsers(response.data.content);
      });
  }, []);

  return (
    <div>
      <section style={{ textAlign: 'center', marginTop: 48, marginBottom: 60 }}>
        <Title level={2}>
          <img
            style={{
              width: 40,
              height: 40,
              marginRight: 12,
              verticalAlign: 'bottom',
            }}
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            alt="Ant Design"
          />
          Ant Design
        </Title>
      </section>
      <div>{JSON.stringify(users)}</div>
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
        <Form.Item label="数字输入框">
          <InputNumber min={1} max={10} defaultValue={3} />
          <span className="ant-form-text"> 台机器</span>
          <a href="https://ant.design">learn ant design</a>
        </Form.Item>
        <Form.Item label="开关">
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item label="滑动输入条">
          <Slider defaultValue={70} />
        </Form.Item>
        <Form.Item label="选择器">
          <Select defaultValue="lucy" style={{ width: 192 }}>
            <Option value="jack">jack</Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>
              disabled
            </Option>
            <Option value="yiminghe">yiminghe</Option>
          </Select>
        </Form.Item>
        <Form.Item label="日期选择框">
          <DatePicker />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button style={{ marginLeft: 8 }}>Cancel</Button>
        </Form.Item>
      </Form>
      <StyledComponent>Styled Component</StyledComponent>
    </div>
  );
}

const StyledComponent = styled.h1``;

export default Home;
