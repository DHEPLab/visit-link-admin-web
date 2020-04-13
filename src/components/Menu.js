import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { clearToken } from '../utils/token';
import { Button } from 'antd';

export default function () {
  const history = useHistory();
  function handleLogout() {
    clearToken();
    history.push('/login');
  }

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

      <Button onClick={handleLogout} type="link">
        Logout
      </Button>
    </Menu>
  );
}

const Menu = styled.div`
  width: 200px;
  padding-top: 50px;
  height: 100%;
`;
