import React, { useState } from "react";
import XLSX from 'xlsx';
import styled from "styled-components";
import { Steps, Button, Spin, Upload, Table, message } from "antd";
import Column from 'antd/lib/table/Column';
import { UploadButton } from "./*";
import moment from "moment";
import Axios from "axios";
const { Step } = Steps;

export default function ImportExcel({ refresh, close }) {

  const [spinningLoading, setSpinningLoading] = useState(false);
  const [importData, setImportData] = useState([])
  const [errData, setErrData] = useState([])

  async function putBlob(fileInfo) {
    setSpinningLoading(true)
    const { file } = fileInfo
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e) {
      let data = e.target.result;
      let wb = XLSX.read(data, { type: 'binary' });
      let json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const arr = json.length > 1 ? json.slice(1) : []
      checkBaby(arr)
    };
  };

  function getFeedingPattern (value) {
    const arr = [
      {key: 'BREAST_MILK', value: "纯母乳喂养"},
      {key: 'MILK_POWDER', value: "纯奶粉喂养"},
      {key: 'MIXED', value: "母乳奶粉混合喂养"},
      {key: 'TERMINATED', value: "已终止母乳/奶粉喂养"}
    ]
    const find =  arr.find(ele => ele.value === value)
    if (find) return find.key
    return null;
  };

  function getBabyStage (value) {
    const arr = [
      {key: 'EDC', value: "待产期"},
      {key: 'BIRTH', value: "已出生"}
    ]
    const find =  arr.find(ele => ele.value === value)
    if (find) return find.key
    return null;
  };

  function getGender (value) {
    const arr = [
      {key: 'MALE', value: "男"},
      {key: 'FEMALE', value: "女"},
      {key: 'UNKNOWN', value: "未知"}
    ]
    const find =  arr.find(ele => ele.value === value)
    if (find) return find.key
    return null;
  };

  function getFamilyTies (value) {
    const arr = [
      {key: 'MOTHER', value: "母亲"},
      {key: 'FATHER', value: "父亲"},
      {key: 'GRANDMOTHER', value: "(外)祖母"},
      {key: 'GRANDFATHER', value: "(外)祖父"},
      {key: 'SISTER', value: "亲姐妹"},
      {key: 'BROTHER', value: "亲兄弟"},
      {key: 'OTHER', value: "其他"}
    ]
    const find =  arr.find(ele => ele.value === value)
    if (find) return find.key
    return 'OTHER';
  };

  function getCares (babyjson) {
    const cares = []
    if (babyjson["Caregiver_Main_name"]) {
      cares.push({
        master: true,
        name: babyjson["Caregiver_Main_name"],
        familyTies: getFamilyTies(babyjson["Caregiver_Main_relationship"]),
        phone: babyjson["Caregiver_Main_phone"],
        wechat: babyjson["Caregiver_Main_Wechat"]
      })
    } else {
      return cares;
    }

    if (babyjson["Caregiver_II_name"]) {
      cares.push({
        master: false,
        name: babyjson["Caregiver_II_name"],
        familyTies: getFamilyTies(babyjson["Caregiver_II_relationship"]),
        phone: babyjson["Caregiver_II_phone"],
        wechat: babyjson["Caregiver_II_Wechat"]
      })
    } else {
      return cares;
    }

    if (babyjson["Caregiver_III_name"]) {
      cares.push({
        master: false,
        name: babyjson["Caregiver_III_name"],
        familyTies: getFamilyTies(babyjson["Caregiver_III_relationship"]),
        phone: babyjson["Caregiver_III_phone"],
        wechat: babyjson["Caregiver_III_Wechat"]
      })
    } else {
      return cares;
    }

    if (babyjson["Caregiver_IV_name"]) {
      cares.push({
        master: false,
        name: babyjson["Caregiver_IV_name"],
        familyTies: getFamilyTies(babyjson["Caregiver_IV_relationship"]),
        phone: babyjson["Caregiver_IV_phone"],
        wechat: babyjson["Caregiver_IV_Wechat"]
      })
    } else {
      return cares;
    }
    return cares;
  }

  function toBaby (babyjson) {
    const cares = getCares(babyjson);
    return {
      identity: babyjson['宝宝id'],
      name: babyjson['宝宝姓名'],
      stage: getBabyStage(babyjson['成长阶段']),
      gender: getGender(babyjson['宝宝性别']),
      edc: babyjson['预产期'] && moment(babyjson['预产期']).format('YYYY-MM-DD'),
      birthday: babyjson['出生日期'] && moment(babyjson['出生日期']).format('YYYY-MM-DD'),
      assistedFood: babyjson['辅食'] === '已添加' ? true : false,
      feedingPattern: getFeedingPattern(babyjson['喂养方式']),
      area: babyjson['所在地区'],
      location: babyjson['详细地址'],
      remark: babyjson['备注信息'],
      chw: {chw: {identity: babyjson['CHW_ID']}},
      cares: cares
    }
  }

  async function checkBaby (babiesjsonArray) {
    const babiesArray = babiesjsonArray.map((json, index) => ({...toBaby(json), number: (index+1)}))
    let passArray = []
    let errorArray = []
    babiesArray.forEach(element => {

      if (passArray.find(ele => ele.identity === element.identity)) {
        errorArray.push({ number: element.number, name: element.name, matters: '表内ID重复' })
        return;
      }

      if (!element.identity || !element.name || !element.gender || !element.stage || !element.area || !element.location) {
        errorArray.push({ number: element.number, name: element.name, matters: '必填字段为空' })
        return;
      }
      
      if (! new RegExp(/^[\u4e00-\u9fa5]{2,10}$/).test(element.name)) {
        errorArray.push({ number: element.number, name: element.name, matters: '姓名必须为2个以上的汉字' })
        return;
      }

      if (element.area.split('/').length !== 4) {
        errorArray.push({ number: element.number, name: element.name, matters: '所在地区格式错误' })
        return;
      }

      if (element.cares.length > 0) {
        const result =  element.cares.every(ele => {
          if (!ele.phone || !ele.familyTies) return false
          if (!new RegExp(/^[\u4e00-\u9fa5]{2,10}$/).test(ele.name)) return false
          if (!new RegExp(/^1[0-9]{10}$/).test(ele.phone)) return false
          return true
        });
        if (!result) {
          errorArray.push({ number: element.number, name: element.name, matters: '看护人信息不符合规则' })
          return;
        }
      }

      if (element.stage === "EDC") {
        if (!element.edc) {
          errorArray.push({ number: element.number, name: element.name, matters: '预产期为空' })
          return
        }

        if (element.edc.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) {
          errorArray.push({ number: element.number, name: element.name, matters: '预产期格式错误' })
          return
        }

        if (moment().unix() > moment(element.edc).unix()) {
          errorArray.push({ number: element.number, name: element.name, matters: '预产期不能小于当前时间' })
          return
        }
        passArray.push(element)
      } else {
        if (!element.birthday || !element.feedingPattern) {
          errorArray.push({ number: element.number, name: element.name, matters: '生日/喂养方式为空' })
          return
        }

        if (element.birthday.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) {
          errorArray.push({ number: element.number, name: element.name, matters: '生日格式错误' })
          return
        }

        if (moment().unix() < moment(element.birthday).unix()) {
          errorArray.push({ number: element.number, name: element.name, matters: '生日不能大于当前时间' })
          return
        }
        passArray.push(element)
      }
    });

    Axios.post("/admin/babies/check", passArray).then(res => {
      const { data } = res;
      const errresults = [...errorArray, ...(data || [])].sort((a, b) => parseInt(`${a.number}`) - parseInt(`${b.number}`))
      setErrData(errresults)
      //后端报错有三种： 1、宝宝id重复 2、chwid找不到
      const successResults = passArray.filter(element => !(data || []).find(baby => baby.name === element.name))
      setImportData(successResults)
      setSpinningLoading(false)
    }).catch(err => {
      setSpinningLoading(false)
    });
  }
  
  function importDatas () {
    setSpinningLoading(true)
    Axios.post("/admin/babies/imports", importData).then(res => {
      message.success("导入成功")
      refresh()
      close()
      setSpinningLoading(false)
    }).catch(err => {
      setSpinningLoading(false)
    });
  }

  return (
    <Container tip="Loading..." spinning={spinningLoading}>
      <Steps progressDot current={3} size="small" >
        <Step title="下载模板" />
        <Step title="导入数据" />
        <Step title="导入完成" />
      </Steps>
      <ButtonLine>
        <Upload customRequest={putBlob} accept=".xls,.xlsx,.csv" showUploadList={false} >
          <UploadButton title="点击上传Excel" icon="iconvideo">
            支持支持 xls/xlsx
            <br />
            大小不超过5M
            <br />
            单次导入数据最好不超过500条
          </UploadButton>
        </Upload>
        <DownLink href="/static/template/import_baby.xlsx" download >下载模板</DownLink>
      </ButtonLine>
      {(importData.length > 0 || errData.length > 0 )&& <ResultContainer>
        <Table
          size="small"
          dataSource={errData.map((element, index) => ({...element, key: index}))}
          pagination={false}
          scroll={{ y: 200 }}
        >
          <Column title="行号" align="left" dataIndex="number" key="number" width={50} />
          <Column title="宝宝姓名" align="left" dataIndex="name" key="name" />
          <Column title="错误事项" align="left" dataIndex="matters" key="matters" render ={(matters) => <span style={{color: 'red', fontSize: 12}}>{matters}</span>} />
        </Table>
        <Result>成功校验数据{importData.length}条， 共{importData.length+errData.length}条</Result>
        <ImportLine>
          <CloseButton type="default" size="middle" onClick={() => close()} >关闭</CloseButton>
          <Button type="primary" style={{float: 'right', width: 160}} size="middle" onClick={importDatas} disabled={importData.length === 0} >导入正确数据</Button>
        </ImportLine>
      </ResultContainer>}
    </Container>
  );
}

const CloseButton = styled(Button)`
  border-color: #ff794f;
  color: #ff794f;
  margin-right: 10px;
  float: left;
  width: 160px;
`

const Container = styled(Spin)`
  margin-bottom: 20px;
  color: #fff;
`;

const ImportLine = styled.div`
  margin-top: 10px;
  padding: 0px 60px;
  height: 30px;
`;

const ResultContainer = styled.div`
`;

const Result = styled.div`
  text-align: right;
  font-size: 14px;
  line-height: 30px;
  font-family: fantasy;
`

const ButtonLine = styled.div`
  margin: 20px;
  text-align: center;
`

const DownLink = styled.a`
  position: relative;
  bottom: -30px;
`