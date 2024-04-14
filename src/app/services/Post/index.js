import { API } from "@api";
import { createBase, createBaseNotConvert, deleteBase, deleteByIdBase, deleteFile, deleteImage, getByIdBase, updateBaseFormatID, uploadFileArray, uploadImageArray } from "../Base"

export const uploadImagePost = async (dataImage, removeImage, dataFile, removeFile, postId) => {
  const response = await uploadImageArray(dataImage, postId);
  deleteImage(removeImage);
  await uploadFileArray(dataFile, postId);
  await deleteFile(removeFile);
}
export const createPost = async(content,  idGroup) => {
  return createBaseNotConvert(API.POST, {content, idGroup});
}
export const editPost = async(content,  idGroup) => {
  return updateBaseFormatID(API.POST_ID, idGroup, {content});
}
export const getPostByCategory = async(categoryId) => {
  return getByIdBase(API.GET_POST_BY_CATEGORY, categoryId)
}
export const deletePost = (postId) => {
  return deleteByIdBase(API.POST_ID, postId);
}
