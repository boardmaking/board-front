import {axiosInstance} from "@/api/config.js";
import jwtAxios from "@/util/jwtUtil.jsx";

const postLogin = async ({email, password}) => {
  const header = {headers: {"Content-Type": "application/x-www-form-urlencoded"}};
  const form = new FormData();
  form.append('username', email);
  form.append('password', password);

  const {data} = await axiosInstance.post(`/users/login`, form, header);
  return data;
}

const postJoin = async (user) => {
  const {data} = await jwtAxios.post(`/users/join`, user)
  return data;
}

export {postLogin, postJoin};
