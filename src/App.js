import React from 'react';
import axios from 'axios';
import { BrowserRouter, Link } from 'react-router-dom';
import { applyToken, getToken } from './utils/token';
import { message } from 'antd';
import Router from './router';

export default function () {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
        <Router />
      </BrowserRouter>
    </div>
  );
}

applyToken(getToken());

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (!response) {
      message.error('Network error, please try again later!');
      return Promise.reject(error);
    }
    response.data.detail && message.error(response.data.detail);
    return Promise.reject(error);
  }
);
