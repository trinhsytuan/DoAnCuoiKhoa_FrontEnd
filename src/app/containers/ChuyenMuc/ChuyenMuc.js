import React from 'react';
import PropTypes from 'prop-types';
import './ChuyenMuc.scss'
import BaseContent from '@components/BaseContent';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
ChuyenMuc.propTypes = {

};

function ChuyenMuc({ isLoading }) {
  const url = window.location.href;
  const urlPath = url.split("/");
  let id = urlPath[urlPath.length - 1];
  id = id.length == 24 ? id : null;
  return (
    <Loading active={isLoading}>
      <BaseContent>
        fsđfsfds dfgdfg sdfds dsgsdgx
      </BaseContent>
    </Loading>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading }
}
export default connect(mapStateToProps)(ChuyenMuc);
