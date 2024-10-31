import axios from "axios";
import {BOARD} from "./config.js";

export const getList = async (param) => {
  return (await axios.get(`${BOARD}/list`, {
    params: {
      category: param.category,
      search: param.search
    }
  })).data
}