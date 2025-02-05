import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {getList} from "@/api/boardApi.js";
import useCustomMove from "@/hooks/useCustomMove.jsx";
import {queryKeys} from "@/constants/index.js";

function useGetBoards() {
  const {searchSort, searchKeyword, page, size, refresh} = useCustomMove()

  const body = {
    refresh,
    searchKeyword,
    searchSort,
    page,
    size,
  }

  return useQuery({
    queryFn: () => getList(body),
    queryKey: [
      queryKeys.BOARD,
      queryKeys.GET_BOARDS,
      {...body}
    ],
    placeholderData: keepPreviousData,
  })
}

export default useGetBoards;