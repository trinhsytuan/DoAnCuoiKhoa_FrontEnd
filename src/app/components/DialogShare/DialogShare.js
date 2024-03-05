import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./DialogShare.scss";
import { connect } from "react-redux";
import { Button, Form, Modal, Select } from "antd";
import Loading from "@components/Loading";
import { getAllUser } from "@app/services/User";
import { shareFile, updateFile } from "@app/services/FileControl";
DialogShare.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  getAPI: PropTypes.func,
  dataFile: PropTypes.object,
};

function DialogShare({ visible, onCancel, getAPI, dataFile, isLoading }) {
  const [allUser, setAllUser] = useState([]);
  const [formShare] = Form.useForm();
  useEffect(() => {
    if (visible) {
      formShare.setFieldsValue(dataFile?.userDecription);
    }
  }, [visible]);
  useEffect(() => {
    getAPIUser();
  }, []);
  const getAPIUser = async () => {
    const apiResponse = await getAllUser();
    setAllUser(apiResponse);
  };

  const closeForm = () => {
    formShare.resetFields();
    onCancel();
  };
  const optionsFile = allUser.map((res) => {
    return {
      label: res?.username,
      value: res?._id,
    };
  },[dataFile]);

  const submitForm = async(e) => {
    const response = await shareFile({listUser: e?.userDecription}, dataFile?._id);
    if(response) {
      getAPI();
      closeForm();
    }
  };
  return (
    <div>
      <Loading active={isLoading}>
        <Modal visible={visible} onCancel={closeForm} footer={null} title="Thay đổi quyền truy cập">
          <Form form={formShare} layout="vertical" onFinish={submitForm}>
            <Form.Item label="Vui lòng chọn người mà bạn muốn chia sẻ" name="userDecription">
              <Select
                mode="multiple"
                allowClear
                placeholder="Vui lòng chọn người mà bạn cần chia sẻ"
                options={optionsFile}
                defaultValue={dataFile?.userDecription}
              />
            </Form.Item>
            <div className="div-actions-center">
              <Button className="btn-xoa" onClick={closeForm}>Huỷ</Button>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </div>
          </Form>
        </Modal>
      </Loading>
    </div>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}
export default connect(mapStateToProps)(DialogShare);
