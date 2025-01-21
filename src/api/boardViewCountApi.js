import jwtAxios from "../util/jwtUtil.jsx";
import {API_SERVER_HOST} from "./config.js";

export const increaseViewCount = async (param) => {
  return (await jwtAxios.post(`${API_SERVER_HOST}/board-views/boards/${param.boardId}/users/${param.userId}`)).data
}

export const readViewCount = async (param) => {
  return (await jwtAxios.get(`${API_SERVER_HOST}/board-views/boards/${param.boardId}/count`)).data
}