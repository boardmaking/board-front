import {axiosInstance} from "./config.js";

const naver_client_id = import.meta.env.VITE_OAUTH2_NAVER_CLIENT_ID
const naver_redirect_url = import.meta.env.VITE_NAVER_REDIRECT_URI

export const getNaverLoginLink = () => {
  return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_client_id}&redirect_uri=${naver_redirect_url}`
}

export const getNaverAccessToken = async (authCode) => {
  const header = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}
  const params = {
    code: authCode,
  }

  return (await axiosInstance.post(`/oauth2/naver`, params,
      header)).data
}
