import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import DeleteIcon from '@assets/icons/delete-icon.svg';
import { CONSTANT_MESSAGE } from '@constants';
import './DialogDeleteConfim.scss';

DialogDeleteConfim.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onOK: PropTypes.func,
  text: PropTypes.string,
};
DialogDeleteConfim.defaultProps = {
  visible: false,
  text: CONSTANT_MESSAGE.REMOVE
};
function DialogDeleteConfim({ visible, onCancel, onOK, text }) {
  return (
    <div className="delete-confim-container">
      <Modal visible={visible} onCancel={onCancel} footer={null}>
        <div className="delete-confim-children">
          <div className="delete-confim-icon">
            <img src={DeleteIcon} />
          </div>
          <div className="delete-confim-title">
            <span>Xác nhận xoá</span>
          </div>
          <div className="delete-confim-body">
            <span>{text}</span>
          </div>
          <div className="delete-confim-btn">
            <Button className="delete-confim-btnConfim" onClick={onOK}>
              Xoá
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DialogDeleteConfim;


