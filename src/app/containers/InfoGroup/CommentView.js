import React, { useState } from "react";
import PropTypes from "prop-types";
import { Avatar, Button, Divider, Input, List, Popconfirm, Skeleton } from "antd";
import { connect } from "react-redux";
import "./CommentView.scss";
import { API } from "@api";
import USER from "@assets/images/icon/user.svg";
import { createComment, deleteComment } from "@app/services/comment";
import { formatDateTime, formatVuaXong, toast } from "@app/common/functionCommons";
import { CONSTANTS } from "@constants";
CommentView.propTypes = {};

function CommentView({ data, isLoading, myInfo }) {
  const [commentPost, setCommentPost] = useState(data?.comment);
  const [contentCmt, setContentCmt] = useState("");
  const onChange = (e) => {
    setContentCmt(e.target.value);
  };
  const enterComment = async (e) => {
    const response = await createComment(e.target.value, data?._id);
    if (response) {
      setCommentPost([...commentPost, { ...response, userComment: myInfo }]);
      setContentCmt("");
    }
  };
  const confimRemoveCmt = async(id) => {
    const response = await deleteComment(id);
    if(response) {
      const newComment = commentPost.filter((item) => item?._id != response?._id);
      setCommentPost(newComment);
    }
  }
  return (
    <div>
      <h4>Bình luận cho bài viết</h4>
      {commentPost && !!commentPost.length ? (
        <List
          className="demo-loadmore-list"
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={commentPost}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Xoá bình luận"
                  description="Bạn có muốn xoá bình luận trên không"
                  okText="Có"
                  cancelText="Không"
                  onConfirm={() => confimRemoveCmt(item?._id)}
                >
                  <a key="list-loadmore-edit">Xoá</a>
                </Popconfirm>,
              ]}
            >
              <Skeleton avatar title={false} loading={false} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item?.userComment?.avatar ? API.PREVIEW_ID.format(item?.userComment?.avatar) : USER} />
                  }
                  description={
                    <div className="list-show-comment-item">
                      <span className="name-user">{item?.userComment?.username}</span>
                      <span className="show-content-comment">{item?.contentComment}</span>
                      <span>{formatVuaXong(item?.updatedAt)}</span>
                    </div>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />
      ) : (
        <span>Chưa có bình luận nào</span>
      )}
      <Divider />
      <div className="avatar-comment">
        <Avatar src={myInfo.avatar ? API.PREVIEW_ID.format(myInfo?.avatar) : USER}></Avatar>
        <Input
          placeholder="Nhập bình luận của bạn"
          onPressEnter={enterComment}
          value={contentCmt}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default connect(mapStateToProps)(CommentView);
