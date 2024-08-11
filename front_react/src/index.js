import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ContextWrapper from "./context/ContextWrapper";
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ContextWrapper>
          <App />
      </ContextWrapper>
  </React.StrictMode>
);
