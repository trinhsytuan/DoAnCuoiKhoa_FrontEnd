import React from 'react';

import './AuthBase.scss';

import BD from '@assets/images/logo/bd.svg';
import SafeDriveLOGO from '@assets/images/logo/logofict.png';
function AuthBase({ children }) {

  return <div id="login">
    <div className="login-form">
      <div className="logo">
        <img alt="" src={BD}/>
        <img src={SafeDriveLOGO}  />
      </div>
      {children}
    </div>
  </div>;
}

export default (AuthBase);
