import {Box, CircularProgress} from "@mui/material";
import {lazy, Suspense} from "react";

const Loading = <Box sx={{display: 'flex'}}><CircularProgress/></Box>
const BoardWriter = lazy(() => import("../pages/board/BoardPage.jsx"))
const BoardDetail = lazy(()=> import("../pages/board/BoardDetailPage.jsx"))
const BoardModify = lazy(() => import("../pages/board/BoardModifyPage.jsx"))

const boardRouter = () => {
    return [
        {
            path: 'writer',
            element: <Suspense fallback={Loading}><BoardWriter/></Suspense>
        },
        {
            path: 'read/:id',
            element: <Suspense fallback={Loading}><BoardDetail/></Suspense>
        },
        {
            path: 'modify/:id',
            element: <Suspense fallback={Loading}><BoardModify/></Suspense>
        }
    ]
}

export default boardRouter