import {useMutation} from "@tanstack/react-query";
import {postBoard} from "../../api/boardApi.js";
import queryClient from "../../api/queryClient.js";
import {queryKeys} from "../../constants/index.js";

function useMutateCreateBoard() {
  return useMutation({
    mutationFn: postBoard,
    onSuccess: ({success}) => {
      if (success) {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.BOARD, queryKeys.GET_BOARDS,],
        })
      }
    },
  })
}

export default useMutateCreateBoard;