import {getBoard} from "../../api/boardApi.js";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../../constants/index.js";

function useGetBoard(id){
  return useQuery({
    queryFn:()=>getBoard(id),
    queryKey:[queryKeys.BOARD,queryKeys.GET_BOARD,id],
    enabled: Boolean(id),
  })
}

export default useGetBoard;