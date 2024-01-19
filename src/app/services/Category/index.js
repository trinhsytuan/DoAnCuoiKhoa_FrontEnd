import { API } from '@api';

const { createBase, getAllBase, updateBaseFormatID, deleteByIdBase } = require("../Base");

export const createCategory = (data) => {
  return createBase(API.CATEGORY, data);
};
export const getAllCategory = () => {
  return getAllBase(API.GET_ALL_CATEGORY);
}
export const updateCategory = (id, data) => {
  return updateBaseFormatID(API.UPDATE_CATEGORY, id, data);
}
export const deleteCategory = (id) => {
  return deleteByIdBase(API.DELETE_CATEGORY, id);
}
