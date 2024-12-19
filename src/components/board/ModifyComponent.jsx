import {useEffect, useMemo, useRef, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField
} from "@mui/material";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getBoard, postModify, uploadImage} from "../../api/boardApi.js";
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {toast} from "react-toastify";
import {useParams} from 'react-router-dom';
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import ClassificationComponent from "./ClassificationComponent.jsx";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import {styled} from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import FileUploadComponent from "../common/FileUploadComponent.jsx";
import ModalComponent from "../common/ModalComponent.jsx";
import {base64ToBlob} from "../../util/fileUtil.js";
import {v4 as uuidv4} from "uuid";

const formats = [
  'font', 'header', 'bold', 'italic', 'underline', 'strike',
  'blockquote', 'list', 'bullet', 'indent', 'link', 'align',
  'color', 'background', 'size', 'h1', 'image'
];

/*const initState = {
  username: '',
  boardId: '',
  title: '',
  content: '',
  classification: '',
  createAt: '',
  files: [],
  newFiles: []
}*/
const initState = {
  username: '',
  boardId: '',
  title: '',
  content: '',
  uploadFileNameList: [],
  originalFileNameList: [],
  createdAt: '',
  classification: '',
  files: [],
  newFiles:[]
}

const ModifyComponent = () => {
  const {id: boardId} = useParams();
  const {moveToMain} = useCustomMove();
  const quillRef = useRef(null);
  const titleRef = useRef(null);
  const [savedFileStore, setSavedFileStore] = useState([])
  const [fileStore, setFileStore] = useState([])
  const [fileError, setFileError] = useState(null);
  const [open, setOpen] = useState(false)
  const [board, setBoard] = useState(initState);
  const {loginState, isLogin, moveToLoginReturn} = useCustomLogin()
  const userEmail = loginState.email
  const userId = loginState.id

  const {data: boardData, isSuccess} = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoard(boardId),
    onError: (error) => {
      console.error("게시글 조회 실패:", error);
      toast.error("게시글을 불러오는데 실패했습니다.");
      moveToMain();
    }
  });

  useEffect(() => {
    if (isSuccess) {
      board['username'] = boardData.username
      board['boardId'] = boardData.boardId
      board['title'] = boardData.title
      board['content'] = boardData.content
      board['classification'] = boardData.classification
      board['originalFileNameList'] = boardData.originalFileNameList
      board['uploadFileNameList'] = boardData.uploadFileNameList
      setBoard(boardData)
      setSavedFileStore(boardData.uploadFileNameList)
    }
  }, [boardId,boardData]);


  const boardMutation = useMutation({
    mutationFn: (board) => postModify(board)
  });

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          const index = range ? range.index : quill.getLength();

          quill.insertEmbed(index, 'image', reader.result);
          quill.setSelection(index + 1);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const handleChange = (e) => {
    board[e.target.name] = e.target.value
    setBoard({...board})
  }

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{size: ['small', false, 'large', 'huge']}],
        [{align: []}],
        ['bold', 'italic', 'underline', 'strike'],
        [{list: 'ordered'}, {list: 'bullet'}],
        [{color: []}, {background: []}],
        ['image'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  if (!isLogin) {
    return moveToLoginReturn()
  }

  const handleClickUpdate = async () => {
    if (!board.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!board.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const replaceBase64WithImageInfo = async (content) => {
      const imgTagRegex = /<img[^>]*>/g;
      let newContent = content;
      const imgTags = content.match(imgTagRegex);

      if (imgTags) {
        const imageUploadPromises = imgTags.map((imgTag) => {
          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (resolve, reject) => {
            const base64Data = imgTag.match(
                /data:image\/([a-zA-Z]*);base64,([A-Za-z0-9+\/=]+)/);
            if (base64Data) {
              const blob = base64ToBlob(base64Data[2], base64Data[1]);
              const uuid = uuidv4();
              const imagePlace = `[${uuid}]`;
              const contentWithoutImages = newContent.replace(imgTag,
                  imagePlace);
              const formData = new FormData();
              formData.append('image', blob, uuid + '.' + base64Data[1]);

              try {
                const data = await uploadImage(formData);
                newContent = contentWithoutImages.replace(imagePlace,
                    `<img src="${data.savePath}" alt="${uuid}" />`);
                resolve();
              } catch (err) {
                reject(err);
              }
            } else {
              resolve();
            }
          });
        });

        await Promise.all(imageUploadPromises);
        board['content'] = newContent
        setBoard(board)
      } else {
        board['content'] = newContent
        setBoard(board)
      }
    };

    await replaceBase64WithImageInfo(board.content)
    const TOTAL_FILE_MAX_SIZE = 80 * 1024 * 1024;
    const formData = new FormData();
    let totalFileSize = 0;
    fileStore.forEach((file) => {
      totalFileSize += file.size;
      formData.append('newFiles', file);
    });

    if (totalFileSize > TOTAL_FILE_MAX_SIZE) {
      throw new Error(
          `파일 크기가 너무 큽니다. 최대 크기: ${TOTAL_FILE_MAX_SIZE / (1024 * 1024)}MB`);
    }

    board.files = savedFileStore
    formData.append('boardId', board.boardId)
    formData.append('email', userEmail)
    formData.append('title', board.title)
    formData.append('content', board.content)
    formData.append('userId', userId)
    formData.append('username', board.username)
    formData.append('classification', board.classification)
    formData.append('files', board.files)
    boardMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("글이 수정되었습니다.");
        moveToMain();
      },
      onError: (error) => {
        console.error('수정 실패:', error);
        toast.error("글 수정에 실패했습니다.");
      }
    });
  }

  const Demo = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  const handleClickSavedFileClear = (index) => {
    const updatedSavedFileStore = savedFileStore.filter((_, i) => i !== index)
    setSavedFileStore(updatedSavedFileStore)
  }

  const handleClickFileClear = (index) => {
    const updatedFileStore = fileStore.filter((_, i) => i !== index);
    setFileStore(updatedFileStore);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleChangeUploadFile = (e) => {
    const FILE_MAX_SIZE = 20 * 1024 * 1024;
    try {
      board[e.target.name] = e.target.files;
      // setBoard({...board});
      const files = board.newFiles;
      const fileList = Array.from(files);
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].size > FILE_MAX_SIZE) {
          throw new Error(
              `파일 크기가 너무 큽니다. 최대 크기: ${FILE_MAX_SIZE / (1024 * 1024)}MB`
          );
        }
      }
      setFileStore((fileStore) => [...fileStore, ...Array.from(files)]);
    } catch (err) {
      setFileError(err.message);
      setOpen(true);
    }
  };

  const handleClickClose = () => {
    setOpen(false);
    setFileError(null);
  };

  const handleChangeContent = (content) => {
    board['content'] = content
    setBoard(board)
  }

  return (
      <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
        <TextFieldComponent
            label="작성자"
            value={board.username}
            name={'writer'}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            fullWidth
        />

        <TextField
            ref={titleRef}
            style={{marginTop: 10}}
            label="제목"
            value={board.title}
            name={'title'}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            placeholder="제목을 입력해주세요"
            autoFocus
        >{board.title}</TextField>

        <ClassificationComponent
            value={board.classification}
            onChange={handleChange}
        />

        <div style={{height: '500px', border: '1px solid #ccc', marginTop: 10}}>
          <ReactQuill
              ref={quillRef}
              theme="snow"
              modules={modules}
              formats={formats}
              name={'content'}
              value={board.content}
              onChange={handleChangeContent}
              style={{height: '100%'}}
          />
        </div>

        <Demo>
          <List>
            {savedFileStore.length > 0 ? savedFileStore.map(
                (uploadFile, index) => (
                    <ListItem key={index}
                              secondaryAction={
                                <IconButton
                                    onClick={() => handleClickSavedFileClear(
                                        index)}
                                    name={uploadFile}
                                    edge="end"
                                    aria-label="download">
                                  <ClearIcon
                                      name={uploadFile}
                                  />
                                </IconButton>
                              }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <FolderIcon/>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                          primary={uploadFile.substring(37)}
                      />
                    </ListItem>)
            ) : <></>
            }
          </List>

        </Demo>
        <FileUploadComponent
            name={"newFiles"}
            handleChangeUploadFile={handleChangeUploadFile}/>

        {fileStore.length > 0
            ? fileStore.map((uploadFile, index) => (
                <ListItem key={index} secondaryAction={<IconButton
                    name={uploadFile.name}
                    onClick={() => handleClickFileClear(index)}
                    edge="end"
                    aria-label="upload">
                  <ClearIcon name={uploadFile.name}/>
                </IconButton>}>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon/>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={uploadFile.name}/>
                </ListItem>
            ))
            : null}
        <Button
            variant="outlined"
            color="primary"
            style={{position: "relative", zIndex: '2', marginTop: 20}}
            onClick={handleClickUpdate}
        >
          수정하기
        </Button>
        <ModalComponent
            title="회원 전용 기능"
            content="회원이 아니어서 글을 작성할 수 없습니다. 로그인 해주세요:)"
            handleClose={handleClickClose}
            open={open}
        />

        {fileError ? (
            <ModalComponent
                title="파일 에러"
                content={fileError}
                handleClose={handleClickClose}
                open={open}
            />
        ) : null}
      </div>
  );
};

export default ModifyComponent;