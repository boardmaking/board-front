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
    TextField
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {useEffect, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {postComment} from "../../api/commentApi.js";
import {getBoard} from "../../api/boardApi.js";
import {useParams} from "react-router-dom";

const initialComments = [
    {id: 1, username: "댓글작성자1", content: "첫 번째 댓글입니다.", createAt: '11월 6일'},
];

function CommentComponent() {
    const [comments, setComments] = useState(initialComments);
    const [values, setValues] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const commentMutation = useMutation({mutationFn:(comments)=>postComment(comments)});
    const {id: boardId} = useParams();

    const {data} = useQuery({
        queryKey: ['board', boardId],
        queryFn: () => getBoard(boardId.toString()),
    });

    useEffect(() => {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('user='));

        if (cookieValue) {
            const user = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
            setUserInfo(user);
        }
    }, []);

    const handleAddComment = () => {
        if (values.trim() && userInfo) {
            const newCommentData = {
                id: comments.length + 1,
                username: userInfo.username,
                content: values,
                createAt: comments.createAt
            };
            setComments(prev => [...prev, newCommentData]);
            setValues("");
        }

        const updatedComment = {
            ...comments,
            content: values,
            userId: userInfo.id,
            boardId: boardId.toString()
        };

        commentMutation.mutate(updatedComment, {
            onSuccess: () => {
                alert("작성 성공")
            },
            onError: (error) => {
                console.error('작성 실패:', error);
            }
        })
    };

    return (
        <Paper elevation={3} sx={{padding: 3}}>
            <h3>댓글 ({comments.length})</h3>
            <List>
                {comments.map(({id, username, content, createAt}) => (
                    <Box key={id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar>{username[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span>{username}</span>
                                    </Box>
                                }
                                secondary={content}
                            />
                            <ListItemText>{createAt}</ListItemText>
                        </ListItem>
                        <Divider variant="inset" component="li"/>
                    </Box>
                ))}
            </List>

            <Box sx={{display: 'flex', gap: 1, marginTop: 2}}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="댓글을 입력하세요"
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                    size="small"
                />
                <Button
                    variant="contained"
                    endIcon={<SendIcon sx={{marginRight: 1}}/>}
                    onClick={handleAddComment}
                >
                </Button>
            </Box>
        </Paper>
    );
}

export default CommentComponent;