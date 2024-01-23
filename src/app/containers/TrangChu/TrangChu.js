import React from 'react';
import { connect } from 'react-redux';
import './TrangChu.scss';

function TrangChu({ isLoading, ...props }) {

  return <div>

  </div>;
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default connect(mapStateToProps)(TrangChu);
