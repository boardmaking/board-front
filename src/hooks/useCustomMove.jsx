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

const getString = (param, defaultValue) => {
  if (!param){
    return defaultValue
  }
  return param
}

const useCustomMove = () => {

  const navigate = useNavigate()

  const [refresh, setRefresh] = useState(false)

  const [queryParams] = useSearchParams()
  const category = getNum(queryParams.get('category'), '')
  const search = getString(queryParams.get('search'), '')

  const queryDefault = createSearchParams({category,search}).toString()

  const moveToList = (pageParam) => {

    console.log(pageParam)
    let queryStr =
        ""
    if (pageParam) {
      const category = getNum(pageParam.category, 1)
      const search = getString(pageParam.search, '')
      queryStr = createSearchParams({category,search}).toString()
    } else {
      queryStr = queryDefault
    }

    setRefresh(!refresh)

    navigate({pathname: `../`, search: queryStr})
  }

  const moveToMain = () => {
    navigate({pathname: `/`})
  }

  const moveToPath = (path) => {
    navigate({pathname:path})
  }

  const moveToModify = (id) => {
    navigate({
      pathname: `../modify/${id}`,
      search: queryDefault
    })
  }

  const moveToWrite = () => {
    navigate({
      pathname: `boards/writer`
    })
  }

  // const moveToRead = (id) => {
  //   navigate({
  //     pathname: `../read/${id}`,
  //     search: queryDefault
  //   })
  // }

  const moveToRead =() => {
    navigate({
      pathname: '../read',
             })
  }
  return {moveToList, moveToWrite, moveToMain, moveToModify, moveToRead, moveToPath,refresh, category,search}
}

export default useCustomMove