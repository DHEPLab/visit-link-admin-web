import React from "react";
import styled from "styled-components";
import { Input, Row, Col, Button } from 'antd';
import { useFormikContext, FieldArray, Field } from 'formik'
import { Checkbox } from 'formik-antd'
import { QuestionButton, Iconfont } from "../*";

import Container from "./Container";

const colors = {
  text: "#3490de",
  radio: "#05bfb2",
  checkbox: "#6a2c70",
};

const typeLabels = {
  text: "文本问题",
  radio: "单选问题",
  checkbox: "多选问题",
};

export default function QuestionRadio({ name, onBlur, onChange, value, index, ...props }) {

  const { values, handleChange } = useFormikContext()
  const type = values.questions[index]?.type

  function addOptions (arrayHelper) {
    arrayHelper.push({label:'', needEnter: false})
  }

  function handlerRadioChange (name, value) {
    const onChange = handleChange(`${name}`)
    onChange({ target: { value } })
  }

  function handlerRemove (arrayHelper, i) {
    arrayHelper.remove(i)
  }

  return (
    <Container
      right={props.readonly && <TextType color={colors[type]}>{typeLabels[type]}</TextType>}
      icon={type === 'Radio' ? 'iconquestion-radio-gray' : 'iconquestion-checkbox-gray'}
      title={type === 'Radio' ? '单选问题' : '多选问题'}
      name={name}
      noPadding
      {...props}
    >
      {props.readonly ? <TextTitle>{value.title}</TextTitle> : <RowLine>
        <Text span={4}>题干文本 </Text>
        <Col span={20}>
          <TitleInput
            name={`${name}.title`}
            defaultValue={value.title}
            placeholder="请输入题干文本"
            onBlur={e => handlerRadioChange(`${name}.title`, e.target.value)}
          />
          <Field
            name={`${name}.title`}
            validate={value => value && `${value}`.trim() ? '' : 'Required！'}
            style={{ display: 'none' }}
          />
        </Col>
      </RowLine>}

      {props.readonly ? <>
        {value.options && value.options.map((e, i) => (
            <div key={i}>
              <ReadOnlyLine>
                <Text span="2" >选项{String.fromCharCode(i + 65)}. </Text>
                <Text>{value.options[i]?.label}</Text>
                <Col>
                  {value.options[i]?.needEnter && <Input style={{marginLeft: 20}} placeholder='请输入内容' />}
                </Col>
              </ReadOnlyLine>
            </div>
          ))}
      </> :
      <FieldArray name={`${name}.options`} render={(arrayHelper) => (
        <>
        {!props.readonly && <div onClick={() => addOptions(arrayHelper)} ><QuestionButton title="点击添加选项" icon="iconadd-circle-Fill" /></div>}
          {value.options && value.options.map((e, i) => (
            <div key={i}>
              <RowLine>
                <Text span={4}>选项{String.fromCharCode(i + 65)}. </Text>
                <Col span={12}>
                  <Field
                    name={`${name}.options.${i}.label`}
                    validate={value => value && `${value}`.trim() ? '' : 'Required！'}
                    defaultValue={e.label}
                    placeholder="请输入内容"
                    style={{ width: 360 }}
                    as={Input}
                  />
                </Col>
                <Col span={3}>
                  <AddTextCheckbox
                    name={`${name}.options.${i}.needEnter`}
                    defaultChecked={e.needEnter}
                    onChange={e => handlerRadioChange(`${name}.options.${i}.needEnter`, e.target.checked)}
                  >附文本框</AddTextCheckbox>
                </Col>
                <Col span={3}>
                  <Button size="small" type="link" onClick={() => handlerRemove(arrayHelper, i)}>
                    <Iconfont type="icontrash-orange" size={14} /> 移除
                  </Button>
                </Col>
              </RowLine>
            </div>
          ))}
          <Field
            name={`${name}.options`}
            style={{ display: 'none' }}
            validate={options => options && options.length > 0 ? '' : 'Can’t be empty!'}
          />
        </>
      )} />}

    </Container>
  );
}

const TextType = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: ${({ color }) => color};
`;

const RowLine = styled(Row)`
  margin: 10px auto;
`

const ReadOnlyLine = styled(Row)`
  margin-left: 40px;
  margin-bottom: 10px;
`

const TitleInput = styled(Input)`
  width: 35vw;
`

const TextTitle = styled.div`
  font-weight: 600;
  margin: 20px 0px 20px 40px;
`

const Text = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: justify;
  color: #8E8E93;
  font-weight: 500;
`

const AddTextCheckbox = styled(Checkbox)`
  color: #FF7C53;
  font-weight: 600;
`
