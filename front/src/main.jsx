import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// 웹 성능을 측정하려면 결과를 전송하는 함수를 전달하세요.
// 예: reportWebVitals(console.log)
// 자세히 알아보기: https://bit.ly/CRA-vitals
// reportWebVitals();