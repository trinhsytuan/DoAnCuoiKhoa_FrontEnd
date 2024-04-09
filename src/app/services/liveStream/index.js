import { API } from "@api";
import { createBase, createBaseNotConvert } from "../Base";

export function servicesCreateLivestream(idGroup) {
  return createBaseNotConvert(API.CREATE_LIVESTREAM, {idGroup});
}
