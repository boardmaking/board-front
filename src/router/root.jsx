import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import {Box, CircularProgress} from "@mui/material";
import boardRouter from "./boardRouter.jsx";

const Loading = <Box sx={{ display: 'flex' }}><CircularProgress /></Box>
const MainIndex = lazy(()=>import("../pages/MainIndexPage.jsx"))
const BoardIndex = lazy(()=>import("../pages/board/BoardIndexPage.jsx"))
 const root = createBrowserRouter([
   {path:'/',
     element:<Suspense fallback={Loading}><MainIndex/></Suspense>
   },
   {
     path:'/board',
     element:<Suspense fallback={Loading}><BoardIndex/></Suspense>,
     children:boardRouter()
   }
 ])

export default root