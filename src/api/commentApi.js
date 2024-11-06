import axios from "axios";
import {COMMENT} from "./config.js";

export const postComment = async (params) => {
    console.log(params)
    return (await axios.post(`${COMMENT}`, params)).data
}

export const getList = async (boardId) => {
    console.log("댓글 리스트 불러오기" + boardId)
    return (await axios.get(`${COMMENT}/${boardId}`)).data
}