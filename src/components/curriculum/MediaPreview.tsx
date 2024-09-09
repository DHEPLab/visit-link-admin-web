import React from "react";
import styled from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

type MediaPreviewProps = {
  type: string;
  file: string;
};

const MediaPreview: React.FC<MediaPreviewProps> = ({ type, file }) => {
  if (type === "PICTURE") {
    return <PreviewImage url={`/api/files${file}`} />;
  }
  return (
    <PreviewVideo>
      <video src={`/api/files${file}`} controls />
    </PreviewVideo>
  );
};

const PreviewImage = styled("div").withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "url",
})<{ url: string }>`
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

export default MediaPreview;
