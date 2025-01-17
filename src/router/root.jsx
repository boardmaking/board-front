import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import {Box, CircularProgress} from "@mui/material";
import boardRouter from "./boardRouter.jsx";
import userRouter from "./userRouter.jsx";
import columnRouter from "./columnRouter.jsx";

const Loading = <Box sx={{ display: 'flex' }}><CircularProgress /></Box>
const MainIndex = lazy(()=>import("../pages/MainIndexPage.jsx"))
const BoardIndex = lazy(()=>import("../pages/board/BoardIndexPage.jsx"))
const ColumnIndex = lazy(()=>import("../pages/column/IndexPage.jsx"))
const UserIndex = lazy(()=>import("../pages/user/UserIndexPage.jsx"))
const Error404Page = lazy(()=>import("../pages/error/Error404.jsx"))
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
     path:'/columns',
     element:<Suspense fallback={Loading}><ColumnIndex/></Suspense>,
     children:columnRouter()
   },
   {
     path:'/*',
     element:<Suspense fallback={Loading}><Error404Page/></Suspense>
   }
 ])

export default root