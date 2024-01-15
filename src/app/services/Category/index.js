import { API } from "@api";

const { createBase } = require("../Base");

export const createCategory = (data) => {
  return createBase(API.CATEGORY, data);
};
