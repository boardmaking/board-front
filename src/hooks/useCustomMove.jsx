import {
  createSearchParams,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import {useState} from "react";

const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue
  }
  return parseInt(param)
}

const useCustomMove = () => {

  const navigate = useNavigate()

  const [refresh, setRefresh] = useState(false)

  const [queryParams] = useSearchParams()
  const category = getNum(queryParams.get('category'), 1)

  const queryDefault = createSearchParams({category}).toString()

  const moveToList = (pageParam) => {

    console.log(pageParam)
    let queryStr =
        ""
    if (pageParam) {
      const category = getNum(pageParam.category, 1)
      queryStr = createSearchParams({category}).toString()
    } else {
      queryStr = queryDefault
    }

    setRefresh(!refresh)

    navigate({pathname: `../`, search: queryStr},{state:{search:pageParam.search}})
  }

  const moveToModify = (id) => {
    navigate({
      pathname: `../modify/${id}`,
      search: queryDefault
    })
  }

  const moveToRead = (id) => {
    navigate({
      pathname: `../read/${id}`,
      search: queryDefault
    })
  }

  return {moveToList, moveToModify, moveToRead, refresh}
}

export default useCustomMove