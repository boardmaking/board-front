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

export const postBoard = async (params) => {
  console.log(params)
  return (await axios.post(`${BOARD}`, params)).data
}

export const getBoard = async (boardId) => {
  console.log(boardId)
  return (await axios.get(`${BOARD}/${boardId}`)).data
}

export const postDeleteBoard = async (params) => {
  console.log(params)
  return (await axios.post(`${BOARD}/delete`, params)).data
}
