import {getCookie, setCookie} from "./cookieUtil.jsx";
import {axiosInstance} from "../api/config.js";
import axios from "axios";
import {SERVER_HOST} from "../constants/index.js";

const jwtAxios = axios.create({
  baseURL: `${SERVER_HOST}:28080`,
  withCredentials: true
})

const refreshJwt = async (accessToken, refreshToken) => {
  const header = {headers: {'Authorization': `Bearer ${accessToken}`}}
  const res = await axiosInstance.post(`/users/refresh`, {refreshToken}, header)

  return res.data
}

const beforeReq = (config) => {
  const memberInfo = getCookie('user');
  if (!memberInfo) {
    console.log('USER NOT FOUND')
    return Promise.reject({
      response: {
        data: {ERROR: "REQUIRED_LOGIN"}
      }
    })
  }
  const {accessToken} = memberInfo
  config.headers.Authorization = `Bearer ${accessToken}`
  return config
}

const requestFail = (err) => {
  return Promise.reject(err)
}

const beforeRes = async (res) => {
  const data = res.data
  if (data && data.error === 'ERROR_ACCESS_TOKEN') {
    const memberCookieValue = getCookie('user')
    const result = await refreshJwt(memberCookieValue.accessToken,
        memberCookieValue.refreshToken)
    memberCookieValue.accessToken = result.accessToken
    memberCookieValue.refreshToken = result.refreshToken
    setCookie('user', JSON.stringify(memberCookieValue), 1)

    const originalRequest = res.config
    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`
    return axiosInstance(originalRequest);
  }

  return res
}

const responseFail = (err) => {
  return Promise.reject(err)
}

jwtAxios.interceptors.request.use(beforeReq, requestFail)
jwtAxios.interceptors.response.use(beforeRes, responseFail)

export default jwtAxios

