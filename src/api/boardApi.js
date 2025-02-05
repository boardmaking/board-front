import {axiosInstance} from "@/api/config.js";
import jwtAxios from "@/util/jwtUtil.jsx";

const getList = async (body) => {
  const {data} = await jwtAxios.get(`/boards`, {
    params: body
  });

  return data
}

const postBoard = async (params) => {
  console.log('params', params)
  return (await jwtAxios.post(`/boards`, params)).data
}

const getBoard = async (boardId) => {
  return (await jwtAxios.get(`/boards/${boardId}`)).data
}

const postDeleteBoard = async (params) => {
  return (await jwtAxios.delete(`/boards`, {data: params})).data
}

const postModify = async (params) => {
  const {data} = await jwtAxios.put(`/boards`, params);
  return data
}

const uploadImage = async (params) => {
  return (await jwtAxios.post(`/boards/upload`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })).data
}
const postDownload = async (params) => {
  console.log(params)
  return (await axiosInstance.get(`/boards/files/${params.fileName}`, {
    responseType: 'blob',
    params: {
      fileType: params.fileType,
    },
  })).data

}

export {
  getList,
  getBoard,
  postBoard,
  postDeleteBoard,
  postModify,
  uploadImage,
  postDownload
};
