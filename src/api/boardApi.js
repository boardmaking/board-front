import {BOARD} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";
import axios from "axios";

export const getList = async (param) => {
  return (await jwtAxios.get(`${BOARD}`, {
    params: {
      searchSort: param.searchSort,
      searchKeyword: param.searchKeyword,
      page: param.page,
      size: param.size
    }
  })).data
}

export const postBoard = async (params) => {
  return (await jwtAxios.post(`${BOARD}`, params)).data
}

export const getBoard = async (boardId) => {
  return (await jwtAxios.get(`${BOARD}/${boardId}`)).data
}

export const postDeleteBoard = async (params) => {
  return (await jwtAxios.delete(`${BOARD}`, {data: params})).data
}

export const postModify = async (params) => {
  return (await jwtAxios.put(`${BOARD}`, params)).data
}

export const uploadImage = async (params) => {
  return (await jwtAxios.post(`${BOARD}/upload`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })).data
}
export const postDownload = async (params) => {
  console.log(params)
  return (await axios.get(`${BOARD}/files/${params.fileName}`, {
            responseType: 'blob',
            params: {
              fileType: params.fileType,
            },
          })).data

}