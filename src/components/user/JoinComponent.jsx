import { Box, Button, Container } from "@mui/material";
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import { useState } from "react";
import { postJoin } from "../../api/userApi.js";
import { useMutation } from "@tanstack/react-query";
import ModalComponent from "../common/ModalComponent.jsx";
import {toast} from "react-toastify";


const initState = {
    email: '',
    password: '',
    username: '',
    kakaoId: null
}

const initErrors = {
    email: '',
    password: '',
    username: ''
}

function JoinComponent() {
    const { moveToPath } = useCustomMove()
    const [user, setUser] = useState(initState)
    const [errors, setErrors] = useState(initErrors)
    const [fail, setFail] = useState(false)
    const [result, setResult] = useState(null)

    const joinMutation = useMutation({mutationFn: () => postJoin(user),
        onSuccess: () => {
            toast.success(
                <>
                    환영합니다 {user.username}님. <br />
                    회원가입 하신 계정으로 로그인해주세요.
                </>
            );
            moveToPath('/');
        },
    onError:() => {
        setFail(true);
    }})

    const handleJoin = () => {
        joinMutation.mutate()
        if (joinMutation.isSuccess) {
            moveToPath('/')
        }
        if (joinMutation.isError) {
            setFail(true)
        }
    }

    const validateEmail = (email) => {
        if (!email) {
            return '이메일을 입력해주세요'
        }
        if (!email.includes('@')) {
            return '이메일에는 @가 포함되어야 합니다'
        }
        const [localPart, domain] = email.split('@')
        if (!localPart || !domain) {
            return '올바른 이메일 형식이 아닙니다'
        }
        return ''
    }

    const validatePassword = (password) => {
        if (!password) {
            return '비밀번호를 입력해주세요'
        }
        if (password.length < 6) {
            return '비밀번호는 6자 이상이어야 합니다'
        }
        return ''
    }

    const validateUsername = (username) => {
        if (!username) {
            return '유저명을 입력해주세요'
        }
        if (username.length < 2) {
            return '유저명은 2자 이상이어야 합니다'
        }
        return ''
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleBlur = (e) => {
        const { name, value } = e.target

        let error = ''
        switch (name) {
            case 'email':
                error = validateEmail(value)
                break
            case 'password':
                error = validatePassword(value)
                break
            case 'username':
                error = validateUsername(value)
                break
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }))
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
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {joinMutation.isSuccess && (
                    <ModalComponent
                        open={joinMutation.isSuccess}
                        title="안녕하세요"
                        content="회원가입 해주셔서 감사합니다."
                        handleClose={handleJoinClose}
                    />
                )}

                {fail && (
                    <ModalComponent
                        open={fail}
                        title="회원가입 실패"
                        content="입력정보를 다시 확인해주세요"
                        handleClose={handleClose}
                    />
                )}

                <Box
                    component="form"
                    sx={{
                        width: '100%',
                        mt: 1,
                        '& .MuiTextField-root': { mb: 2 }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextFieldComponent
                        id="email"
                        name="email"
                        type="email"
                        label="이메일"
                        value={user.email}
                        handleChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />

                    <TextFieldComponent
                        id="password"
                        name="password"
                        type="password"
                        label="비밀번호"
                        value={user.password}
                        handleChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />

                    <TextFieldComponent
                        id="username"
                        name="username"
                        type="text"
                        label="유저명"
                        value={user.username}
                        handleChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleJoin}
                        sx={{ mt: 2 }}
                    >
                        회원가입
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default JoinComponent;