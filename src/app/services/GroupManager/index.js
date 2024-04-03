import { API } from "@api";
import { createBase, createBaseNotConvert, getAllBase, updateBase, updateBaseFormatID } from "../Base";

export function createGroup(data) {
  return createBaseNotConvert(API.CREATE_GROUP, data);
}

export function editGroup(data, id) {
  return updateBase(API.EDIT_GROUP.format(id), data);
}

export function getAllGroupJoin() {
  return getAllBase(API.GET_ALL_GROUP_JOIN);
}
export function leftGroupBase(id){
  return updateBaseFormatID(API.LEFT_GROUP.format(id));
}
