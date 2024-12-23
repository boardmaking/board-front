import {useEffect, useState} from "react";
import useCustomLogin from "../../../hooks/useCustomLogin.jsx";
import {useSearchParams} from "react-router-dom";
import ModalComponent from "../../../components/common/ModalComponent.jsx";
import {getKakaoAccessToken} from "../../../api/kakaoApi.js";

function NaverLoginRedirectPage() {
  const [fail, setFail] = useState(false)
  const [success, setSuccess] = useState(false)
  const [result, setResult] = useState(null)

  const [searchParams] = useSearchParams()

  const authCode = searchParams.get('code')

  const {doLogin,moveToPath} = useCustomLogin()

  useEffect(() => {
    getKakaoAccessToken(authCode).then(response => {
      doLogin({
        email:response.email
        ,password: response.name
      }).then(data=>{
        if (data.error) {
          setFail(true)
        } else {
          setSuccess(true)
          setResult(data.username)
        }
      })
    })
  }, [authCode]);

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
        <div>Kakao Login</div>
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
      </div>
  );
}

export default NaverLoginRedirectPage;