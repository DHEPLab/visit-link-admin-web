import React, { useEffect, useState } from "react";
import XLSX from "xlsx";
import styled from "styled-components";
import { Button, message, Spin, Steps, Table, Upload } from "antd";
import Column from "antd/lib/table/Column";
import { useTranslation } from "react-i18next";
import axios from "axios";
import UploadButton from "./UploadButton";
import { checkBabies } from "@/components/utils/importChecker";

export default function ImportExcel({ open, refresh, close }) {
  const { t, i18n } = useTranslation(["common", "enum", "baby"]);

  const [spinningLoading, setSpinningLoading] = useState(false);
  const [importData, setImportData] = useState([]);
  const [errData, setErrData] = useState([]);

  useEffect(() => {
    setImportData([]);
    setErrData([]);
  }, [open]);

  async function putBlob(fileInfo) {
    setSpinningLoading(true);
    const { file } = fileInfo;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e) {
      const data = e.target.result;
      const wb = XLSX.read(data, { type: "binary" });
      const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const arr = json.length > 1 ? json.slice(1) : [];
      checkBaby(arr);
    };
  }

  async function checkBaby(babies) {
    const { validBabies, errors } = checkBabies(babies);

    axios
      .post(`/admin/babies/check?lang=${i18n.resolvedLanguage}`, validBabies)
      .then((res) => {
        const { data } = res;
        const errresults = [...errors, ...(data || [])].sort(
          (a, b) => parseInt(`${a.number}`) - parseInt(`${b.number}`),
        );
        setErrData(errresults);
        const successResults = validBabies.filter(
          (element) => !(data || []).find((baby) => baby.name === element.name),
        );
        setImportData(successResults);
      })
      .finally(() => {
        setSpinningLoading(false);
      });
  }

  function importDatas() {
    setSpinningLoading(true);
    axios
      .post("/admin/babies/imports", importData)
      .then(() => {
        message.success(t("excel.importSuccessfully"));
        refresh();
        close();
        setSpinningLoading(false);
      })
      .catch(() => {
        setSpinningLoading(false);
      });
  }

  const stepItems = [
    {
      title: t("excel.downloadTemplate"),
    },
    {
      title: t("excel.importData"),
    },
    {
      title: t("excel.finishImport"),
    },
  ];

  return (
    <Container tip="Loading..." spinning={spinningLoading}>
      <Steps progressDot current={3} size="small" items={stepItems} />
      <ButtonLine>
        <Upload customRequest={putBlob} accept=".xls,.xlsx,.csv" showUploadList={false}>
          <UploadButton title={t("excel.clickToUploadExcel")} icon="iconimport-excel">
            {t("excel.support")}
            <br />
            {t("excel.filesizeMaxTo5M")}
            <br />
            {t("excel.batchImportCountSuggest")}
          </UploadButton>
        </Upload>
        <DownLink href={t("importBabyTemplate", { ns: "baby" })} download>
          {t("excel.downloadTemplate")}
        </DownLink>
      </ButtonLine>
      {(importData.length > 0 || errData.length > 0) && (
        <ResultContainer>
          <Table
            size="small"
            dataSource={errData.map((element, index) => ({ ...element, key: index }))}
            pagination={false}
            scroll={{ y: 200 }}
          >
            <Column title={t("row")} align="left" dataIndex="number" key="number" width={50} />
            <Column title={t("babyName")} align="left" dataIndex="name" key="name" />
            <Column
              title={t("errorItem")}
              align="left"
              dataIndex="matters"
              key="matters"
              render={(matters) => <span style={{ color: "red", fontSize: 12 }}>{matters}</span>}
            />
          </Table>
          <Result>
            {t("excel.verifiedDataCount")} {importData.length} {t("unit.item")}, {t("total")}{" "}
            {importData.length + errData.length} {t("unit.item")}
          </Result>
          <ImportLine>
            <CloseButton type="default" size="middle" onClick={() => close()}>
              {t("close")}
            </CloseButton>
            <Button
              type="primary"
              style={{ float: "right", width: 160 }}
              size="middle"
              onClick={importDatas}
              disabled={importData.length === 0}
            >
              {t("excel.importData")}
            </Button>
          </ImportLine>
        </ResultContainer>
      )}
    </Container>
  );
}

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
  padding: 0px 60px;
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
