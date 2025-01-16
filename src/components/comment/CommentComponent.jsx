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
import {deleteComment, getList, postComment} from "../../api/commentApi.js";
import {getBoard} from "../../api/boardApi.js";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import DateUtil from "../../util/dateUtil.js";

function CommentComponent() {
  const [values, setValues] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const {id: boardId} = useParams();
  const queryClient = useQueryClient();
  const {loginState} = useCustomLogin()
  const loginUserId = loginState.id
  const [refresh, setRefresh] = useState(false)
  const deleteParam =
      {
        userId: loginUserId,
        commentId: ""
      }

  const commentMutation = useMutation({
    mutationFn: (comment) => postComment(comment),
    onSuccess: () => {
      toast.info(`"${boardData.title}" 글에 댓글을 달았습니다.`)
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

  const {data: commentList = [],isError,error} = useQuery({
    queryKey: ['comments', boardId, refresh],
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

  const handleClickDeleteComment = (commentId) => {
    deleteParam.commentId = commentId
    deleteComment(deleteParam).then(data => {
      if (data.success){
        setRefresh(!refresh)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  const handleChangeInput = (e) => {
    const { value } = e.target;
    setValues(value)
  }

  return (
      <Paper elevation={3} sx={{padding: 3}}>
        <h3>댓글 ({commentList.length})</h3>
        <List>
          {commentList.length > 0 && commentList.map(({id, userId, username, content, createAt}) => (
              <Box key={id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{username[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                      primary={(
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <span>{username}</span>
                          </Box>
                      )}
                      secondary={DateUtil.formatDateFrom(createAt)}
                  />
                  <ListItemText secondary={content}/>
                  {userId === loginUserId ?

                      <IconButton
                          onClick={() => handleClickDeleteComment(id)}
                          name={'deleteBtn'}
                          edge="end"
                          aria-label="download">
                        <DeleteIcon
                            name={'deleteBtnIcon'}
                        />
                      </IconButton> : <></>
                  }
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
              onChange={handleChangeInput}
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