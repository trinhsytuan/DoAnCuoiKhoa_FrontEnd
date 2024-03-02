import React from 'react';
import PropTypes from 'prop-types';
import EMPTY_FILE from "@assets/images/icon/empty-file.svg";
import './NoData.scss';
NoData.propTypes = {
  text: PropTypes.string,
};
NoData.defaultProps = {
  text: "Chưa có file nào",
  className: ""
}

function NoData({className, text}) {
  return (
    <div className={`no-data-container ${className}`}>
      <img src={EMPTY_FILE}></img>
      <span>{text}</span>
    </div>
  );
}

export default NoData;
