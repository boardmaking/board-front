import jwtAxios from "@/util/jwtUtil.jsx";

export const increaseViewCount = async (param) => {
  return (await jwtAxios.post(`/board-views/boards/${param.boardId}/users/${param.userId}`)).data
}

export const readViewCount = async (param) => {
  return (await jwtAxios.get(`/board-views/boards/${param.boardId}/count`)).data
}