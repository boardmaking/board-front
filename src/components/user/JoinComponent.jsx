import {Box, Button, Container, MenuItem, Select} from "@mui/material";
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import { useState } from "react";
import { postJoin } from "../../api/userApi.js";
import { useMutation } from "@tanstack/react-query";
import ModalComponent from "../common/ModalComponent.jsx";
import { toast } from "react-toastify";
const USER1 = import.meta.env.VITE_API_USER1
const USER2 = import.meta.env.VITE_API_USER2
const USER3 = import.meta.env.VITE_API_USER3
const USER4 = import.meta.env.VITE_API_USER4
const USER5 = import.meta.env.VITE_API_USER5
const USER6 = import.meta.env.VITE_API_USER6
const USER7 = import.meta.env.VITE_API_USER7
const USER8 = import.meta.env.VITE_API_USER8

const initState = {
    email: '',
    password: '',
    username: '',
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
        onError: () => {
            setFail(true);
        }
    })

    if (joinMutation.isError){
        console.log(joinMutation.error)
    }

    const handleJoin = () => {
        joinMutation.mutate()
    }

    const validateEmail = (email) => {
        if (!email) {
            return '이메일을 입력해주세요'
        }
        const emailPattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
        if (!emailPattern.test(email)) {
            return '이메일 형식은 email@???.??? 또는 email@???.??과 같습니다.'
        }
        return ''
    }

    const validatePassword = (password) => {
        if (!password) {
            return '비밀번호를 입력해주세요'
        }
        const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()._-]{6,16}$/
        if (!passwordPattern.test(password)) {
            return '비밀번호는 6자 이상 16자 이하, 영문과 숫자를 포함해야 합니다.'
        }
        return ''
    }

    const validateUsername = (username) => {
        if (!username) {
            return '유저명을 입력해주세요'
        }
        const usernamePattern = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/
        if (!usernamePattern.test(username)) {
            return '유저명은 2자 이상 16자 이하, 영어 또는 숫자 또는 한글로 구성되어야 합니다.'
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
        setFail(false)
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

                    <Select
                        name={'username'}
                        value={'username'}
                        onChange={handleChange}
                        displayEmpty
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>유저를 선택하세요</MenuItem>
                        <MenuItem value={USER1}>{USER1}</MenuItem>
                        <MenuItem value={USER2}>{USER2}</MenuItem>
                        <MenuItem value={USER3}>{USER3}</MenuItem>
                        <MenuItem value={USER4}>{USER4}</MenuItem>
                        <MenuItem value={USER5}>{USER5}</MenuItem>
                        <MenuItem value={USER6}>{USER6}</MenuItem>
                        <MenuItem value={USER7}>{USER7}</MenuItem>
                        <MenuItem value={USER8}>{USER8}</MenuItem>
                    </Select>

                    <TextFieldComponent
                        disabled={true}
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
                        disabled={joinMutation.isPending}
                    >
                        회원가입
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default JoinComponent;