import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
// import { useSelector, useDispatch } from 'react-redux';

// import { activeComponent } from '../../actions';

export default function Container({
  // name,
  title,
  children,
  hideMove,
  hideRemove,
  onRemove,
  onMoveUp,
  onMoveDown,
}) {
  // const dispatch = useDispatch();
  // const { activeName } = useSelector((state) => state.components);

  return (
    <Flex>
      {!hideMove && (
        <MoveContainer>
          <button onClick={onMoveUp}>上移</button>
          <br />
          <br />
          <button onClick={onMoveDown}>下移</button>
        </MoveContainer>
      )}
      <StyledContainer>
        {/* <StyledContainer active={name === activeName}> */}
        {/* <TitleContainer onClick={() => dispatch(activeComponent(name))}> */}
        <TitleContainer>
          <Title>{title}</Title>
          {!hideRemove && (
            <Button size="small" type="link" onClick={onRemove}>
              移除
            </Button>
          )}
        </TitleContainer>
        <Body>{children}</Body>
      </StyledContainer>
    </Flex>
  );
}

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
  margin-bottom: 20px;
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
  padding: 10px;
`;
