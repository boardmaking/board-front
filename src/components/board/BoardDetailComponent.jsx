import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper
} from "@mui/material";
import {useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getBoard, postDeleteBoard, postDownload} from "../../api/boardApi.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {toast} from "react-toastify";
import {styled} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ModalComponent from "../common/ModalComponent.jsx";
import PauseIcon from '@mui/icons-material/Pause';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import DateUtil from "../../util/dateUtil.js";
import CommentComponent from "../comment/CommentComponent.jsx";

const initState = {
  userId: 0,
  boardId: 0,
  username: "",
  title: "",
  content: "",
  createdAt: "",
  classifiaction: "",
  originalFileNameList: [],
  uploadedFileNameList: [],
}

const BoardDetailComponent = () => {

  const Demo = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  const {
    moveToList,
    moveToModify,
    page,
    size,
    searchSort,
    searchKeyword
  } = useCustomMove();
  const {id: boardId} = useParams();
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState({})
  const [hasDownloaded, setHasDownloaded] = useState({})
  const {isLogin, moveToLoginReturn,loginState} = useCustomLogin()

  if (!isLogin) {
    return moveToLoginReturn()
  }

  const loginUserId = loginState.id
  console.log("loginUserId", loginUserId)

  const boardMutation = useMutation({
    mutationFn: postDeleteBoard,
    onSuccess: () => {
      toast.success("삭제되었습니다.");
      moveToList({page: 0});
    },
    onError: () => {
      toast.error("본인만 삭제할 수 있습니다.");
    }
  });

  const {data, isSuccess} = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoard(boardId),
  });

  const board = data || initState

  console.log(data)

  const handleClickDelete = () => {
    if (!loginState) {
      toast.error("로그인 후 삭제할 수 있습니다.");
      return;
    }
    boardMutation.mutate({
      userId: loginState.id,
      boardId: boardId
    });
  };

  const handleClickUpdate = () => {
    if (!loginState) {
      toast.error("로그인 후 수정할 수 있습니다.");
      return;
    }
    if (loginState.username === board.username) {
      moveToModify(boardId);
    } else {
      toast.error("본인만 수정할 수 있습니다.");
    }
  };

  const handleClickDownload = (uploadFileName, index) => {
    if (isSuccess) {
      const fileName = uploadFileName
      const params = {fileType: "FILE", fileName}
      setIsLoading(prev => ({...prev, [index]: true}))
      postDownload(params).then(data => {
        const url = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = url

        link.setAttribute('download', fileName.substring(37))
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setIsLoading(prev => ({...prev, [index]: false}))
        setHasDownloaded(prev => ({...prev, [index]: true}))
      })
      .catch(err => {
        if (err.response.data.ERROR === "REQUIRED_LOGIN") {
          setOpen(true)
          setIsLoading(false)
          setHasDownloaded(false)
        }

      })
    }
  }

  const handleClickClose = () => {
    setOpen(false)
  }

  return (
      <Box sx={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
        <Paper elevation={3} sx={{padding: 3, marginBottom: 3}}>
          <h2>{board.title}</h2>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'text.secondary',
            marginBottom: 2
          }}>
            <span>작성자: {board.username}</span>
            <span>작성일: {DateUtil.formatDateFrom(board.createdAt)}</span>
          </Box>
          <Divider sx={{margin: '20px 0'}}/>
          <Box
              sx={{
                minHeight: '200px',
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '1em auto',
                  objectFit: 'contain',
                  maxHeight: '600px'
                },
                '& p': {
                  margin: '1em 0',
                  wordWrap: 'break-word'
                },
                '& ul, & ol': {
                  marginLeft: '2em'
                },
                '& blockquote': {
                  borderLeft: '4px solid #ddd',
                  marginLeft: 0,
                  paddingLeft: '1em'
                }
              }}
              dangerouslySetInnerHTML={{__html: board.content}}
          />
          {isSuccess && data.uploadFileNameList.length !== 0 ?
              <Demo>
                <List>
                  {board.uploadFileNameList.map((uploadFileName, index) => (
                      <ListItem key={index}
                                secondaryAction={
                                  <IconButton
                                      disabled={isLoading[index]
                                          || hasDownloaded[index]}
                                      onClick={() => handleClickDownload(
                                          uploadFileName, index)}
                                      name={uploadFileName}
                                      edge="end"
                                      aria-label="download">
                                    {isLoading[index] ?
                                        <PauseIcon/>
                                        : hasDownloaded[index] ?
                                            <CheckCircleIcon/>
                                            :
                                            <FileDownloadIcon
                                                name={uploadFileName}
                                            />
                                    }
                                  </IconButton>
                                }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon/>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={uploadFileName.substring(37)}
                        />
                      </ListItem>)
                  )}
                </List>
              </Demo> : <></>
          }
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            marginTop: 3
          }}>
            <Button onClick={() => moveToList(
                {page, size, searchKeyword, searchSort})} variant="outlined"
                    color="primary">
              목록
            </Button>
            {loginUserId === board.userId &&
              <>
                <Button onClick={handleClickUpdate} variant="outlined"
                        color="primary">
                  수정
                </Button>
                <Button onClick={handleClickDelete} variant="outlined"
                        color="error">
                  삭제
                </Button>
              </>
            }
          </Box>
        </Paper>
        <CommentComponent/>
        <ModalComponent
            title={"회원 전용 기능"}
            content={"회원이 아니어서 파일을 다운로드할 수 없습니다. 로그인 해주세요:)"}
            handleClose={handleClickClose}
            open={open}
        />
      </Box>
  );
};

export default BoardDetailComponent;