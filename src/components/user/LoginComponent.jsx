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

const initState = {
  email: '',
  password: ''
}

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
      doLogin({email:data.email
      ,password: data.username
      }).then(data=>{
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
      <Container component="main" maxWidth="xs">
        {result ? <ModalComponent
                open={success}
                title={`안녕하세요 ${result}, 님`}
                content={"로그인 하셨습니다."}
                handleClose={handleClose}
            />
            :
            <></>}
        {fail ? <ModalComponent
            open={fail}
            title={`로그인 실패`}
            content={'아이디와 비밀번호를 다시 확인해주세요'}
            handleClose={handleClose}
        /> : <></>}

        <Paper
            elevation={3}
            sx={{
              marginTop: 8,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
        >
          <Avatar sx={{
            margin: 1,
            backgroundColor: 'secondary.main',
            width: 56,
            height: 56
          }}>
            <LockOutlinedIcon fontSize="large"/>
          </Avatar>

          <Typography component="h1" variant="h5" sx={{marginBottom: 3}}>
            로그인
          </Typography>

          <Box
              component="form"
              sx={{
                width: '100%',
                marginTop: 1,
                '& .MuiTextField-root': {marginBottom: 2},
              }}
          >
            <TextFieldComponent
                id={'email'}
                name={'email'}
                type={'email'}
                label={'이메일'}
                value={user.email}
                handleChange={handleChange}
                fullWidth
            />
            <TextFieldComponent
                auto={false}
                id={'password'}
                name={'password'}
                type={'password'}
                label={'비밀번호'}
                value={user.password}
                handleChange={handleChange}
                fullWidth
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleLogin}
                sx={{
                  marginTop: 3,
                  marginBottom: 2,
                  padding: 1.5,
                  fontSize: '1.1rem'
                }}
            >
              로그인
            </Button>
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onFailure={handleGoogleLoginFailure}
              />
            </GoogleOAuthProvider>
          </Box>
        </Paper>
      </Container>
  );
}

export default LoginComponent;