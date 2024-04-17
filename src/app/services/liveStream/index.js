import { API } from "@api";
import { createBase, createBaseNotConvert, getByIdBase } from "../Base";

export function servicesCreateLivestream(idGroup) {
  return createBaseNotConvert(API.CREATE_LIVESTREAM, {idGroup});
}

export function getVideoLivestream(id) {
  return getByIdBase(API.GET_VIDEO_LIVESTREAM, id);
}
