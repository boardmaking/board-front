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
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {postComment, getList} from "../../api/commentApi.js";
import {getBoard} from "../../api/boardApi.js";
import {useParams} from "react-router-dom";

function CommentComponent() {
    const [values, setValues] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const {id: boardId} = useParams();
    const queryClient = useQueryClient();

    const commentMutation = useMutation({
        mutationFn: (comment) => postComment(comment),
        onSuccess: () => {
            alert("작성 성공");
            queryClient.invalidateQueries(['comments', boardId]);
            setValues("");
        },
        onError: (error) => {
            console.error('작성 실패:', error);
        }
    });

    const {data: boardData} = useQuery({
        queryKey: ['board', boardId],
        queryFn: () => getBoard(boardId.toString()),
    });

    const {data: commentList = []} = useQuery({
        queryKey: ['comments', boardId],
        queryFn: () => getList(boardId.toString()),
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
        if (!userInfo) {
            alert("댓글을 작성하려면 로그인이 필요합니다.");
            return;
        }

        if (values.trim() && userInfo) {
            const newCommentData = {
                content: values,
                userId: userInfo.id,
                boardId: boardId.toString(),
            };

            commentMutation.mutate(newCommentData);
        }
    };

    return (
        <Paper elevation={3} sx={{padding: 3}}>
            <h3>댓글 ({commentList.length})</h3>
            <List>
                {commentList.map(({id, username, content, createAt}) => (
                    <Box key={id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar>{username[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={(
                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span>{username}</span>
                                    </Box>
                                )}
                                secondary={content}
                            />
                            <ListItemText secondary={createAt}/>
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
                    placeholder={userInfo ? "댓글을 입력하세요" : "댓글을 작성하려면 로그인이 필요합니다"}
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                    size="small"
                    disabled={!userInfo}
                />
                <Button
                    variant="contained"
                    endIcon={<SendIcon sx={{marginRight: 1}}/>}
                    onClick={handleAddComment}
                    disabled={!userInfo}
                >
                </Button>
            </Box>
        </Paper>
    );
}

export default CommentComponent;