import jwtAxios from "@/util/jwtUtil.jsx";

export const postComment = async (params) => {
  return (await jwtAxios.post(`/comment`, params)).data
}

export const getList = async (boardId) => {
  return (await jwtAxios.get(`/comment/${boardId}`)).data
}

export const deleteComment = async (param) => {
  const commentId = param.commentId
  const userId = param.userId
  return (await jwtAxios.delete(`/comment/${commentId}`,
      {data: {userId}
      })).data
}