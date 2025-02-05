import {Box, CircularProgress} from "@mui/material";
import {lazy, Suspense} from "react";

const Loading = <Box sx={{display: 'flex'}}><CircularProgress/></Box>
const ArticleList = lazy(()=>import("../pages/article/ListPage.jsx"));
const ArticleDetail = lazy(()=>import("../pages/article/DetailPage.jsx"));
const ArticleWrite = lazy(()=>import("../pages/article/WritePage.jsx"));

const articleRouter = () => {
  return [
    {
      path: 'list',
      element: <Suspense fallback={Loading}><ArticleList/></Suspense>,
    },
    {
      path: 'detail',
      element: <Suspense fallback={Loading}><ArticleDetail/></Suspense>,
    },
    {
      path: 'post',
      element:<Suspense fallback={Loading}><ArticleWrite/></Suspense>
    }
  ]
}

export default articleRouter