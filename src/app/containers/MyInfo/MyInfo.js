import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Col, Form, Input, Modal, Row, Table, Tabs } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SaveFilled } from "@ant-design/icons";

import CustomSkeleton from "@components/CustomSkeleton";
import DropzoneImage from "@components/DropzoneImage";
import "./MyInfo.scss";
import { CONSTANTS, LOAI_TAI_KHOAN, RULES, VI_ROLE_SYSTEM } from "@constants";
import { cloneObj, formatSTT, toast, validateSpaceNull } from "@app/common/functionCommons";
import { requestChangePassword } from "@app/services/User";

import * as user from "@app/store/ducks/user.duck";
import * as app from "@app/store/ducks/app.duck";
import { createCategory, deleteCategory, getAllCategory, updateCategory } from "@app/services/Category";
import DialogDeleteConfim from "@components/DialogDeleteConfim/DialogDeleteConfim";
import BaseContent from "@components/BaseContent";

function MyInfo({ myInfo, isLoading, roleList, requestChuyenMuc, chuyenMuc, ...props }) {
  const [formInfo] = Form.useForm();
  const [formChangePassword] = Form.useForm();
  const [avatarTemp, setAvatarTemp] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [form] = Form.useForm();
  const [visibleThemChuyenMuc, setVisibleThemChuyenMuc] = useState(false);
  const cancelThemChuyenMuc = () => {
    setVisibleThemChuyenMuc(!visibleThemChuyenMuc);
    form.resetFields();
  };
  const handleConfim = () => {
    setVisibleDelete(!visibleDelete);
  };
  React.useEffect(() => {
    if (myInfo) {
      const dataField = cloneObj(myInfo);
      dataField.role = VI_ROLE_SYSTEM[dataField?.roleUser];
      formInfo.setFieldsValue(dataField);
      if (avatarTemp) setAvatarTemp(null);
    }
  }, [myInfo]);
  useEffect(() => {
    getListCategory();
  }, []);
  const getListCategory = async () => {
    requestChuyenMuc();
  };

  function handleUpdateMyInfo() {
    const formData = new FormData();
    if (avatarTemp) {
      formData.append("avatar", avatarTemp);
    }
    props.updateMyInfo(formData);
  }

  async function handleChangePassword({ oldPassword, newPassword }) {
    const apiResponse = await requestChangePassword({
      oldPassword,
      newPassword,
    });
    if (apiResponse) {
      toast(CONSTANTS.SUCCESS, "Thay đổi mật khẩu thành công");
      formChangePassword.resetFields();
    }
  }

  function onValuesChange(changedValues, allValues) {
    const { newPassword } = changedValues;
    if (newPassword && allValues?.confirmPassword) {
      formInfo.validateFields(["confirmPassword"]);
    }
  }

  function handleSelectAvatar(files) {
    setAvatarTemp(files);
  }
  const columnChuDe = [
    {
      title: "STT",
      render: (v1, v2, value) => formatSTT(limit, page, value),
      key: "STT",
      align: "center",
      width: 60,
    },
    { title: "Tên chủ đề", dataIndex: "name", key: "name" },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      width: 100,
      render: (_, value) => {
        return (
          <div className="action-dv">
            <Button
              icon={<EditOutlined />}
              style={{ border: 0 }}
              onClick={() => {
                handleEdit(value);
              }}
            ></Button>
            <Button icon={<DeleteOutlined />} style={{ border: 0 }} onClick={() => deleteChuyenMuc(value)}></Button>
          </div>
        );
      },
    },
  ];
  const onChangePagination = (page, limit) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", page);
    queryParams.set("limit", limit);
    const queryString = queryParams.toString();
    history.push(`?${queryString}`);
  };

  const createChuyenMuc = async (e) => {
    if (form.getFieldValue("keyId")) {
      const response = await updateCategory(form.getFieldValue("keyId"), e);
      if (response) {
        toast(CONSTANTS.SUCCESS, "Thay đổi chủ đề thành công");
        cancelThemChuyenMuc();
        getListCategory();
      }
    } else {
      const response = await createCategory(e);
      if (response) {
        toast(CONSTANTS.SUCCESS, "Tạo chủ đề thành công");
        cancelThemChuyenMuc();
        getListCategory();
      }
    }
  };
  const handleEdit = async (value) => {
    cancelThemChuyenMuc();
    form.setFieldsValue({ keyId: value._id, name: value.name });
  };
  const deleteChuyenMuc = async (value) => {
    handleConfim();
    form.setFieldsValue({ keyId: value._id });
  };
  const handleDeleteCM = async () => {
    const id = form.getFieldValue("keyId");
    form.resetFields();
    const response = await deleteCategory(id);
    if (response) {
      toast(CONSTANTS.SUCCESS, "Xoá chuyên mục thành công");
      handleConfim();
      getListCategory();
    }
  };
  return (
    <div>
      <BaseContent>
        <Tabs size="small">
          <Tabs.TabPane tab="Thông tin cá nhân" key="1">
            <Row>
              <Col sm={18}>
                <Form form={formInfo} id="form-info" autoComplete="off" onFinish={handleUpdateMyInfo}>
                  <Row gutter={15}>
                    <CustomSkeleton
                      size="default"
                      label="Email"
                      name="username"
                      type={CONSTANTS.TEXT}
                      labelCol={{ xs: 8 }}
                      layoutCol={{ xs: 24 }}
                      disabled={true}
                      showInputLabel={myInfo.loaiTaiKhoan === LOAI_TAI_KHOAN.TAI_KHOAN_HRMS.value}
                      form={formInfo}
                    />
                    <CustomSkeleton
                      size="default"
                      label="Vai trò"
                      name="role"
                      type={CONSTANTS.TEXT}
                      labelCol={{ xs: 8 }}
                      layoutCol={{ xs: 24 }}
                      disabled={true}
                      form={formInfo}
                    />
                    <CustomSkeleton
                      size="default"
                      label="Khoá công khai"
                      name="publicKey"
                      type={CONSTANTS.TEXT}
                      labelCol={{ xs: 8 }}
                      layoutCol={{ xs: 24 }}
                      disabled={true}
                    />
                    <CustomSkeleton
                      size="default"
                      label="Khoá bí mật"
                      name="privateKey"
                      type={CONSTANTS.TEXT}
                      labelCol={{ xs: 8 }}
                      layoutCol={{ xs: 24 }}
                      disabled={true}
                      helpInline={false}
                    />
                  </Row>
                </Form>
              </Col>
              <Col sm={6}>
                <div className="attach-image">
                  <div className="attach-image__title">Ảnh đại diện</div>
                  <div className="attach-image__img">
                    <DropzoneImage
                      width={38 * 5}
                      height={38 * 5}
                      imgUrl={myInfo.avatar}
                      stateRerender={myInfo.avatar}
                      handleDrop={handleSelectAvatar}
                    />
                  </div>
                </div>
              </Col>

              <Col xs={24}>
                <Button
                  htmlType="submit"
                  form="form-info"
                  type="primary"
                  className="float-right"
                  icon={<SaveFilled />}
                  disabled={isLoading}
                >
                  Lưu
                </Button>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đổi mật khẩu" key="2">
            <Form
              form={formChangePassword}
              autoComplete="off"
              onFinish={handleChangePassword}
              onValuesChange={onValuesChange}
            >
              <Row gutter={15}>
                <CustomSkeleton
                  size="default"
                  label="Mật khẩu cũ"
                  name="oldPassword"
                  type={CONSTANTS.PASSWORD}
                  rules={[RULES.REQUIRED]}
                  layoutCol={{ xs: 24 }}
                  labelCol={{ xs: 8 }}
                  disabled={isLoading}
                  helpInline={false}
                />
                <CustomSkeleton
                  size="default"
                  label="Mật khẩu mới"
                  name="newPassword"
                  type={CONSTANTS.PASSWORD}
                  layoutCol={{ xs: 24 }}
                  labelCol={{ xs: 8 }}
                  rules={[RULES.REQUIRED, RULES.PASSWORD_FORMAT]}
                  disabled={isLoading}
                  helpInline={false}
                />
                <CustomSkeleton
                  size="default"
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  layoutCol={{ xs: 24 }}
                  labelCol={{ xs: 8 }}
                  type={CONSTANTS.PASSWORD}
                  helpInline={false}
                  rules={[
                    RULES.REQUIRED,
                    ({ getFieldValue }) => ({
                      validator(rule, confirmPassword) {
                        if (confirmPassword && getFieldValue("newPassword") !== confirmPassword) {
                          return Promise.reject("Mật khẩu mới không trùng khớp");
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  disabled={isLoading}
                  form={formInfo}
                />

                <Col xs={24}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="float-right"
                    icon={<SaveFilled />}
                    disabled={isLoading}
                  >
                    Lưu
                  </Button>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Chuyên mục" key="3">
            <div className="chuyenmuc-myinfo-container">
              <div className="btn-actions">
                <Button type="primary" icon={<PlusOutlined />} onClick={cancelThemChuyenMuc}>
                  Thêm chuyên mục
                </Button>
              </div>
              <div className="table-instruction">
                <Table columns={columnChuDe} dataSource={chuyenMuc} pagination={false}></Table>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
        <Modal
          visible={visibleThemChuyenMuc}
          onCancel={cancelThemChuyenMuc}
          title="Thêm chuyên mục mới"
          footer={null}
          width={700}
        >
          <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={createChuyenMuc}
            className="formCreateChuyenMuc"
          >
            <Form.Item name="keyId" hidden={true}></Form.Item>
            <Form.Item name="name" label="Tên chuyên mục" rules={[RULES.REQUIRED, { validator: validateSpaceNull }]}>
              <Input placeholder="Vui lòng nhập tên chuyên mục"></Input>
            </Form.Item>
            <div className="btn-submit-actions">
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("keyId") ? "Lưu thông tin" : "Thêm chuyên mục"}
              </Button>
            </div>
          </Form>
        </Modal>
        <DialogDeleteConfim visible={visibleDelete} onCancel={handleConfim} onOK={handleDeleteCM} />
      </BaseContent>
    </div>
  );
}

function mapStateToProps(store) {
  const { myInfo, chuyenMuc } = store.user;
  const { isLoading } = store.app;
  const { requestChuyenMuc } = store.user;
  return { isLoading, myInfo, requestChuyenMuc, chuyenMuc };
}

export default connect(mapStateToProps, { ...app.actions, ...user.actions })(MyInfo);
