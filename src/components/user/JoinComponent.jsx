import {Box, Button} from "@mui/material";
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {useState} from "react";
import {postJoin} from "../../api/userApi.js";
import {useMutation} from "@tanstack/react-query";
import ModalComponent from "../common/ModalComponent.jsx";

const initState = {
  email: '',
  password: '',
  username: '',
  kakaoId: null
}

function JoinComponent() {

  const {moveToPath} = useCustomMove()
  const [user, setUser] = useState(initState)
  const [fail, setFail] = useState(false)
  const [result, setResult] = useState(null)
  const joinMutation = useMutation({mutationFn: () => postJoin(user)})

  const handleChange = (e) => {
    user[e.target.name] = e.target.value
    setUser({...user})
  }

  const handleJoin = () => {
    joinMutation.mutate()
    if (joinMutation.isSuccess) {
      moveToPath('/')
    }
    if (joinMutation.isError) {
      setFail(true)
    }
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

  const handleJoinClose = () => {
    if (joinMutation.isSuccess) {
      moveToPath('/')
    }
    if (fail) {
      setFail(false)
    }
  }

  return (
      <div>
        {joinMutation.isSuccess ? <ModalComponent
                open={joinMutation.isSuccess}
                title={`안녕하세요`}
                content={"회원가입 해주셔서 감사합니다."}
                handleClose={handleJoinClose}
            />
            :
            <></>},
        {fail ? <ModalComponent
            open={fail}
            title={`회원가입 실패`}
            content={'입력정보를 다시 확인해주세요'}
            handleClose={handleClose}
        /> : <></>}
        <Box
            component="form"
            sx={{'& .MuiTextField-root': {m: 1, width: '25ch'}}}
            noValidate
            autoComplete="off"
        >
          <div>
            <TextFieldComponent
                id={'email'}
                name={'email'}
                type={'email'}
                label={'이메일'}
                value={user.email}
                handleChange={handleChange}
            />
          </div>
          <div>
            <TextFieldComponent
                auto={false}
                id={'password'}
                name={'password'}
                type={'password'}
                label={'비밀번호'}
                value={user.password}
                handleChange={handleChange}
            />
          </div>
          <div>
            <TextFieldComponent
                auto={false}
                id={'username'}
                name={'username'}
                type={'text'}
                label={'유저명'}
                value={user.username}
                handleChange={handleChange}
            />
          </div>
        </Box>
        <Button
            onClick={handleJoin}
        >회원가입</Button>
      </div>
  );
}

export default JoinComponent;