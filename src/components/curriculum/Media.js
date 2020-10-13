import React, { useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import { Upload } from "antd";

import Container from "./Container";
import { GhostInput, UploadButton } from "../*";
import { fileFormat } from "../../utils";

export default function Media({ name, value, onChange, ...props }) {
  // temporarily stores the text value，modify the formik value on blur event to improve performance
  const [text, setText] = useState(value.text);

  const Name = {
    type: `${name}.type`,
    file: `${name}.file`,
    text: `${name}.text`,
  };

  function handleUploadPicture(file) {
    upload(file).then((filePath) => {
      onChange(Name.type)("PICTURE");
      onChange(Name.file)(filePath);
    });
    return false;
  }

  function handleUploadVideo(file) {
    upload(file).then((filePath) => {
      onChange(Name.type)("VIDEO");
      onChange(Name.file)(filePath);
    });
    return false;
  }

  function upload(file) {
    return new Promise((resolve, reject) => {
      Axios.get("/admin/oss/pre-signed-url", {
        params: {
          format: fileFormat(file),
        },
      })
        .then(({ data: { url } }) => {
          Axios.put(url, file, {
            headers: {
              Authorization: "",
              "Content-Type": "application/octet-stream",
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
    <Container icon="iconmedia-gray" title="媒体组件" {...props}>
      <Flex>
        {value.file || props.readonly ? (
          <Preview type={value.type} file={value.file} />
        ) : (
          <>
            <Upload accept="image/png, image/jpeg" showUploadList={false} beforeUpload={handleUploadPicture}>
              <UploadButton title="点击上传图片" icon="iconpicture">
                支持JPG/PNG/GIF
                <br />
                大小不超过5M
                <br />
                建议尺寸为 16:10
              </UploadButton>
            </Upload>
            <Upload accept=".mp4" showUploadList={false} beforeUpload={handleUploadVideo}>
              <UploadButton title="点击上传视频" icon="iconvideo">
                支持MP4 <br />
                大小不超过10M
                <br />
                建议尺寸为 16:10
              </UploadButton>
            </Upload>
          </>
        )}
      </Flex>
      <GhostInput
        name={Name.text}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(Name.text)(text)}
        disabled={props.readonly}
        placeholder="请输入媒体描述文本"
      />
      {/* <pre>{JSON.stringify(value)}</pre> */}
    </Container>
  );
}

function Preview({ type, file }) {
  if (type === "PICTURE") {
    return <PreviewImage url={`/api/files${file}`} />;
  }
  return (
    <PreviewVideo>
      <video src={`/api/files${file}`} controls />
    </PreviewVideo>
  );
}

const PreviewImage = styled.div`
  width: 400px;
  height: 250px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  background-image: url(${({ url }) => url});
`;

const PreviewVideo = styled.div`
  width: 400px;
  height: 250px;
  border-radius: 8px;
  background: #000;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  display: flex;

  video {
    /* width: 400px; */
    height: 250px;
  }
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;
