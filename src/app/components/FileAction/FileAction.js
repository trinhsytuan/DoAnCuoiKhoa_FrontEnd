import React, { useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import MORE_ICON from "@assets/images/icon/more-vertical.svg";
import SHARE from "@assets/images/icon/share.svg";
import EDIT from "@assets/images/icon/edit.svg";
import DELETE from "@assets/images/icon/delete.svg";
import DOWNLOAD from "@assets/images/icon/download.svg";
import "./FileAction.scss";
import { EditOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { deleteFile, downloadFile } from "@app/services/FileControl";
import DialogDeleteConfim from "@components/DialogDeleteConfim/DialogDeleteConfim";
import { toast } from "@app/common/functionCommons";
import { CONSTANTS } from "@constants";
import DialogRename from "@components/DialogRename/DialogRename";
import DialogChangeCategory from "@components/DialogChangeCategory/DialogChangeCategory";
import DialogShare from "@components/DialogShare/DialogShare";
import DialogPreview from "@components/DialogPreview/DialogPreview";

function FileAction({ className, infoFile, myInfo, getAPI }) {
  const videoExtensions = ["mp4", "avi", "mkv", "mov", "wmv"];
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogRename, setOpenDialogRename] = useState(false);
  const [openDialogChangeCategory, setOpenDialogChangeCategory] = useState(false);
  const [openDialogShare, setOpenDialogShare] = useState(false);
  const [isShowDialogPreview, setShowDialogPreview] = useState(false);
  const handleShowDialogPreview = () => {
    setShowDialogPreview(!isShowDialogPreview);
  };
  const handleOpenCloseDialogConfim = () => {
    setOpenDialogDelete(!openDialogDelete);
  };
  const handleOpenCloseDialogRename = () => {
    setOpenDialogRename(!openDialogRename);
  };
  const handleOpenCloseDialogChangeCategory = () => {
    setOpenDialogChangeCategory(!openDialogChangeCategory);
  };
  const handleChangeDialogShare = () => {
    setOpenDialogShare(!openDialogShare);
  };
  const handleMoveFile = async () => {
    handleOpenCloseDialogChangeCategory();
  };
  const handleShareFile = async () => {
    handleChangeDialogShare();
  };
  const handleRenameFile = async () => {
    handleOpenCloseDialogRename();
  };
  const handleDeleteFile = async () => {
    handleOpenCloseDialogConfim();
  };
  const handleDownload = async () => {
    const fileData = await downloadFile(infoFile?._id);
    if (fileData) {
      const url = window.URL.createObjectURL(new Blob([fileData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", infoFile?.originalFilename);
      document.body.appendChild(link);
      link.click();
    }
  };
  const handleActionDelete = async () => {
    const response = await deleteFile(infoFile?._id);
    if (response) {
      getAPI();
      toast(CONSTANTS.SUCCESS, "File của bạn đã được xoá thành công");
      handleOpenCloseDialogConfim();
    }
  };
  const splitFileExtension = () => {
    const extension = infoFile?.originalFilename.split(".").pop().toLowerCase();
    return videoExtensions.includes(extension);
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
      {splitFileExtension() && (
        <>
          <Menu.Item key="PREVIEW" onClick={handleShowDialogPreview} icon={<PlayCircleOutlined />}>
            Xem trước Video
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
      <DialogChangeCategory
        visible={openDialogChangeCategory}
        onCancel={handleOpenCloseDialogChangeCategory}
        data={infoFile}
        getAPI={getAPI}
      />
      <DialogShare visible={openDialogShare} onCancel={handleChangeDialogShare} getAPI={getAPI} dataFile={infoFile} />
      <DialogPreview visible={isShowDialogPreview} onCancel={handleShowDialogPreview} infoFile={infoFile} />
    </>
  );
}
function mapStateToProps(store) {
  const { myInfo } = store.user;
  return { myInfo };
}
export default connect(mapStateToProps)(FileAction);
