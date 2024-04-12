import { API } from "@api";
import { createBase, createBaseNotConvert, deleteFile, deleteImage, getByIdBase, uploadFileArray, uploadImageArray } from "../Base"

export const uploadImagePost = async (dataImage, removeImage, dataFile, removeFile, postId) => {
  const response = await uploadImageArray(dataImage, postId);
  deleteImage(removeImage);
  await uploadFileArray(dataFile, postId);
  await deleteFile(removeFile);
}
export const createPost = async(content,  idGroup) => {
  return createBaseNotConvert(API.POST, {content, idGroup});
}
export const getPostByCategory = async(categoryId) => {
  return getByIdBase(API.GET_POST_BY_CATEGORY, categoryId)
}
