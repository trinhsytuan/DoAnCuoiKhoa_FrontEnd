import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BaseContent from "@components/BaseContent";
import "./QuanLyNhom.scss";
import { Button, Form, Input, Modal, Select, Table } from "antd";
import {
  CloseOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { CONSTANTS, RULES } from "@constants";
import { createGroup, editGroup, getAllGroupJoin, leftGroupBase } from "@app/services/GroupManager";
import { toast } from "@app/common/functionCommons";
import { getAllUser } from "@app/services/User";
import { connect } from "react-redux";
import * as user from "@app/store/ducks/user.duck";
import * as app from "@app/store/ducks/app.duck";
QuanLyNhom.propTypes = {};

function QuanLyNhom({ requestChuyenMuc, chuyenMuc }) {
  const [openModal, setOpenModal] = useState(false);
  const [formMember] = Form.useForm();
  const [visibleModalMember, setVisibleModalMember] = useState({
    open: false,
    data: null,
  });
  const [userList, setUserList] = useState([]);
  const [openModalLeft, setOpenModalLeft] = useState({
    open: false,
    data: null,
  });
  useEffect(() => {
    getAPI();
  }, []);
  async function getAPI() {
    requestChuyenMuc();
    const apiUserResponse = await getAllUser();
    if (apiUserResponse) setUserList(apiUserResponse);
  }
  const [form] = Form.useForm();
  const submitForm = async (e) => {
    const response = await createGroup(e);
    if (response) {
      toast(CONSTANTS.SUCCESS, "Tạo nhóm thành công");
      setOpenModal(false);
      getAPI();
    }
  };
  const leftGroup = async () => {
    const responseLeftGroup = await leftGroupBase(openModalLeft.data._id);
    if (responseLeftGroup) {
      toast(CONSTANTS.SUCCESS, "Rời nhóm thành công");
      setOpenModalLeft({ open: false, data: null });
      getAPI();
    }
  };
  const manageMember = (data) => {
    setVisibleModalMember({
      open: true,
      data,
    });
  };
  const dataSource = [
    {
      title: "STT",
      render: (v1, v2, value) => value + 1,
      key: "STT",
      align: "center",
      width: 60,
    },
    { title: "Tên nhóm", dataIndex: "nameGroup", key: "nameGroup" },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      width: 100,
      render: (_, value) => {
        return (
          <div className="action-dv">
            <Button
              icon={<UsergroupDeleteOutlined />}
              style={{ border: 0 }}
              onClick={() => manageMember(value)}
            ></Button>
            <Button
              icon={<CloseSquareOutlined />}
              style={{ border: 0 }}
              onClick={() => setOpenModalLeft({ open: true, data: value })}
            ></Button>
          </div>
        );
      },
    },
  ];
  const closeForm = async () => {
    await setVisibleModalMember({ open: false, data: null });
    formMember.resetFields();
  };
  const optionMember = userList.map(
    (res) => {
      return {
        label: res?.username,
        value: res?._id,
      };
    },
    [userList]
  );
  const changeMember = async (e) => {
    const response = await editGroup(e, visibleModalMember?.data?._id);
    if (response) {
      toast(CONSTANTS.SUCCESS, "Thay đổi thành viên nhóm thành công");
      closeForm();
      getAPI();
    }
  };
  return (
    <div>
      <BaseContent>
        <div className="group-manager-container">
          <div className="group-manager-header">
            <span className="title">Quản lý nhóm</span>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
              Thêm nhóm
            </Button>
          </div>
          <div className="group-manager-body">
            <Table dataSource={chuyenMuc} columns={dataSource} />
          </div>
        </div>
        <Modal visible={openModal} title="Thêm nhóm" onCancel={() => setOpenModal(false)} footer={null}>
          <Form form={form} layout="vertical" onFinish={submitForm}>
            <Form.Item label="Tên nhóm" name="nameGroup" rules={[RULES.REQUIRED]}>
              <Input />
            </Form.Item>
            <div className="div-actions-center">
              <Button type="primary" htmlType="submit">
                Tạo nhóm
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal
          visible={openModalLeft?.open}
          title="Rời nhóm"
          onCancel={() => setOpenModalLeft({ open: false, data: null })}
          footer={null}
        >
          <div className="md-rn">Bạn chắc chắn muốn rời nhóm ?</div>
          <div className="div-actions-center">
            <Button type="primary" onClick={leftGroup}>
              Rời nhóm
            </Button>
          </div>
        </Modal>
        <Modal visible={visibleModalMember?.open} onCancel={closeForm} footer={null} title="Thay đổi thành viên nhóm">
          <Form form={formMember} layout="vertical" onFinish={changeMember}>
            <Form.Item label="Vui lòng chọn người bạn muốn thêm / xoá khỏi nhóm" name="member">
              <Select
                mode="multiple"
                allowClear
                placeholder="Vui lòng chọn người mà bạn cần quản lý"
                options={optionMember}
                defaultValue={visibleModalMember?.data?.member}
              />
            </Form.Item>
            <div className="div-actions-center">
              <Button className="btn-xoa" onClick={closeForm}>
                Huỷ
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </div>
          </Form>
        </Modal>
      </BaseContent>
    </div>
  );
}
function mapStateToProps(store) {
  const { requestChuyenMuc } = store.user;
  const { myInfo, chuyenMuc } = store.user;
  const { isLoading } = store.app;
  return { requestChuyenMuc, myInfo, chuyenMuc, isLoading };
}
export default connect(mapStateToProps, { ...app.actions, ...user.actions })(QuanLyNhom);
