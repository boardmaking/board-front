import {useState} from 'react';
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import {Avatar, Box, Button, Container} from "@mui/material";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import ModalComponent from "../common/ModalComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {googleLogin} from "../../api/oauth2Api.js";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";
import {getNaverLoginLink} from "../../api/naverApi.js";
import {getKakaoLoginLink} from "../../api/kakaoApi.js";

const initState = {
  email: '',
  password: ''
}

const naverLink = getNaverLoginLink()
const kakaoLink = getKakaoLoginLink()

function LoginComponent() {

  const {doLogin} = useCustomLogin()
  const {moveToPath} = useCustomMove()
  const [user, setUser] = useState(initState)
  const [fail, setFail] = useState(false)
  const [success, setSuccess] = useState(false)
  const [result, setResult] = useState(null)

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  }

  const handleLogin = (e) => {
    if (e) {
      e.preventDefault();
    }
    doLogin(user)
    .then(data => {
      if (data.error) {
        setFail(true)
      } else {
        setSuccess(true)
        setResult(data.username)
      }
    })
  }

  const clientId = import.meta.env.VITE_OAUTH2_GOOGLE_CLIENT_ID
  const handleGoogleLoginSuccess = async (data) => {
    const idToken = data.credential;
    const googleInfo = jwtDecode(idToken)
    const googleUserInfo = {
      sub: googleInfo.sub,
      email: googleInfo.email,
      name: googleInfo.name
    }
    googleLogin(googleUserInfo).then(data => {
      doLogin({
        email: data.email
        , password: data.username
      }).then(data => {
        if (data.error) {
          setFail(true)
        } else {
          setSuccess(true)
          setResult(data.username)
        }
      })
    }).catch(err => {
      console.log(err)
    })

  }

  const handleGoogleLoginFailure = (error) => {
    console.log(error)
  }

  const handleClose = () => {
    if (result) {
      setResult(null)
      moveToPath('/')
    }
    if (fail) {
      setFail(false)
    }
  }

  return (
      <>
        <div className="bg-gray-100">

          <div
              className="min-h-screen w-full p-6 flex justify-center items-center">

            <div className="w-full max-w-xs">

              <div className="bg-white border p-8 shadow rounded w-full mb-6">

                <h1 className="mb-6 text-lg text-gray-900 font-thin">
                  Login to your account
                </h1>


                  <fieldset className="mb-4">
                    <label className="block text-sm text-gray-900 mb-2">Email
                      address</label>
                    <input id="email" type="email"
                           className="block w-full rounded-sm border bg-white py-2 px-3 text-sm"
                           name="email" required autoFocus/>
                  </fieldset>

                  <fieldset className="mb-4">
                    <div className="w-full flex justify-between items-center">
                      <label htmlFor="password"
                             className="block text-sm text-gray-900 mb-2">Password</label>
                      <a className="text-xs font-thin text-blue no-underline hover:underline"
                         href="#">
                        Forgotten password?
                      </a>
                    </div>
                    <input id="password" type="password"
                           className="block w-full rounded-sm border bg-white py-2 px-3 text-sm"
                           name="password" required/>
                  </fieldset>

                  <div className="pt-1 pb-5 text-sm text-gray-darker font-thin">
                    <label><input className="mr-1" type="checkbox"
                                  name="remember"
                                  id="remember"/> Remember me</label>
                  </div>


                  <button type="submit"
                          className="block w-full
                          bg-blue-600
                          text-white
                          rounded-sm py-3 text-sm tracking-wide">
                    Sign in
                  </button>
              </div>

              <p className="text-center text-sm text-gray-600 font-thin">Don't
                have
                an account yet? <a href="/register"
                                   className="text-blue-500 no-underline hover:underline">Sign
                  up</a></p>
            </div>

          </div>


        </div>
      </>
  );
}

export default LoginComponent;