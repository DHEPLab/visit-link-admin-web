import React, { useEffect, useState } from "react";
import XLSX from "xlsx";
import styled from "styled-components";
import { Steps, Button, Spin, Upload, Table, message } from "antd";
import Column from "antd/lib/table/Column";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import axios from "axios";
import UploadButton from "./UploadButton";

const { Step } = Steps;

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

  function getFeedingPattern(value) {
    const arr = [
      { key: "BREAST_MILK", value: t("FeedingPattern.BREAST_MILK", { ns: "enum" }) },
      { key: "MILK_POWDER", value: t("FeedingPattern.MILK_POWDER", { ns: "enum" }) },
      { key: "MIXED", value: t("FeedingPattern.MIXED", { ns: "enum" }) },
      { key: "TERMINATED", value: t("FeedingPattern.TERMINATED", { ns: "enum" }) },
    ];
    const find = arr.find((ele) => ele.value === value);
    if (find) return find.key;
    return null;
  }

  function getBabyStage(value) {
    const arr = [
      { key: "EDC", value: t("BabyStage.EDC", { ns: "enum" }) },
      { key: "BIRTH", value: t("BabyStage.BIRTH", { ns: "enum" }) },
    ];
    const find = arr.find((ele) => ele.value === value);
    if (find) return find.key;
    return null;
  }

  function getGender(value) {
    const arr = [
      { key: "MALE", value: t("Gender.MALE", { ns: "enum" }) },
      { key: "FEMALE", value: t("Gender.FEMALE", { ns: "enum" }) },
      { key: "UNKNOWN", value: t("Gender.UNKNOWN", { ns: "enum" }) },
    ];
    const find = arr.find((ele) => ele.value === value);
    if (find) return find.key;
    return null;
  }

  function getAssistedFood(value) {
    const arr = [
      { key: true, value: t("AssistedFood.TRUE", { ns: "enum" }) },
      { key: false, value: t("AssistedFood.FALSE", { ns: "enum" }) },
    ];
    const find = arr.find((ele) => ele.value === value);
    if (find) return find.key;
    return null;
  }

  function getFamilyTies(value) {
    const arr = [
      { key: "MOTHER", value: t("RELATIVES.MOTHER", { ns: "enum" }) },
      { key: "FATHER", value: t("RELATIVES.FATHER", { ns: "enum" }) },
      { key: "GRANDMOTHER", value: t("RELATIVES.GRANDMOTHER", { ns: "enum" }) },
      { key: "GRANDMA", value: t("RELATIVES.GRANDMA", { ns: "enum" }) },
      { key: "GRANDFATHER", value: t("RELATIVES.GRANDFATHER", { ns: "enum" }) },
      { key: "GRANDPA", value: t("RELATIVES.GRANDPA", { ns: "enum" }) },
      { key: "OTHER", value: t("RELATIVES.OTHER", { ns: "enum" }) },
    ];
    const find = arr.find((ele) => ele.value === value);
    if (find) return find.key;
    return null;
  }

  function getCares(babyjson) {
    const cares = [];
    if (babyjson["Caregiver_Main_name"]) {
      cares.push({
        master: true,
        name: babyjson["Caregiver_Main_name"] && babyjson["Caregiver_Main_name"].trim(),
        familyTies: getFamilyTies(babyjson["Caregiver_Main_relationship"]),
        phone: babyjson["Caregiver_Main_phone"],
        wechat: babyjson["Caregiver_Main_Wechat"],
      });
    } else {
      return cares;
    }

    if (babyjson["Caregiver_II_name"]) {
      cares.push({
        master: false,
        name: babyjson["Caregiver_II_name"],
        familyTies: getFamilyTies(babyjson["Caregiver_II_relationship"]),
        phone: babyjson["Caregiver_II_phone"],
        wechat: babyjson["Caregiver_II_Wechat"],
      });
    } else {
      return cares;
    }

    if (babyjson["Caregiver_III_name"]) {
      cares.push({
        master: false,
        name: babyjson["Caregiver_III_name"],
        familyTies: getFamilyTies(babyjson["Caregiver_III_relationship"]),
        phone: babyjson["Caregiver_III_phone"],
        wechat: babyjson["Caregiver_III_Wechat"],
      });
    } else {
      return cares;
    }

    if (babyjson["Caregiver_IV_name"]) {
      cares.push({
        master: false,
        name: babyjson["Caregiver_IV_name"],
        familyTies: getFamilyTies(babyjson["Caregiver_IV_relationship"]),
        phone: babyjson["Caregiver_IV_phone"],
        wechat: babyjson["Caregiver_IV_Wechat"],
      });
    } else {
      return cares;
    }
    return cares;
  }

  function toBaby(babyjson) {
    const cares = getCares(babyjson);
    return {
      identity: babyjson[t("id", { ns: "baby" })]?.trim(),
      name: babyjson[t("babyName", { ns: "baby" })]?.trim(),
      stage: getBabyStage(babyjson[t("growthStage", { ns: "baby" })]),
      gender: getGender(babyjson[t("gender", { ns: "baby" })]),
      edc: babyjson[t("dueDay", { ns: "baby" })],
      birthday: babyjson[t("birthDay", { ns: "baby" })],
      assistedFood: getAssistedFood(babyjson[t("supplementaryFood", { ns: "baby" })]),
      feedingPattern: getFeedingPattern(babyjson[t("feedingMethods", { ns: "baby" })]),
      area: babyjson[t("area", { ns: "baby" })],
      location: babyjson[t("address", { ns: "baby" })],
      remark: babyjson[t("comments", { ns: "baby" })],
      chw: { chw: { identity: babyjson[t("chwID", { ns: "baby" })] } },
      cares: cares,
    };
  }

  async function checkBaby(babiesjsonArray) {
    const isLanguageZH = i18n.resolvedLanguage === "zh";
    const babiesArray = babiesjsonArray.map((json, index) => ({ ...toBaby(json), number: index + 1 }));
    const passArray = [];
    const errorArray = [];
    babiesArray.forEach((element) => {
      if (passArray.find((ele) => ele.identity === element.identity)) {
        errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.duplicateId") });
        return;
      }

      if (!element.identity) {
        errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyId") });
        return;
      }

      if (!element.name) {
        errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyBabyName") });
        return;
      }

      if (!element.gender) {
        errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.invalidGender") });
        return;
      }

      if (!element.stage) {
        errorArray.push({
          number: element.number,
          name: element.name,
          matters: t("excel.importBaby.invalidGrowthStage"),
        });
        return;
      }

      if (!element.area) {
        errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyArea") });
        return;
      }

      if (!element.location) {
        errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyLocation") });
        return;
      }

      if (!element.cares || element.cares.length === 0 || element.cares[0]?.master === false) {
        errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyCaregiver") });
        return;
      }

      if (isLanguageZH && !new RegExp(/^[\u4e00-\u9fa5]{2,10}$/).test(element.name)) {
        errorArray.push({ number: element.number, name: element.name, matters: "姓名必须为2-10个汉字" });
        return;
      }

      if (isLanguageZH && element.area.split("/").length !== 4) {
        errorArray.push({ number: element.number, name: element.name, matters: "所在地区格式错误" });
        return;
      }

      if (element.cares.length > 0) {
        const result = element.cares.every((ele) => {
          if (!ele.phone || !ele.familyTies) return false;
          if (isLanguageZH && !new RegExp(/^[\u4e00-\u9fa5]{2,10}$/).test(ele.name)) return false;
          if (isLanguageZH && !new RegExp(/^1[0-9]{10}$/).test(ele.phone)) return false;
          return true;
        });
        if (!result) {
          errorArray.push({
            number: element.number,
            name: element.name,
            matters: t("excel.importBaby.invalidCaregiver"),
          });
          return;
        }
      }

      if (element.stage === "EDC") {
        if (!element.edc) {
          errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyEDC") });
          return;
        }

        if (element.edc.split("-").length !== 3) {
          errorArray.push({
            number: element.number,
            name: element.name,
            matters: t("excel.importBaby.invalidFormatDueDay"),
          });
          return;
        }

        element.edc = dayjs(element.edc).format("YYYY-MM-DD");

        if (dayjs().unix() > dayjs(element.edc).unix()) {
          errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.invalidDueDay") });
          return;
        }
        passArray.push(element);
      } else {
        if (!element.birthday) {
          errorArray.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyBirthDay") });
          return;
        }

        if (element.birthday.split("-").length !== 3) {
          errorArray.push({
            number: element.number,
            name: element.name,
            matters: t("excel.importBaby.invalidFormatBirthDay"),
          });
          return;
        }

        element.birthday = dayjs(element.birthday).format("YYYY-MM-DD");

        if (dayjs().unix() < dayjs(element.birthday).unix()) {
          errorArray.push({
            number: element.number,
            name: element.name,
            matters: t("excel.importBaby.invalidBirthDay"),
          });
          return;
        }
        passArray.push(element);
      }
    });

    axios
      .post(`/admin/babies/check?lang=${i18n.resolvedLanguage}`, passArray)
      .then((res) => {
        const { data } = res;
        const errresults = [...errorArray, ...(data || [])].sort(
          (a, b) => parseInt(`${a.number}`) - parseInt(`${b.number}`),
        );
        setErrData(errresults);
        const successResults = passArray.filter((element) => !(data || []).find((baby) => baby.name === element.name));
        setImportData(successResults);
        setSpinningLoading(false);
      })
      .catch(() => {
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

  return (
    <Container tip="Loading..." spinning={spinningLoading}>
      <Steps progressDot current={3} size="small">
        <Step title={t("excel.downloadTemplate")} />
        <Step title={t("excel.importData")} />
        <Step title={t("excel.finishImport")} />
      </Steps>
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
