import React, { useState } from "react";
import PropTypes from "prop-types";
import BaseContent from "@components/BaseContent";
import "./InfoGroup.scss";
import { Button, Input, Modal, Upload } from "antd";
import CustomDivider from "@components/CustomDivider";
import { VideoCameraAddOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "@app/common/functionCommons";
import { CONSTANTS } from "@constants";
import UploadImage from "@components/UploadImage/UploadImage";
import { createPost, uploadImagePost } from "@app/services/Post";
import UploadFile from "@components/UploadFile/UploadFile";
InfoGroup.propTypes = {};

function InfoGroup(props) {
  const [fileUpload, setFileUpload] = useState([]);
  const [fileRemove, setFileRemove] = useState([]);
  const openDialogPost = (data = {}) => {
    setShowModalPost({ open: true, data });
  };
  const [image, setImage] = useState([]);
  const [remove, setRemove] = useState([]);
  const pushNewData = (data) => {
    setImage(data);
  };
  const removeData = (data) => {
    setRemove([...remove, data]);
  };
  const pushNewFileData = (data) => {
    setFileUpload(data);
  };
  const removeFileData = (data) => {
    setFileRemove([...fileRemove, data]);
  };
  const url = window.location.href;
  const urlPath = url.split("/");
  let id = urlPath[urlPath.length - 1];
  const [showModalPost, setShowModalPost] = useState({
    open: false,
    data: {},
  });

  const [editorContent, setEditorContent] = useState();

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorContent(data);
  };
  const handleCreatePost = async () => {
    await uploadImagePost(image, remove, fileUpload, fileRemove, id);
    const responsePost = await createPost(editorContent, id);
    toast(CONSTANTS.SUCCESS, "Bài viết của bạn đã được đăng");
    setShowModalPost({open: false, data: null});
    setEditorContent('<p></p>');
    setFileUpload([]);
    setFileRemove([]);
    setImage([]);
    setRemove([]);
  };

  return (
    <div>
      <BaseContent className={"info-group-container"}>
        <div className="filter-search">fsdfds</div>
        <div className="post-group-container">
          <Input
            placeholder="Bạn muốn đăng gì không ?"
            style={{ backgroundColor: "#f5f5f5" }}
            onClick={openDialogPost}
          ></Input>
          <CustomDivider></CustomDivider>
          <Button icon={<VideoCameraAddOutlined />} type="primary">
            Video trực tiếp
          </Button>
        </div>
      </BaseContent>
      <Modal
        visible={showModalPost.open}
        title="Đăng bài"
        footer={null}
        width={1000}
        className="modal-dangbai"
        onCancel={() => setShowModalPost({ open: false, data: {} })}
      >
        <div>
          <div className="ckeditor-container">
            <CKEditor
              editor={ClassicEditor}
              onChange={handleEditorChange}
              data={editorContent}
              style={{ width: "100%" }}
            />
          </div>
          <div className="upload-image-container">Tải ảnh lên</div>
          <UploadImage data={image} onChange={pushNewData} onRemove={removeData} remove={remove} type="imageGroup" />
          <div className="tai-file-len">Tải file lên</div>
          <UploadFile data={fileUpload} onChange={pushNewFileData} onRemove={removeFileData} remove={fileRemove}/>
          <div className="btn-dangbai">
            <Button type="primary" onClick={handleCreatePost}>
              Đăng bài
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default InfoGroup;
