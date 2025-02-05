import {axiosInstance} from "@/api/config.js";

const kakao_client_id = import.meta.env.VITE_OAUTH2_KAKAO_CLIENT_ID
const kakao_redirect_url = import.meta.env.VITE_KAKAO_REDIRECT_URI

export const getKakaoLoginLink = () => {
  return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao_client_id}&redirect_uri=${kakao_redirect_url}`
}

export const getKakaoAccessToken = async (authCode) => {
  const header = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}
  const params = {
    code: authCode,
  }

  return (await axiosInstance.post(`/oauth2/kakao`, params,
      header)).data
}
