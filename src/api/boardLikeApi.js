import jwtAxios from "../util/jwtUtil.jsx";
import {API_SERVER_HOST} from "./config.js";

export const count = async (boardId) =>{
  return (await jwtAxios.get(`${API_SERVER_HOST}/board-likes/boards/${boardId}/count`)).data
}

export const readLike = async (param) =>{
  return (await jwtAxios.get(`${API_SERVER_HOST}/board-likes/boards/${param.boardId}/users/${param.userId}`)).data
}

export const like = async (param) =>{
  return (await jwtAxios.post(`${API_SERVER_HOST}/board-likes/boards/${param.boardId}/users/${param.userId}`)).data
}

export const unlike = async (param) =>{
  return (await jwtAxios.delete(`${API_SERVER_HOST}/board-likes/boards/${param.boardId}/users/${param.userId}`)).data
}