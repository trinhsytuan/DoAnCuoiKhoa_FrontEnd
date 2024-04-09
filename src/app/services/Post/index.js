import { API } from "@api";
import { createBase, createBaseNotConvert, deleteFile, deleteImage, uploadFileArray, uploadImageArray } from "../Base"

export const uploadImagePost = async (dataImage, removeImage, dataFile, removeFile, categoryId) => {
  const response = await uploadImageArray(dataImage, categoryId);
  deleteImage(removeImage);
  await uploadFileArray(dataFile, categoryId);
  await deleteFile(removeFile);
}
export const createPost = async(content,  idGroup) => {
  return createBaseNotConvert(API.POST, {content, idGroup});
}
