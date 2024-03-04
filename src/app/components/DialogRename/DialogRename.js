import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Modal } from 'antd';
import './DialogRename.scss';
import { updateFile } from '@app/services/FileControl';
import { toast } from '@app/common/functionCommons';
import { CONSTANTS } from '@constants';

DialogRename.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  dataFile: PropTypes.object,
  getAPI: PropTypes.func,
};

function DialogRename({ visible, onCancel, dataFile, getAPI }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.setFieldsValue(dataFile);
    }
  }, [visible]);
  const onFinishForm = async (e) => {
    const response = await updateFile(e, dataFile?._id);
    if(response) {
      toast(CONSTANTS.SUCCESS, "File đã được đổi tên thành công");
      getAPI();
      form.resetFields();
      onCancel();
    }
  };
  return (
      <Modal visible={visible} onCancel={onCancel} title="Thay đổi tên file" footer={null} className="dialog-rename-container">
        <Form form={form} onFinish={onFinishForm}>
          <Form.Item name="originalFilename" label="Tên file">
            <Input />
          </Form.Item>
          <div className="btn-actions-rename">
            <Button className="btn-xoa" onClick={onCancel}>Huỷ thay đổi</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
  );
}

export default DialogRename;
