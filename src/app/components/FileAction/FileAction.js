import React from "react";
import { Button, Dropdown, Menu } from "antd";
import MORE_ICON from "@assets/images/icon/more-vertical.svg";
import MOVE from "@assets/images/icon/move.svg";
import SHARE from "@assets/images/icon/share.svg";
import EDIT from "@assets/images/icon/edit.svg";
import DELETE from "@assets/images/icon/delete.svg";
import DOWNLOAD from "@assets/images/icon/download.svg";
import "./FileAction.scss";

function FileAction({ className }) {
  const handleMoveFile = async () => {};
  const handleShareFile = async () => {};
  const handleRenameFile = async () => {};
  const handleDeleteFile = async () => {};
  const handleDownload = async() => {

  }

  const menu = (
    <Menu>
      <Menu.Item key="DOWNLOAD" onClick={handleDownload} icon={<img src={DOWNLOAD}/>}>
        Tải về
      </Menu.Item>
      <Menu.Item key="COPY" onClick={handleMoveFile} icon={<img src={MOVE}/>}>
        Đổi chuyên mục
      </Menu.Item>
      <Menu.Item key="SHARE" onClick={handleShareFile} icon={<img src={SHARE}/>}>
        Chia sẻ
      </Menu.Item>
      <Menu.Item key="RENAME" onClick={handleRenameFile} icon={<img src={EDIT}/>}>
        Đổi tên
      </Menu.Item>
      <Menu.Item key="DELETE" onClick={handleDeleteFile} icon={<img src={DELETE}/>}>
        Xoá
      </Menu.Item>
      
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} className={className}>
      <Button icon={<img src={MORE_ICON} alt="" />} type="dashed" />
    </Dropdown>
  );
}

export default FileAction;
