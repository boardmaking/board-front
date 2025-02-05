import jwtAxios from "@/util/jwtUtil.jsx";

export const getList = async (param) => {
  return (await jwtAxios.get(`/articles`,{
    params: {
      category: param.category,
      page: param.page,
      size: param.size,
    },
  })).data
}

export const postArticle = async (params) => {
  console.log(params)
  return (await jwtAxios.post(`/articles`, params)).data
}