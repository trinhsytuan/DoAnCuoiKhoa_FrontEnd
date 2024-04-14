import { API } from "@api";
import { createBase, createBaseNotConvert, deleteBase, deleteByIdBase } from "../Base";

export function createComment(contentComment, postId){
  return createBaseNotConvert(API.COMMENT, {contentComment, postId});
}

export function deleteComment(commentId) {
  return deleteByIdBase(API.COMMENT_ID, commentId);
}
