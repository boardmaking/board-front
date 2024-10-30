import {createBrowserRouter} from "react-router-dom";
import {Suspense} from "react";
import {Box, CircularProgress} from "@mui/material";

const Loading = <Box sx={{ display: 'flex' }}><CircularProgress /></Box>

 const root = createBrowserRouter([
   {path:'/',
     element:<Suspense fallback={Loading}></Suspense>
   }
 ])

export default root