import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import {Box, CircularProgress} from "@mui/material";

const Loading = <Box sx={{ display: 'flex' }}><CircularProgress /></Box>
const MainIndex = lazy(()=>import("../pages/MainIndexPage.jsx"))
 const root = createBrowserRouter([
   {path:'/',
     element:<Suspense fallback={Loading}><MainIndex/></Suspense>
   }
 ])

export default root