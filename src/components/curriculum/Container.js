import React from 'react';
import styled from 'styled-components';
import { Button, Space } from 'antd';
import { Iconfont } from '../*';
// import { useSelector, useDispatch } from 'react-redux';

// import { activeComponent } from '../../actions';

export default function Container({
  // name,
  icon,
  title,
  extra,
  children,
  nested,
  hideMove,
  hideRemove,
  onRemove,
  onMoveUp,
  onMoveDown,
  noPadding,
}) {
  // const dispatch = useDispatch();
  // const { activeName } = useSelector((state) => state.components);

  return (
    <Flex>
      {!hideMove && (
        <MoveContainer>
          <Space direction="vertical">
            <IconfontButton type="iconup" size={24} onClick={onMoveUp} />
            <IconfontButton type="icondown" size={24} onClick={onMoveDown} />
          </Space>
        </MoveContainer>
      )}
      <StyledContainer nested={nested}>
        {/* <StyledContainer active={name === activeName}> */}
        {/* <TitleContainer onClick={() => dispatch(activeComponent(name))}> */}
        <TitleContainer>
          <Title>
            <Iconfont type={icon} style={{ marginRight: '8px' }} /> {title} {extra}
          </Title>
          {!hideRemove && (
            <Button size="small" type="link" onClick={onRemove}>
              <Iconfont type="icontrash-orange" size={14} /> 移除
            </Button>
          )}
        </TitleContainer>
        <Body nested={nested} noPadding={noPadding}>
          {children}
        </Body>
      </StyledContainer>
    </Flex>
  );
}

const IconfontButton = styled(Iconfont)`
  cursor: point;
  display: block;
`;

const MoveContainer = styled.div`
  margin-right: 14px;
`;

const Flex = styled.div`
  display: flex;
`;

const TitleContainer = styled.div`
  display: flex;
  height: 40px;
  padding: 0 30px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  cursor: pointer;
`;

const StyledContainer = styled.div`
  flex: 1;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: ${({ nested }) => (nested ? 0 : 20)}px;
  ${({ active }) =>
    active &&
    `
    border-color: #8E8E93;
    border-width: 2px;`}
`;

const Title = styled.div`
  font-weight: bold;
  color: #8e8e93;
`;

const Body = styled.div`
  ${({ noPadding }) => !noPadding && 'padding: 10px;'}
  ${({ nested }) => nested && 'margin-bottom: -20px;'}
`;
