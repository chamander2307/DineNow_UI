import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from "./contexts/UserContext";
import Modal from 'react-modal'; // Thêm import cho react-modal

Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="989792724748-48cuaablio6lvteets32a345q76ktm39.apps.googleusercontent.com">
    <UserProvider>
      <App />
    </UserProvider>
  </GoogleOAuthProvider>
);
