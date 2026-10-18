import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import App from './App';
const root = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
if (root.dataset.path === (window.location.pathname.replace(/\/$/, '') || '/'))
  ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
