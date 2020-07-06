import React from 'react';
import styled from 'styled-components';
import { Upload } from 'antd';

import Container from './Container';
import { UploadButton } from '../*';

export default function Media({ name, value, onChange, ...props }) {
  const Name = {
    type: `${name}.type`,
    file: `${name}.file`,
    text: `${name}.text`,
  };

  function handleUploadPicture(file) {
    return false;
  }

  function handleUploadVideo(file) {
    return false;
  }

  return (
    <Container title="媒体组件" {...props}>
      <Flex>
        <Upload accept="image/png, image/jpeg" beforeUpload={handleUploadPicture}>
          <UploadButton title="点击上传图片">
            支持JPG/PNG/GIF
            <br />
            大小不超过5M
            <br />
            建议尺寸为246px x 180px
          </UploadButton>
        </Upload>
        <Upload accept=".mp4" beforeUpload={handleUploadVideo}>
          <UploadButton title="点击上传视频">
            支持MP4 <br />
            大小不超过10M
            <br />
            建议尺寸为246px x 180px
          </UploadButton>
        </Upload>
      </Flex>
      {/* <input name={Name.type} value={value.type} onChange={onChange} placeholder="Media Type" />
      <input name={Name.file} value={value.file} onChange={onChange} placeholder="Media File" /> */}
      <input name={Name.text} value={value.text} onChange={onChange} placeholder="Media Text" />
    </Container>
  );
}

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;
