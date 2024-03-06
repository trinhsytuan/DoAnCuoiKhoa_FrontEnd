import React from 'react';
import { connect } from 'react-redux';
import './TrangChu.scss';
import BaseContent from '@components/BaseContent';
import TLOGO from '@assets/images/logo/tshare-bgg.png';

function TrangChu({ isLoading, myInfo, ...props }) {
  return (
    <BaseContent>
     
    </BaseContent>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default connect(mapStateToProps)(TrangChu);
