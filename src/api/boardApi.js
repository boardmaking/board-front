import axios from "axios";
import {BOARD, IMAGE} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";

export const getList = async (param) => {
  return (await jwtAxios.get(`${BOARD}/list`, {
    params: {
      category: param.category,
      search: param.search
    }
  })).data
}

export const postBoard = async (params) => {
  return (await jwtAxios.post(`${BOARD}`, params)).data
}

export const getBoard = async (boardId) => {
  return (await axios.get(`${BOARD}/${boardId}`)).data
}

export const postDeleteBoard = async (params) => {
  return (await jwtAxios.post(`${BOARD}/delete`, params)).data
}

export const postModify = async (params) => {
  return (await jwtAxios.post(`${BOARD}/modify`, params)).data
}

export const uploadImage = async (params) => {
  return (await jwtAxios.post(`${IMAGE}/upload`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })).data
}
export const postDownload = async (params) => {
  return (await jwtAxios.post(`${BOARD}/download`,params,{responseType:'blob'})).data

}