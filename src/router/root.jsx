import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import {Box, CircularProgress} from "@mui/material";
import boardRouter from "./boardRouter.jsx";
import userRouter from "./userRouter.jsx";
import articleRouter from "./articleRouter.jsx";

const Loading = <Box sx={{ display: 'flex' }}><CircularProgress /></Box>
const MainIndex = lazy(()=>import("../pages/MainIndexPage.jsx"))
const BoardIndex = lazy(()=>import("../pages/board/BoardIndexPage.jsx"))
const ArticleIndex = lazy(()=>import("../pages/article/IndexPage.jsx"))
const UserIndex = lazy(()=>import("../pages/user/UserIndexPage.jsx"))
const Error404Page = lazy(()=>import("../pages/error/Error404.jsx"))
const WifiPage = lazy(()=>import("../pages/wifi/WifiPage.jsx"))
 const root = createBrowserRouter([
   {path:'/',
     element:<Suspense fallback={Loading}><MainIndex/></Suspense>
   },
   {
     path:'/boards',
     element:<Suspense fallback={Loading}><BoardIndex/></Suspense>,
     children:boardRouter()
   },
   {
     path:'/users',
     element:<Suspense fallback={Loading}><UserIndex/></Suspense>,
     children:userRouter()
   },
   {
     path:'/articles',
     element:<Suspense fallback={Loading}><ArticleIndex/></Suspense>,
     children:articleRouter()
   },
   {
     path:'/*',
     element:<Suspense fallback={Loading}><Error404Page/></Suspense>
   },{
    path:'/wifi',
    element:<Suspense fallback={Loading}><WifiPage/></Suspense>
   }
 ])

export default root