import {
    Avatar,
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    TextField,
} from "@mui/material";
import {useLocation, useParams} from "react-router-dom";
import {useState} from "react";
import SendIcon from '@mui/icons-material/Send';
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {useQuery} from "@tanstack/react-query";
import {getBoard, getList} from "../../api/boardApi.js";

const initialComments = [
    { id: 1, username: "댓글작성자1", content: "첫 번째 댓글입니다.", date: "2024-11-01 13:50" },
    { id: 2, username: "댓글작성자2", content: "두 번째 댓글입니다.", date: "2024-11-01 14:20" }
];

const BoardDetailComponent = () => {
    const location = useLocation();
    const {moveToMain} = useCustomMove();
    const { title = "제목이 없습니다.", content = "내용이 없습니다.", username = "정보 없음", date = "정보 없음" } = location.state || {};
    const boardId = useParams()

    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const {data} = useQuery({
        queryKey:[{'boardId': boardId}],
        queryFn:()=>getBoard(boardId.id),
    });

    console.log(data)

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newCommentData = {
                id: comments.length + 1,
                username: "현재 사용자",
                content: newComment,
                date: new Date().toLocaleString()
            };
            setComments(prev => [...prev, newCommentData]);
            setNewComment("");
        }
    };

    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                <h2>{title}</h2>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', marginBottom: 2 }}>
                    <span>작성자: {username}</span>
                    <span>작성일: {date}</span>
                </Box>
                <Divider sx={{ margin: '20px 0' }} />
                <p>{content}</p>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 3 }}>
                    <Button onClick={moveToMain} variant="outlined" color="primary">목록</Button>
                    <Button variant="outlined" color="primary">수정</Button>
                    <Button variant="outlined" color="error">삭제</Button>
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ padding: 3 }}>
                <h3>댓글 ({comments.length})</h3>
                <List>
                    {comments.map(({ id, username, content, date }) => (
                        <Box key={id}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar>{username[0]}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{username}</span>
                                            <span style={{ color: '#666' }}>{date}</span>
                                        </Box>
                                    }
                                    secondary={content}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </Box>
                    ))}
                </List>

                <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="댓글을 입력하세요"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        size="small"
                    />
                    <Button variant="contained" endIcon={<SendIcon />} onClick={handleAddComment}>
                        보내기
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default BoardDetailComponent;
