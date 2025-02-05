import axios from "axios";

export const googleLogin = async (googleUserInfo) => {
  return (await axios.post(`/oauth2/google`,googleUserInfo)).data
}