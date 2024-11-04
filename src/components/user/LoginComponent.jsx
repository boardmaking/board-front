import {useState} from 'react';
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import {Box, Button} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import ModalComponent from "../common/ModalComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";

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
    user[e.target.name] = e.target.value
    setUser({...user})
  }

  const handleLogin = () => {

    doLogin(user)
    .then(data => {
      if (data.ERROR) {
        setFail(true)
      } else {
        setSuccess(true)
        setResult(data.username)
      }
    })
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
      <div>
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
            title={`안녕하세요 로그인에 실패하셨습니다`}
            content={'아이디와 비밀번호를 다시 확인해주세요'}
            handleClose={handleClose}
        /> : <></>}
        <Box
            component="form"
            sx={{'& .MuiTextField-root': {m: 1, width: '25ch'}}}
            noValidate
            autoComplete="off"
        >
        <TextFieldComponent
            id={'email'}
            name={'email'}
            type={'email'}
            label={'이메일'}
            value={user.email}
            handleChange={handleChange}
        />
        <TextFieldComponent
            auto={false}
            id={'password'}
            name={'password'}
            type={'password'}
            label={'비밀번호'}
            value={user.password}
            handleChange={handleChange}
        />
        </Box>
        <Button
        onClick={handleLogin}
        >로그인</Button>
      </div>
  );
}

export default LoginComponent;