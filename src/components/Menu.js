import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default function () {
  return (
    <Menu>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/curriculums">Curriculum</Link>
        </li>
        <li>
          <Link to="/modules">Module</Link>
        </li>
        <li>
          <Link to="/accounts">Account Mgt</Link>
        </li>
      </ul>
    </Menu>
  );
}

const Menu = styled.div`
  width: 200px;
  padding-top: 50px;
  height: 100%;
`;
