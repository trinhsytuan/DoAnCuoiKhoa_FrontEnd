import React from "react";
import PropTypes from "prop-types";
import { Avatar, Divider, Input, List, Skeleton } from "antd";
import { connect } from "react-redux";
import "./CommentView.scss";
import { API } from "@api";
import USER from "@assets/images/icon/user.svg";
import { createComment } from "@app/services/comment";
import { toast } from "@app/common/functionCommons";
import { CONSTANTS } from "@constants";
CommentView.propTypes = {};

function CommentView({ data, isLoading, myInfo }) {
  console.log(data);
  const loadMore = () => {};
  const enterComment = async (e) => {
    const response = createComment(e.target.value, data?._id);
    if(response) toast(CONSTANTS.SUCCESS, "Thành công")
  };
  return (
    <div>
      <h4>Bình luận cho bài viết</h4>
      {data?.comment && !!data.comment.length ? (
        <List
          className="demo-loadmore-list"
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={data?.comment}
          renderItem={(item) => (
            <List.Item actions={[<a key="list-loadmore-more">Xoá</a>]}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={<Avatar src={null} />}
                  title={<a href="https://ant.design">{item.name?.last}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
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
        <Input placeholder="Nhập bình luận của bạn" onPressEnter={enterComment} />
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
