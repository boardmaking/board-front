import axios from "axios";
import {SERVER_HOST} from "@/constants/index.js";


const axiosInstance = axios.create({
  baseURL: `${SERVER_HOST}:28080`,
  withCredentials: true
})



export {axiosInstance};
// export const API_SERVER_HOST = `${SERVER_HOST}:28080`
//
// export const USER = `${API_SERVER_HOST}/users`
//
// export const BOARD = `${API_SERVER_HOST}/boards`
//
// export const COMMENT = `${API_SERVER_HOST}/comment`
//
// export const IMAGE = `${API_SERVER_HOST}/images`
