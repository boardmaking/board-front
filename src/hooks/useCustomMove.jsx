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
  const searchSort = getString(queryParams.get('searchSort'), 'CONTENT')
  const searchKeyword = getString(queryParams.get('searchKeyword'), '')
  const page = getNum(queryParams.get('page'),0)
  const size = getNum(queryParams.get('size'),12)

  const queryDefault = createSearchParams({searchSort,searchKeyword,page,size}).toString()

  const moveToList = (pageParam) => {
    let queryStr = ""

    if (pageParam) {
      const searchSort = getString(pageParam.searchSort, '')
      const searchKeyword = getString(pageParam.searchKeyword, '')
      const page = getNum(pageParam.page,0)
      const size = getNum(pageParam.size,12)
      queryStr = createSearchParams({searchSort,searchKeyword,page,size}).toString()
    } else {
      queryStr = queryDefault
    }

    setRefresh(!refresh)

    navigate({pathname: `/boards/list`, search: queryStr})
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
      pathname: `../post`,
    })
  }

  const moveToRead = (id) => {
    navigate({
      pathname: `../read/${id}`,
      search: queryDefault
    })
  }


  return {moveToList, moveToWrite, moveToMain, moveToModify, moveToRead, moveToPath,refresh, searchSort,searchKeyword,page,size}
}

export default useCustomMove