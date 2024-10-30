import {useNavigate} from "react-router-dom";

const useCustomMove = () => {

  const navigate = useNavigate()

  const moveToList = () => {
    navigate({pathname: `../list`})
  }

  const moveToRead = (id) => {
    navigate({pathname: `../read/${id}`})
  }

  const moveToModify = (id) => {
    navigate({pathname: `../modify/${id}`})
  }

  const moveToPath = (path) => {
    navigate({pathname:`${path}`})
  }

  return {moveToList, moveToRead, moveToModify, moveToPath}
}

export default useCustomMove