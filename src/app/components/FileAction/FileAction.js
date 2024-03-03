import React, { useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import MORE_ICON from "@assets/images/icon/more-vertical.svg";
import MOVE from "@assets/images/icon/move.svg";
import SHARE from "@assets/images/icon/share.svg";
import EDIT from "@assets/images/icon/edit.svg";
import DELETE from "@assets/images/icon/delete.svg";
import DOWNLOAD from "@assets/images/icon/download.svg";
import "./FileAction.scss";
import { EditOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { deleteFile, downloadFile } from "@app/services/FileControl";
import DialogDeleteConfim from "@components/DialogDeleteConfim/DialogDeleteConfim";
import { toast } from "@app/common/functionCommons";
import { CONSTANTS } from "@constants";
import DialogRename from "@components/DialogRename/DialogRename";

function FileAction({ className, infoFile, myInfo, getAPI }) {
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogRename, setOpenDialogRename] = useState(false);
  const handleOpenCloseDialogConfim = () => {
    setOpenDialogDelete(!openDialogDelete);
  };
  const handleOpenCloseDialogRename = () => {
    setOpenDialogRename(!openDialogRename);
  };

  const handleMoveFile = async () => {};
  const handleShareFile = async () => {};
  const handleRenameFile = async () => {
    handleOpenCloseDialogRename();
  };
  const handleDeleteFile = async () => {
    handleOpenCloseDialogConfim();
  };
  const handleDownload = async () => {
    const fileData = await downloadFile(infoFile?._id);
    const url = window.URL.createObjectURL(new Blob([fileData]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", infoFile?.originalFilename);
    document.body.appendChild(link);
    link.click();
  };
  const handleActionDelete = async () => {
    const response = await deleteFile(infoFile?._id);
    if (response) {
      getAPI();
      toast(CONSTANTS.SUCCESS, "File của bạn đã được xoá thành công");
      handleOpenCloseDialogConfim();
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="DOWNLOAD" onClick={handleDownload} icon={<img src={DOWNLOAD} />}>
        Tải về
      </Menu.Item>
      {infoFile?.userOwn === myInfo?._id && (
        <>
          <Menu.Item key="COPY" onClick={handleMoveFile} icon={<EditOutlined />}>
            Đổi chuyên mục
          </Menu.Item>
          <Menu.Item key="SHARE" onClick={handleShareFile} icon={<img src={SHARE} />}>
            Chia sẻ
          </Menu.Item>
          <Menu.Item key="RENAME" onClick={handleRenameFile} icon={<img src={EDIT} />}>
            Đổi tên
          </Menu.Item>
          <Menu.Item key="DELETE" onClick={handleDeleteFile} icon={<img src={DELETE} />}>
            Xoá
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]} className={className}>
        <Button icon={<img src={MORE_ICON} alt="" />} type="dashed" />
      </Dropdown>
      <DialogDeleteConfim
        visible={openDialogDelete}
        onCancel={handleOpenCloseDialogConfim}
        onOK={handleActionDelete}
        text="Nếu bạn xác nhận xoá, file sẽ bị xoá ra khỏi hệ thống và không thể hoàn tác"
      />
      <DialogRename
        visible={openDialogRename}
        dataFile={infoFile}
        onCancel={handleOpenCloseDialogRename}
        getAPI={getAPI}
      />
    </>
  );
}
function mapStateToProps(store) {
  const { myInfo } = store.user;
  return { myInfo };
}
export default connect(mapStateToProps)(FileAction);
