// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 웹 성능을 측정하려면 결과를 전송하는 함수를 전달하세요.
// 예: reportWebVitals(console.log)
// 자세히 알아보기: https://bit.ly/CRA-vitals
// reportWebVitals();