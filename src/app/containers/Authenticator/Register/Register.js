import React from 'react';
import './Register.scss';
import AuthBase from '../AuthBase';
import { Button, Form, Input, Row, Select } from 'antd';
import { CONSTANTS, ROLE_SYSTEM, RULES } from '@constants';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { URL } from '@url';
import { connect } from 'react-redux';
import { signUpServices } from '@app/services/User';
import { toast } from '@app/common/functionCommons';

Register.propTypes = {

};


function Register({ isLoading }) {
  const history = useHistory();
  const handleRegister = async (e) => {

    const response = await signUpServices(e);
    if (response) {
      toast(CONSTANTS.SUCCESS, "Đăng ký thành công");
      history.push(URL.LOGIN);
    }

  }
  return (
    <div className='register-component'>
      <AuthBase>
        <span className='title_login'>Đăng ký TShare</span>
        <Form size="large" layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Địa chỉ Email"
            name="username"
            rules={[RULES.REQUIRED, RULES.EMAIL]}
          >
            <Input placeholder="Vui lòng nhập địa chỉ Email" disabled={isLoading} />
          </Form.Item>

          <Form.Item label="Mật khẩu" name="password" rules={[RULES.REQUIRED]}>
            <Input.Password placeholder="Vui lòng nhập mật khẩu" disabled={isLoading} />
          </Form.Item>
          <Form.Item label="Nhập lại mật khẩu" name="reenter-password" rules={[RULES.REQUIRED,
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu không khớp!"));
            },
          }),]}>
            <Input.Password placeholder="Nhập lại mật khẩu" disabled={isLoading} />
          </Form.Item>
          {/* <Form.Item label="Vai trò" name="roleUser" rules={[RULES.REQUIRED]}>
            <Select
              placeholder="Chọn vai trò người dùng"
              style={{ width: "100%", background: "none" }}



            >
              <Select.Option value={ROLE_SYSTEM.TEACHER}>Người dùng</Select.Option>
              <Select.Option value={ROLE_SYSTEM.USER}>Người</Select.Option>
            </Select>
          </Form.Item> */}

          <Row className="pt-2">
            <Button type="primary" htmlType="submit" loading={isLoading}>Đăng ký</Button>
          </Row>
        </Form>
      </AuthBase>
    </div>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading }
}
export default connect(mapStateToProps)(Register);
