import axios from "axios";
import {BOARD, IMAGE} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";

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
  return (await jwtAxios.post(`${BOARD}`, params)).data
}

export const getBoard = async (boardId) => {
  console.log(boardId)
  return (await axios.get(`${BOARD}/${boardId}`)).data
}

export const postDeleteBoard = async (params) => {
  console.log(params)
  return (await jwtAxios.post(`${BOARD}/delete`, params)).data
}

export const postModify = async (params) => {
  console.log("게시판 업데이트")
  return (await axios.post(`${BOARD}/modify`, params)).data
}

export const uploadImage = async (params) => {
  console.log("이미지 업로드")
  return (await axios.post(`${IMAGE}/upload`, params)).data
}

export const postDownload = async (params) => {
  return (await jwtAxios.post(`${BOARD}/download`,params,{responseType:'blob'})).data

}