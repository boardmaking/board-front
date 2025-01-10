import {Navigate, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginPostAsync, logout} from "../slices/loginSlice";

const useCustomLogin = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const loginState = useSelector(state => state.loginSlice)

  const isLogin = !!loginState.email

  const isNotAdmin = () => {
    if (isLogin) {
      const roles = loginState.roles
      for (let i = 0; i < roles.length; i++) {
        if (roles[i] === 'ADMIN') {
          return false
        }
      }
    }
    return true
  }

  const isAdmin = () => {
    return  !isNotAdmin()
  }

  const doLogin = async (loginParam) => {
    const action = await dispatch(loginPostAsync(loginParam))
    return action.payload
  }

  const doLogout = () => {
    dispatch(logout())
  }

  const moveToKakao = (path, email, name) => {
    navigate(
        {pathname: `/users/${path}`},
        {state: {email, name}},
        {replace: true})
  }

  const moveToPath = (path) => {
    navigate({pathname: path}, {replace: true})
  }

  const moveToLogin = () => {
    navigate({pathname: '/users/login'}, {replace: true})
  }

  const moveToLoginReturn = () => {
    return <Navigate replace to="/users/login"/>
  }

  return {
    loginState,
    isLogin,
    doLogin,
    doLogout,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    moveToKakao,
    isNotAdmin,
    isAdmin
  }
}

export default useCustomLogin