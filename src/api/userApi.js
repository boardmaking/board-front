import {USER} from "./config.js";
import axios from "axios";
import jwtAxios from "../util/jwtUtil.jsx";

export const postLogin = async (loginParam) => {
  const header = { headers: { "Content-Type": "application/x-www-form-urlencoded" }};
  const form = new FormData();
  form.append('username', loginParam.email);
  form.append('password', loginParam.password);

  const response = await axios.post(`${USER}/login`, form, header);

  const token = response.data.accessToken;

  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return response.data;
}

export const postJoin = async (user) => {
  return (await jwtAxios.post(`${USER}/join`, user)).data
}

export const getUser = async (email) => {
  return (await axios.post(`${USER}/user`, email)).data
}

export const patchUsername = async (userId, username) => {
  return (await jwtAxios.patch(`${USER}/${userId}/username`, {username})).data
}

export const patchPassword = async (userId, password) => {
  return (await jwtAxios.patch(`${USER}/${userId}/password`, {password})).data
}

export const deleteUser = async (userId, user) => {
  return (await jwtAxios.delete(`${USER}/${userId}`, {data:user})).data
}

export const postRejoin = async (user) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}
  return (await axios.post(`${USER}/reuser`,user,header)).data
}
