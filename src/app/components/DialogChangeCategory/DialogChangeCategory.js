import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Form, Modal, Select } from "antd";
import { CONSTANTS, RULES } from "@constants";
import { updateFile } from "@app/services/FileControl";
import { toast } from "@app/common/functionCommons";

DialogChangeCategory.propTypes = {};

function DialogChangeCategory({ visible, onCancel, data, getAPI, chuyenMuc }) {
  const [formChangeCategory] = Form.useForm();
  useEffect(() => {
    if (visible) {
      formChangeCategory.setFieldsValue(data?.category);
    }
  }, [visible]);
  const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const dataOptions = chuyenMuc.map((res) => {
    return { value: res?._id, label: res?.name };
  }, []);
  const cancelForm = () => {
    formChangeCategory.resetFields();
    onCancel();
  }
  const formSubmit = async (value) => {
    const response = await updateFile({ category: value?.name }, data?._id);
    if (response) {
      toast(CONSTANTS.SUCCESS, "File đã được đổi chuyên mục");
      getAPI();
      cancelForm();
    }
  };
  return (
    <div>
      <Modal visible={visible} onCancel={cancelForm} title="Đổi chuyển mục" footer={null}>
        {data?.category ? <span>Chuyên mục hiện tại: {data?.category?.name}</span> : <span>File trên không thuộc chuyên mục nào</span>}
        <Form form={formChangeCategory} layout="vertical" size="large" onFinish={formSubmit}>
          <Form.Item name="name" label="Vui lòng lựa chọn chuyên mục cần thay đổi" rules={[RULES.REQUIRED]}>
            <Select
              showSearch
              placeholder="Vui lòng chọn chuyên mục"
              optionFilterProp="children"
              filterOption={filterOption}
              options={dataOptions}
            />
          </Form.Item>
          <div className="div-actions-center">
            <Button className="btn-xoa" onClick={cancelForm}>Huỷ</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
const mapStateToProps = (store) => {
  const { chuyenMuc } = store.user;
  return { chuyenMuc };
};
export default connect(mapStateToProps)(DialogChangeCategory);
