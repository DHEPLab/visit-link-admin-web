import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, message, Spin, Steps, Table, Upload, UploadProps } from "antd";
import Column from "antd/lib/table/Column";
import UploadButton from "./UploadButton";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { ImportExcelCheckRes } from "@/models/res/importExcel";

const { Step } = Steps;

interface ImportUserExcelProps {
  open: boolean;
  refresh: () => void;
  close: () => void;
}

const ImportUserExcel: React.FC<ImportUserExcelProps> = ({ open, refresh, close }) => {
  const { t } = useTranslation(["common", "user"]);

  const [spinningLoading, setSpinningLoading] = useState(false);
  const [result, setResult] = useState<ImportExcelCheckRes>({
    errData: [],
    total: 0,
  });
  const { errData } = result;
  const [file, setFile] = useState<Blob | null>(null);
  const successTotal = result.total - errData.length;

  useEffect(() => {
    setResult({
      errData: [],
      total: 0,
    });
  }, [open]);

  const checkUser: UploadProps["customRequest"] = ({ file }) => {
    setSpinningLoading(true);
    setFile(file as Blob);

    const formData = new FormData();
    formData.append("records", file);
    axios
      .post<ImportExcelCheckRes>("/admin/users/check", formData)
      .then(({ data }) => setResult(data))
      .finally(() => {
        setSpinningLoading(false);
      });
  };

  function onImportDataButtonClicked() {
    if (file === null) {
      message.warning(t("excel.importFileIsMissing"));
      return;
    }

    setSpinningLoading(true);
    const formData = new FormData();
    formData.append("records", file);
    axios
      .post("/admin/users/import", formData)
      .then(() => {
        message.success(t("excel.importSuccessfully"));
        refresh();
        close();
      })
      .finally(() => {
        setSpinningLoading(false);
      });
  }

  const showResult = result.total > 0 || errData.length > 0;

  return (
    <Container tip="Loading..." spinning={spinningLoading}>
      <Steps progressDot current={3} size="small">
        <Step title={t("excel.downloadTemplate")} />
        <Step title={t("excel.importData")} />
        <Step title={t("excel.finishImport")} />
      </Steps>
      <ButtonLine>
        <Upload customRequest={checkUser} accept=".xls,.xlsx,.csv" showUploadList={false}>
          <UploadButton title={t("excel.clickToUploadExcel")} icon="iconimport-excel">
            {t("excel.support")}
            <br />
            {t("excel.filesizeMaxTo5M")}
            <br />
            {t("excel.batchImportCountSuggest")}
          </UploadButton>
        </Upload>
        <DownLink href={`/static/template/import_chw_${i18n.resolvedLanguage}.xlsx`} download>
          {t("excel.downloadTemplate")}
        </DownLink>
      </ButtonLine>
      {showResult && (
        <ResultContainer>
          <Table
            size="small"
            dataSource={errData.map((element, index) => ({ ...element, key: index }))}
            pagination={false}
            scroll={{ y: 200 }}
          >
            <Column title={t("row")} align="left" dataIndex="number" key="number" width={50} />
            <Column title={t("name", { ns: "user" })} align="left" dataIndex="name" key="name" />
            <Column
              title={t("errorItem")}
              align="left"
              dataIndex="matters"
              key="matters"
              render={(matters) => <span style={{ color: "red", fontSize: 12 }}>{matters}</span>}
            />
          </Table>
          <Result>
            {t("excel.verifiedDataCount")} {successTotal} {t("unit.item")}, {t("total")} {result.total} {t("unit.item")}
          </Result>
          <ImportLine>
            <CloseButton type="default" size="middle" onClick={() => close()}>
              {t("close")}
            </CloseButton>
            <Button
              type="primary"
              style={{ float: "right", width: 160 }}
              size="middle"
              onClick={onImportDataButtonClicked}
              disabled={successTotal === 0}
            >
              {t("excel.importData")}
            </Button>
          </ImportLine>
        </ResultContainer>
      )}
    </Container>
  );
};

const CloseButton = styled(Button)`
  border-color: #ff794f;
  color: #ff794f;
  margin-right: 10px;
  float: left;
  width: 160px;
`;

const Container = styled(Spin)`
  margin-bottom: 20px;
  color: #fff;
`;

const ImportLine = styled.div`
  margin-top: 10px;
  padding: 0 60px;
  height: 30px;
`;

const ResultContainer = styled.div``;

const Result = styled.div`
  text-align: right;
  font-size: 14px;
  line-height: 30px;
`;

const ButtonLine = styled.div`
  margin: 20px;
  text-align: center;
`;

const DownLink = styled.a`
  position: relative;
  bottom: -30px;
`;

export default ImportUserExcel;
