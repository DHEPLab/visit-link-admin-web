import { FieldInputProps } from "formik/dist/types";
import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Upload } from "antd";
import { useTranslation } from "react-i18next";

import Container from "@/components/Container";
import GhostInput from "../GhostInput";
import UploadButton from "../UploadButton";
import MediaPreview from "./MediaPreview";
import { RcFile } from "antd/es/upload/interface";
import { ModuleMediaValue } from "@/models/res/Moduel";

type MediaProps = {
  readonly?: boolean;
} & FieldInputProps<ModuleMediaValue>;

const Media: React.FC<MediaProps> = ({ name, value, onChange, ...props }) => {
  const [text, setText] = useState(value.text);
  const { t } = useTranslation("media");

  const Name = {
    type: `${name}.type`,
    file: `${name}.file`,
    text: `${name}.text`,
  };

  function handleUploadPicture(file: RcFile) {
    upload(file).then((filePath) => {
      onChange(Name.type)("PICTURE");
      onChange(Name.file)(filePath);
    });
    return false;
  }

  function handleUploadVideo(file: RcFile) {
    upload(file).then((filePath) => {
      onChange(Name.type)("VIDEO");
      onChange(Name.file)(filePath);
    });
    return false;
  }

  function upload(file: RcFile): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .get("/admin/files/upload-pre-signed-url", {
          params: {
            format: file.name ? file.name.split(".").pop()?.toLowerCase() : undefined,
          },
        })
        .then(({ data: { url } }) => {
          fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          })
            .then(() => {
              resolve(new URL(url).pathname);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  return (
    <Container icon="iconmedia-gray" title={t("mediaComponent")} {...props}>
      <Flex>
        {value.file || props.readonly ? (
          <MediaPreview type={value.type} file={value.file} />
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
};

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

export default Media;
