import axios from "axios";
import {COMMENT} from "./config.js";

export const postComment = async (params) => {
    console.log(params)
    return (await axios.post(`${COMMENT}`, params)).data
}