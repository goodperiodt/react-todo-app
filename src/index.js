import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root'),
);

// BrowserRouter 로 App 컴포넌트를 감싸주어야 한다.
// App 컴포넌트에서 router를 사용할 것이기 때문이다.
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
