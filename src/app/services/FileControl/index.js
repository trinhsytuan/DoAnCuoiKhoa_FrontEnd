import { API } from '@api';
import { deleteByIdBase, downloadFileBase, getParamsBase, updateBaseFormatIDNotConvert } from '../Base';

export const getFile = (category, fileName, share) => {
  return getParamsBase(API.GET_ALL_FILE, { category, fileName, share }, true);
};
export const downloadFile = (idFile) => {
  return downloadFileBase(API.DOWNLOAD_FILE, idFile);
};
export const deleteFile = (idFile) => {
  return deleteByIdBase(API.DELETE_FILE, idFile);
};
export const updateFile = (data, idFile) => {
  return updateBaseFormatIDNotConvert(API.EDIT_FILE, idFile, data);
};
