import axios from "axios";
import {COMMENT} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";

export const postComment = async (params) => {
    console.log(params)
    return (await jwtAxios.post(`${COMMENT}`, params)).data
}

export const getList = async (boardId) => {
    console.log("댓글 리스트 불러오기" + boardId)
    return (await axios.get(`${COMMENT}/${boardId}`)).data
}

export const deleteComment = async (param) => {
    const commentId = param.commentId
    const userId = param.userId
    return (await jwtAxios.delete(`${COMMENT}/${commentId}`,{data: {userId}})).data
}