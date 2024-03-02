import { API } from "@api"
import { getAllBase, getByIdBase, getParamsBase } from "../Base"

export const getFile = (category, fileName, share) => {   
  return getParamsBase(API.GET_ALL_FILE, {category, fileName, share}, true)
}
