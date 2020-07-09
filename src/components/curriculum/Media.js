import React from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Upload } from 'antd';

import Container from './Container';
import { GhostInput, UploadButton } from '../*';
import { fileFormat } from '../../utils';
import { OSS_HOST } from '../../constants';

export default function Media({ name, value, onChange, ...props }) {
  const Name = {
    type: `${name}.type`,
    file: `${name}.file`,
    text: `${name}.text`,
  };

  function handleUploadPicture(file) {
    upload(file).then((filePath) => {
      onChange(Name.type)('PICTURE');
      onChange(Name.file)(filePath);
    });
    return false;
  }

  function handleUploadVideo(file) {
    upload(file).then((filePath) => {
      onChange(Name.type)('VIDEO');
      onChange(Name.file)(filePath);
    });
    return false;
  }

  function upload(file) {
    return new Promise((resolve, reject) => {
      Axios.get('/admin/oss/presigned-url', {
        params: {
          format: fileFormat(file),
        },
      })
        .then(({ data: { url } }) => {
          Axios.put(url, file, {
            headers: {
              Authorization: '',
              'Content-Type': 'application/octet-stream',
            },
          })
            .then((_) => {
              resolve(path(url));
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  function path(url) {
    return new URL(url).pathname;
  }

  return (
    <Container title="媒体组件" {...props}>
      <Flex>
        {value.file ? (
          <Preview type={value.type} file={value.file} />
        ) : (
          <>
            <Upload
              accept="image/png, image/jpeg"
              showUploadList={false}
              beforeUpload={handleUploadPicture}
            >
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
          </>
        )}
      </Flex>
      <GhostInput
        name={Name.text}
        value={value.text}
        onChange={onChange}
        placeholder="请输入媒体描述文本。"
      />
    </Container>
  );
}

function Preview({ type, file }) {
  if (type === 'PICTURE') {
    return <PreviewImage src={`${OSS_HOST}${file}`} />;
  }
  return <PreviewVideo src={`${OSS_HOST}${file}`} controls />;
}

const PreviewImage = styled.img``;
const PreviewVideo = styled.video``;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;
