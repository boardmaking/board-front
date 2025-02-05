import {useMutation} from "@tanstack/react-query";
import {postModify} from "../../api/boardApi.js";

function useMutateModifyBoard(){
  return useMutation({
    mutationFn:postModify,
  })
}

export {useMutateModifyBoard};