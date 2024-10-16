import React from 'react';
import { connect } from 'react-redux';
import './TrangChu.scss';
import BaseContent from '@components/BaseContent';
import TLOGO from '@assets/images/logo/SafeDrive-bgg.png';

function TrangChu({ isLoading, myInfo, ...props }) {
  return (
    <BaseContent>
      <div className="trang-chu-container">
        <h1>Hệ thống chia sẻ dữ liệu trực tuyến SafeDrive</h1>
        <h1>Chào bạn! {myInfo?.username}</h1>
        <img src={TLOGO} />
      </div>
    </BaseContent>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default connect(mapStateToProps)(TrangChu);
