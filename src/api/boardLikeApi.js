import jwtAxios from "@/util/jwtUtil.jsx";

export const count = async (boardId) =>{
  return (await jwtAxios.get(`/board-likes/boards/${boardId}/count`)).data
}

export const readLike = async (param) =>{
  return (await jwtAxios.get(`/board-likes/boards/${param.boardId}/users/${param.userId}`)).data
}

export const like = async (param) =>{
  return (await jwtAxios.post(`/board-likes/boards/${param.boardId}/users/${param.userId}`)).data
}

export const unlike = async (param) =>{
  return (await jwtAxios.delete(`/board-likes/boards/${param.boardId}/users/${param.userId}`)).data
}