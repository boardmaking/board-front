import {Box, CircularProgress} from "@mui/material";
import {lazy, Suspense} from "react";

const Loading = <Box sx={{display: 'flex'}}><CircularProgress/></Box>
const ColumnList = lazy(()=>import("../pages/column/ListPage.jsx"));
const ColumnDetail = lazy(()=>import("../pages/column/DetailPage.jsx"));

const columnRouter = () => {
  return [
    {
      path: 'list',
      element: <Suspense fallback={Loading}><ColumnList/></Suspense>,
    },
    {
      path: 'detail',
      element: <Suspense fallback={Loading}><ColumnDetail/></Suspense>,
    }
  ]
}

export default columnRouter