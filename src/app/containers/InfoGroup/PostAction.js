import React from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Menu } from "antd";

PostAction.propTypes = {};
import MORE_ICON from "@assets/images/icon/more-vertical.svg";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deletePost } from "@app/services/Post";
import { toast } from "@app/common/functionCommons";
import { CONSTANTS } from "@constants";

function PostAction({data, setDataAfterRemove, onEditPost}) {
  const onDelete = async() => {
    const response = await deletePost(data?._id);
    if(response) {
      toast(CONSTANTS.SUCCESS, "Xoá bài viết thành công");
      setDataAfterRemove(data?._id);
    }
  }
  const onEdit = () => {
    onEditPost(data);
  }
  const menu = (
    <Menu>
      <Menu.Item key="EDIT" icon={<EditOutlined />} onClick={onEdit}>
        Sửa
      </Menu.Item>
      <Menu.Item key="DELETE" icon={<DeleteOutlined />} onClick={onDelete}>
        Xoá
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button icon={<img src={MORE_ICON} alt="" />} type="text" />
    </Dropdown>
  );
}

export default PostAction;
