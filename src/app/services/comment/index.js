import { API } from "@api";
import { createBase, createBaseNotConvert } from "../Base";

export function createComment(contentComment, postId){
  return createBaseNotConvert(API.COMMENT, {contentComment, postId});
}
