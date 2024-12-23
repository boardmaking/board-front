import {Box, CircularProgress} from "@mui/material";
import {lazy, Suspense} from "react";

const Loading = <Box sx={{display: 'flex'}}><CircularProgress/></Box>
const LoginPage = lazy(()=>import("../pages/user/LoginPage.jsx"))
const JoinPage = lazy(()=>import("../pages/user/JoinPage.jsx"))
const NaverLoginPage=lazy(()=>import("../pages/user/oauth/NaverLoginRedirectPage.jsx"))

const userRouter = () => {
return[
  {
    path:'login',
    element:<Suspense fallback={Loading}><LoginPage/></Suspense>
  },
  {
    path: 'join',
    element: <Suspense fallback={Loading}><JoinPage/></Suspense>
  },
  {
    path: 'naver',
    element: <Suspense fallback={Loading}><NaverLoginPage/></Suspense>
  }
]
}
export default userRouter