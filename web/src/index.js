import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './fonts/PT-Root-UI_Light.css';
import './fonts/PT-Root-UI_Regular.css';
import './fonts/PT-Root-UI_Medium.css';
import './fonts/PT-Root-UI_Bold.css';
import './fonts/PT-Root-UI_VF.css';
import './fonts/PT-Mono_Bold.css';
import './fonts/PT-Mono_Regular.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
//  {/*<React.StrictMode>*/}
root.render(
    <GoogleOAuthProvider clientId="1037513626119-tr0e89854umsklsgog6ak8qmrgmmolps.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
