import {Box, CircularProgress} from "@mui/material";
import {lazy, Suspense} from "react";

const Loading = <Box sx={{display: 'flex'}}><CircularProgress/></Box>
const BoardWriter = lazy(()=>import("../pages/board/BoardPage.jsx"))
const boardRouter = () => {
  return [
    {
      path:'writer',
      element:<Suspense fallback={Loading}><BoardWriter/></Suspense>
    }
  ]
}

export default boardRouter