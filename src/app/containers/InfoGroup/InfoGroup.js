import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BaseContent from "@components/BaseContent";
import "./InfoGroup.scss";
import { Button, Input, Modal, Avatar, Menu, Dropdown } from "antd";
import CustomDivider from "@components/CustomDivider";
import { DeleteOutlined, EditOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { formatDateTime, toast } from "@app/common/functionCommons";
import { CONSTANTS, TYPE_POST } from "@constants";
import UploadImage from "@components/UploadImage/UploadImage";
import { createPost, editPost, getPostByCategory, uploadImagePost } from "@app/services/Post";
import UploadFile from "@components/UploadFile/UploadFile";
import { connect } from "react-redux";
import USER from "@assets/images/icon/user.svg";
import { API } from "@api";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { URL } from "@url";
import Loading from "@components/Loading";
import PostView from "./PostView";
import PostAction from "./PostAction";
import LivestreamView from "./LivestreamView";

InfoGroup.propTypes = {};

function InfoGroup({ myInfo, isLoading }) {
  const [fileUpload, setFileUpload] = useState([]);
  const [fileRemove, setFileRemove] = useState([]);
  const openDialogPost = () => {
    setShowModalPost({ open: true, data: null });
  };
  const [image, setImage] = useState([]);
  const [remove, setRemove] = useState([]);
  const [allPostCategory, setPostCategory] = useState([]);
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
  useEffect(() => {
    getPostCategory();
  }, []);
  const getPostCategory = async () => {
    const response = await getPostByCategory(id);
    if (response) setPostCategory(response);
  };
  const [editorContent, setEditorContent] = useState();

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorContent(data);
  };
  const handleCreatePost = async () => {
    if (!showModalPost?.data) {
      const responsePost = await createPost(editorContent, id);
      await uploadImagePost(image, remove, fileUpload, fileRemove, responsePost?._id, id);

      toast(CONSTANTS.SUCCESS, "Bài viết của bạn đã được đăng");
      setShowModalPost({ open: false, data: null });
      setEditorContent("<p></p>");
      setFileUpload([]);
      setFileRemove([]);
      setImage([]);
      setRemove([]);
      getPostCategory();
    } else {
      const responsePost = await editPost(editorContent, showModalPost?.data?._id);
      await uploadImagePost(image, remove, fileUpload, fileRemove, showModalPost?.data?._id, id);

      toast(CONSTANTS.SUCCESS, "Bài viết của bạn đã sửa thành công");
      setShowModalPost({ open: false, data: null });
      setEditorContent("<p></p>");
      setFileUpload([]);
      setFileRemove([]);
      setImage([]);
      setRemove([]);
      getPostCategory();
    }
  };
  const removePost = (id) => {
    const newPost = allPostCategory.filter((value) => value?._id != id);
    setPostCategory(newPost);
  };

  const onEditPost = (data) => {
    setShowModalPost({ open: true, data: data });
    setEditorContent(data?.content);
    const image = data?.attachment.filter((data) => data?.fileType == "image");
    const FileImage = data?.attachment.filter((data) => data?.fileType == "file");
    setImage(image);
    setFileUpload(FileImage);
  };
 

  return (
    <div>
      <BaseContent className={"info-group-container"}>
        <div className="post-group-container">
          <div className="post-group-header">
            <Avatar src={myInfo?.avatar ? API.PREVIEW_ID.format(myInfo.avatar) : USER} />
            <Input
              placeholder="Bạn muốn đăng gì không ?"
              style={{ backgroundColor: "#f5f5f5" }}
              onClick={openDialogPost}
              value={""}
            ></Input>
          </div>
          <CustomDivider></CustomDivider>
          <div className="video-tt">
            <Link to={URL.CREATE_LIVESTREAM.format(id)}>
              <Button icon={<VideoCameraAddOutlined />} type="primary">
                Video trực tiếp
              </Button>
            </Link>
          </div>
        </div>

        {allPostCategory.map((res, index) => {
          return (
            <div className="post-item-category" key={index}>
              <div className="post-item-header">
                <div className="post-item-header-left-left">
                  <div className="post-item-header-left">
                    <Avatar src={res?.userOwn?.avatar ? API.PREVIEW_ID.format(res?.userOwn?.avatar) : USER}></Avatar>
                  </div>
                  <div className="post-item-header-right">
                    <span className="post-item-userOwn">{res?.userOwn?.username}</span>
                    <span className="post-item-time">{formatDateTime(res?.createdAt)}</span>
                  </div>
                </div>
                <div className="post-item-header-left-right">
                  <PostAction data={res} setDataAfterRemove={removePost} onEditPost={onEditPost} />
                </div>
              </div>
              {res?.type == TYPE_POST.POST ? <PostView data={res}/> : <LivestreamView data={res} />}
            </div>
          );
        })}
      </BaseContent>
      <Loading active={isLoading} />
      <Modal
        visible={showModalPost.open}
        title={showModalPost?.data ? "Sửa bài viết" : "Đăng bài viết"}
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
          <div className="upload-image-container">Tải video lên</div>
          <UploadImage data={image} onChange={pushNewData} onRemove={removeData} remove={remove} type="imageGroup" />
          {/* <div className="tai-file-len">Tải file lên</div>
          <UploadFile data={fileUpload} onChange={pushNewFileData} onRemove={removeFileData} remove={fileRemove} /> */}
          <div className="btn-dangbai">
            <Button type="primary" onClick={handleCreatePost}>
              {showModalPost?.data ? "Lưu" : "Đăng bài viết"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return { myInfo, isLoading };
}
export default connect(mapStateToProps)(InfoGroup);
