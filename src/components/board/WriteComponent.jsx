import { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { postBoard, uploadImage } from '../../api/boardApi.js';
import TextFieldComponent from '../common/TextFieldComponent.jsx';
import useCustomMove from '../../hooks/useCustomMove.jsx';
import { toast } from 'react-toastify';
import FileUploadComponent from '../common/FileUploadComponent.jsx';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import ClearIcon from '@mui/icons-material/Clear';
import ModalComponent from '../common/ModalComponent.jsx';
import useCustomLogin from '../../hooks/useCustomLogin.jsx';
import ClassificationComponent from './ClassificationComponent.jsx';
import { base64ToBlob } from '../../util/fileUtil.js';

const formats = [
  'font',
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'align',
  'color',
  'background',
  'size',
  'h1',
  'image',
];

const WriteComponent = () => {
  const { moveToMain } = useCustomMove();
  const [values, setValues] = useState('');
  const quillRef = useRef(null);
  const titleRef = useRef(null);
  const [tempImages, setTempImages] = useState(new Map());
  const [fileError, setFileError] = useState(null);
  const [board, setBoard] = useState({
    email: '',
    title: '',
    content: '',
    username: '',
    files: [],
    savePath: '',
    originalName: '',
    saveName: '',
    classification: 'INFO',
  });
  const [fileStore, setFileStore] = useState([]);
  const [open, setOpen] = useState(false);
  const { isLogin, moveToLoginReturn } = useCustomLogin();

  const boardMutation = useMutation({
    mutationFn: (board) => postBoard(board),
  });

  const validateFile = (file) => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    const ext = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['gif', 'jpg', 'jpeg', 'png', 'bmp'];

    if (file.size > maxSize) {
      toast.error('업로드 가능한 최대 이미지 용량은 20MB 입니다.');
      return false;
    }

    if (!validExtensions.includes(ext)) {
      toast.error('jpg, jpeg, png, bmp, gif 파일만 업로드 가능합니다.');
      return false;
    }

    return true;
  };

  const handleClassificationChange = (event) => {
    setBoard({
      ...board,
      classification: event.target.value,
    });
  };

  const handleEditorChange = (content) => {
    const imgTagRegex = /<img[^>]*>/g;
    const imgTags = content.match(imgTagRegex);

    if (imgTags) {
      imgTags.forEach(async (imgTag) => {
        const base64Data = imgTag.match(/data:image\/([a-zA-Z]*);base64,([A-Za-z0-9+\/=]+)/);
        if (base64Data) {
          const blob = base64ToBlob(base64Data[2], base64Data[1]);
          const uuid = uuidv4()
          const imagePlace = `[${uuid}]`
          const contentWithoutImages = content.replace(imgTagRegex, `[${uuid}]`);
          const formData = new FormData();
          formData.append('image', blob, uuid+'.'+base64Data[1]);
          console.log(contentWithoutImages)
            uploadImage(formData).then(data => {
              console.log(data.savePath)
              content = contentWithoutImages.replace(imagePlace, `<img src="${data.savePath}"  alt=${uuid}/>`);
              console.log(content)
              setValues(content)
            }).catch(err=>{
              console.log(err)
            })
        }
      });
    }else {
    console.log(content)
    setValues(content);
    }
  };

  const imageHandler = () => {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.accept = 'image/*';

    fileInput.click();

    fileInput.addEventListener('change', async function () {
      const file = this.files[0];
      if (!file) return;
      if (!validateFile(file)) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();

        const tempId = `temp-${Date.now()}`;

        quill.insertEmbed(range.index, 'image', base64);

        setTempImages((prev) => new Map(prev.set(tempId, { file, base64 })));
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('user='));

    if (cookieValue) {
      const userInfo = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
      setBoard((prevBoard) => ({
        ...prevBoard,
        email: userInfo.email,
        username: userInfo.username,
      }));
    }

    titleRef.current?.focus();
  }, []);

  const handleTitleChange = (event) => {
    setBoard({
      ...board,
      title: event.target.value,
    });
  };

  const modules = useMemo(
      () => ({
        toolbar: {
          container: [
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ align: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            ['image'],
          ],
          handlers: {
            image: imageHandler,
          },
        },
      }),
      []
  );

  const handleClickWrite = async () => {
    if (!board.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!values.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      // const imageUploadPromises = Array.from(tempImages.values()).map(async ({ file }) => {
      //   const formData = new FormData();
      //   formData.append('uploadImage', file);
      //   // return uploadImage(formData);
      // });

      // const uploadedImages = await Promise.all(imageUploadPromises);

      let finalContent = values;
      /*if (tempImages.size > 0) {
        tempImages.forEach(({base64}) => {
          const imageInfo = uploadedImages.find(
              (img) => img.originalName === [...tempImages.values()]
              .find((temp) => temp.base64 === base64)?.file.name
          );
          if (imageInfo) {
            finalContent = finalContent.replace(base64, imageInfo.savePath);
          }
        });
      }*/
      const TOTAL_FILE_MAX_SIZE = 80 * 1024 * 1024;
      const formData = new FormData();
      let totalFileSize = 0;
      fileStore.forEach((file) => {
        totalFileSize += file.size;
        formData.append('files', file);
      });

      if (totalFileSize > TOTAL_FILE_MAX_SIZE) {
        throw new Error(`파일 크기가 너무 큽니다. 최대 크기: ${TOTAL_FILE_MAX_SIZE / (1024 * 1024)}MB`);
      }

      formData.append('username', board.username);
      formData.append('email', board.email);
      formData.append('title', board.title);
      formData.append('content', finalContent);
      formData.append('classification', board.classification);

      // if (uploadedImages.length > 0) {
      //   const lastImage = uploadedImages[uploadedImages.length - 1];
      //   formData.append('savePath', lastImage.savePath);
      //   formData.append('originalName', lastImage.originalName);
      //   formData.append('saveName', lastImage.saveName);
      // }

      await boardMutation.mutateAsync(formData);
      toast.success('글이 작성되었습니다.');
      moveToMain();
    } catch (error) {
      console.error('작성 실패:', error);
      if (error.response?.data?.ERROR === 'REQUIRED_LOGIN') {
        setOpen(true);
      }
      if (error.response.data.statusCode === 413) {
        toast.error('최대 20MB 까지 업로드 가능합니다.');
      } else {
        toast.error('글 작성에 실패했습니다.');
      }
    }
  };

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
      setBoard({ ...board });
      const files = board.files;
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

  if (!isLogin) {
    return moveToLoginReturn();
  }

  return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <TextFieldComponent
            label="작성자"
            value={board.username}
            InputProps={{ readOnly: true }}
            variant="outlined"
            fullWidth
        />
        <TextField
            ref={titleRef}
            style={{ marginTop: 10 }}
            label="제목"
            value={board.title}
            onChange={handleTitleChange}
            variant="outlined"
            fullWidth
            required
            placeholder="제목을 입력해주세요"
            autoFocus
        />

        <ClassificationComponent
            value={board.classification}
            onChange={handleClassificationChange}
        />

        <div style={{ height: '500px', border: '1px solid #ccc', marginTop: 10 }}>
          <ReactQuill
              ref={quillRef}
              theme="snow"
              modules={modules}
              formats={formats}
              value={values}
              onChange={handleEditorChange}
              style={{ height: '100%' }}
          />
        </div>

        <FileUploadComponent handleChangeUploadFile={handleChangeUploadFile} />

        {fileStore.length > 0
            ? fileStore.map((uploadFile, index) => (
                <ListItem key={index} secondaryAction={<IconButton
                    name={uploadFile.name}
                    onClick={() => handleClickFileClear(index)}
                    edge="end"
                    aria-label="upload">
                  <ClearIcon name={uploadFile.name} />
                </IconButton>}>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={uploadFile.name} />
                </ListItem>
            ))
            : null}

        <Button
            variant="outlined"
            color="primary"
            style={{ position: 'relative', zIndex: '2' }}
            onClick={handleClickWrite}
        >
          글작성
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

export default WriteComponent;
