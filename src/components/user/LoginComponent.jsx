import {useEffect, useState} from 'react';
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import ModalComponent from "../common/ModalComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {Link} from "react-router-dom";
import {getKakaoLoginLink} from "../../api/kakaoApi.js";

const initState = {
    email: '',
    password: ''
}

const kakaoLink = getKakaoLoginLink()

function LoginComponent() {

    const {doLogin, isLogin} = useCustomLogin()
    const [loginStatus, setLoginStatus] = useState(false)
    const {moveToPath} = useCustomMove()
    const [user, setUser] = useState(initState)
    const [fail, setFail] = useState(false)
    const [success, setSuccess] = useState(false)
    const [result, setResult] = useState(null)
    const [saveIdFlag, setSaveIdFlag] = useState(false)
    const SAVE_ID = 'SAVE_ID';
    const SAVE_ID_FLAG = 'SAVE_ID_FLAG';

    useEffect(() => {
        const idFlag = JSON.parse(localStorage.getItem(SAVE_ID_FLAG))
        if (idFlag !== null) {
            setSaveIdFlag(idFlag)
        }
        if (idFlag === false) {
            localStorage.setItem(SAVE_ID, "")
        }
        const email = localStorage.getItem(SAVE_ID)
        if (email !== null) {
            user.email = email
        }
        if (isLogin) {
            setLoginStatus(true)
        }
    }, [])

    const handleChangeInput = (e) => {
        const {name, value} = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }

    const handleLogin = () => {
        if (saveIdFlag){
            console.log("SAVE_ID_FLAG",user.email)
            localStorage.setItem(SAVE_ID, user.email)
        }
        doLogin(user)
            .then(data => {
                console.log(data)
                if (data.error) {
                    setFail(true)
                } else {
                    setSuccess(true)
                    setResult(data.username)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
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

    const handleClickReturnMain = () => {
        setLoginStatus(false)
        moveToPath('/')
    }

    const handleChangeRememberMeInput = () => {
        localStorage.setItem(SAVE_ID_FLAG, !saveIdFlag)
        setSaveIdFlag(!saveIdFlag)
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
                                <input id="email"
                                       type="email"
                                       value={user.email}
                                       onChange={handleChangeInput}
                                       onKeyDown={handleKeyDown}
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
                                <input id="password"
                                       type="password"
                                       value={user.password}
                                       onChange={handleChangeInput}
                                       onKeyDown={handleKeyDown}
                                       className="block w-full rounded-sm border bg-white py-2 px-3 text-sm"
                                       name="password" required/>
                            </fieldset>

                            <div className="pt-1 pb-5 text-sm text-gray-darker font-thin">
                                <label>
                                    <input
                                        onChange={handleChangeRememberMeInput}
                                        checked={saveIdFlag}
                                        className="mr-1"
                                        type="checkbox"
                                        name="remember"
                                        id="remember"/>
                                    Remember me
                                </label>
                            </div>


                            <button
                                onClick={handleLogin}
                                type="button"
                                className="block w-full
                          mb-4
                          bg-blue-600
                          text-white
                          rounded-sm py-3 text-sm tracking-wide">
                                Sign in
                            </button>
                            <div
                                className=" w-full flex justify-center items-center"
                            >
                                <Link to={getKakaoLoginLink()}>
                                    <img src="/kakao_login.png"
                                         alt="Kakao Login"
                                    />
                                </Link>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-600 font-thin">
                            Don't have an account yet?
                            <div className="text-blue-500 no-underline hover:underline">
                                <Link to={"/users/join"}>
                                    Sign up
                                </Link>
                            </div>
                        </p>
                    </div>
                </div>
            </div>
            {loginStatus && <ModalComponent
                open={loginStatus}
                title={`잘못된 접근`}
                content={'이미 로그인이 되어있습니다.'}
                handleClose={handleClickReturnMain}
            />}
            {result && <ModalComponent
                open={success}
                title={`안녕하세요 ${result}, 님`}
                content={"로그인 하셨습니다."}
                handleClose={handleClose}
            />}
            {fail && <ModalComponent
                open={fail}
                title={`로그인 실패`}
                content={'아이디와 비밀번호를 다시 확인해주세요'}
                handleClose={handleClose}
            />}
        </>
    );
}

export default LoginComponent;