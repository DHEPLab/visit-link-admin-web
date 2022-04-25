import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Button, message, Spin, Steps, Table, Upload} from "antd";
import Column from 'antd/lib/table/Column';
import {UploadButton} from "./*";
import Axios from "axios";

const {Step} = Steps;

export default function ImportUserExcel({open, refresh, close}) {

    const [spinningLoading, setSpinningLoading] = useState(false);
    const [result, setResult] = useState({
        errData: [],
        total: 0
    })
    const [file, setFile] = useState(null)
    const {errData} = result
    const successTotal = result.total - errData.length

    useEffect(() => {
        setResult({
            errData: [],
            total: 0
        })
    }, [open])

    async function putBlob(fileInfo) {
        setSpinningLoading(true)
        const {file} = fileInfo
        setFile(file)
        checkUser(file)
    }

    async function checkUser(f) {
        const formData = new FormData();
        formData.append("records", f)
        Axios.post("/admin/users/check", formData).then(res => {
            const {data} = res;
            setResult(data)
            setSpinningLoading(false)
        }).catch(err => {
            setSpinningLoading(false)
        });
    }

    function importDatas() {
        setSpinningLoading(true)
        const formData = new FormData();
        formData.append("records", file)
        Axios.post("/admin/users/import", formData)
            .then(({data}) => {
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
            <Steps progressDot current={3} size="small">
                <Step title="下载模板"/>
                <Step title="导入数据"/>
                <Step title="导入完成"/>
            </Steps>
            <ButtonLine>
                <Upload customRequest={putBlob} accept=".xls,.xlsx,.csv" showUploadList={false}>
                    <UploadButton title="点击上传Excel" icon="iconimport-excel">
                        支持支持 xls/xlsx
                        <br/>
                        大小不超过5M
                        <br/>
                        单次导入数据最好不超过500条
                    </UploadButton>
                </Upload>
                <DownLink href="/static/template/import_chw.xlsx" download>下载模板</DownLink>
            </ButtonLine>
            {(result.total > 0 || errData.length > 0) && <ResultContainer>
                <Table
                    size="small"
                    dataSource={errData.map((element, index) => ({...element, key: index}))}
                    pagination={false}
                    scroll={{y: 200}}
                >
                    <Column title="行号" align="left" dataIndex="number" key="number" width={50}/>
                    <Column title="真实姓名" align="left" dataIndex="name" key="name"/>
                    <Column title="错误事项" align="left" dataIndex="matters" key="matters"
                            render={(matters) => <span style={{color: 'red', fontSize: 12}}>{matters}</span>}/>
                </Table>
                <Result>成功校验数据{successTotal}条， 共{result.total}条</Result>
                <ImportLine>
                    <CloseButton type="default" size="middle" onClick={() => close()}>关闭</CloseButton>
                    <Button type="primary" style={{float: 'right', width: 160}} size="middle" onClick={importDatas}
                            disabled={successTotal === 0}>导入正确数据</Button>
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