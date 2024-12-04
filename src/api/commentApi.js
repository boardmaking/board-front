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