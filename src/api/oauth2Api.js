import axios from "axios";
import {API_SERVER_HOST} from "./config.js";

export const googleLogin = async (googleUserInfo) => {
  return (await axios.post(`${API_SERVER_HOST}/oauth2/google`,googleUserInfo)).data
}