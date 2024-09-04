import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Upload } from "antd";
import { useTranslation } from "react-i18next";

import Container from "./Container";
import GhostInput from "../GhostInput";
import UploadButton from "../UploadButton";

export default function Media({ name, value, onChange, ...props }) {
  const [text, setText] = useState(value.text);
  const { t } = useTranslation("media");

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
      axios
        .get("/admin/files/upload-pre-signed-url", {
          params: {
            format: file.name ? file.name.split(".").pop().toLowerCase() : undefined,
          },
        })
        .then(({ data: { url } }) => {
          fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          })
            .then(() => {
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
    <Container icon="iconmedia-gray" title={t("mediaComponent")} {...props}>
      <Flex>
        {value.file || props.readonly ? (
          <Preview type={value.type} file={value.file} />
        ) : (
          <>
            <Upload accept="image/png, image/jpeg" showUploadList={false} beforeUpload={handleUploadPicture}>
              <UploadButton title={t("clickToUploadImage")} icon="iconpicture">
                {t("supportedImageFormats")}
                <br />
                {t("maxImageSize")}
                <br />
                {t("recommendedImageRatio")}
              </UploadButton>
            </Upload>
            <Upload accept=".mp4" showUploadList={false} beforeUpload={handleUploadVideo}>
              <UploadButton title={t("clickToUploadVideo")} icon="iconvideo">
                {t("supportedVideoFormats")} <br />
                {t("maxVideoSize")}
                <br />
                {t("recommendedVideoRatio")}
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
        placeholder={t("enterMediaDescription")}
      />
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
  background-size: contain;
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
