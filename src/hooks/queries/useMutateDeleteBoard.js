import {useMutation} from "@tanstack/react-query";
import {postDeleteBoard} from "../../api/boardApi.js";

function useMutateDeleteBoard(){
  return useMutation({
    mutationFn: postDeleteBoard,
  })
}

export default useMutateDeleteBoard;