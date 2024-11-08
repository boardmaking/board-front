import { Box, Button, Divider, Paper } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBoard, postDeleteBoard } from "../../api/boardApi.js";
import { getCookie } from "../../util/cookieUtil.jsx";
import CommentComponent from "../comment/CommentComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import { toast } from "react-toastify";

const BoardDetailComponent = () => {
    const location = useLocation();
    const { moveToMain, moveToModify } = useCustomMove();
    const { title = "제목이 없습니다.", content = "내용이 없습니다.", username = "정보 없음", createAt = "정보 없음" } = location.state || {};
    const { id: boardId } = useParams();

    const userInfo = getCookie('user');

    const boardMutation = useMutation({
        mutationFn: postDeleteBoard,
        onSuccess: () => {
            toast.success("삭제되었습니다.");
            moveToMain();
        },
        onError: () => {
            toast.error("본인만 삭제할 수 있습니다.");
        }
    });

    const { data } = useQuery({
        queryKey: ['board', boardId],
        queryFn: () => getBoard(boardId),
    });

    const handleClickDelete = () => {
        if (!userInfo) {
            toast.error("로그인 후 삭제할 수 있습니다.");
            return;
        }
        boardMutation.mutate({
            userId: userInfo.id,
            boardId: boardId
        });
    };

    const handleClickUpdate = () => {
        if (!userInfo) {
            toast.error("로그인 후 수정할 수 있습니다.");
            return;
        }
        if (userInfo.username === username) {
            moveToModify(boardId);
        } else {
            toast.error("본인만 수정할 수 있습니다.");
        }
    };

    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                <h2>{title}</h2>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', marginBottom: 2 }}>
                    <span>작성자: {username}</span>
                    <span>작성일: {createAt}</span>
                </Box>
                <Divider sx={{ margin: '20px 0' }} />
                <div
                    style={{
                        minHeight: '200px',
                        '& img': { maxWidth: '100%', height: 'auto' },
                        '& p': { margin: '1em 0' },
                        '& ul, & ol': { marginLeft: '2em' },
                        '& blockquote': {
                            borderLeft: '4px solid #ddd',
                            marginLeft: 0,
                            paddingLeft: '1em'
                        }
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 3 }}>
                    <Button onClick={moveToMain} variant="outlined" color="primary">목록</Button>
                    <Button onClick={handleClickUpdate} variant="outlined" color="primary">수정</Button>
                    <Button onClick={handleClickDelete} variant="outlined" color="error">삭제</Button>
                </Box>
            </Paper>
            <CommentComponent />
        </Box>
    );
};

export default BoardDetailComponent;
