import {useMutation} from "@tanstack/react-query";
import {uploadImage} from "../../api/boardApi.js";

function useMutateUploadImage(){
  return useMutation({
    mutationFn: uploadImage,
  })
}

export default useMutateUploadImage;