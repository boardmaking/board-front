import {useEffect, useMemo, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {Button, TextField,} from '@mui/material';
import {useMutation} from '@tanstack/react-query';
import {uploadImage} from '@/api/boardApi.js';
import TextFieldComponent from '@/common/TextFieldComponent.jsx';
import {toast} from 'react-toastify';
import ModalComponent from '@/common/ModalComponent.jsx';
import useCustomLogin from '@/hooks/useCustomLogin.jsx';
import {base64ToBlob} from '@/util/fileUtil.js';
import CategoryComponent from "./CategoryComponent.jsx";
import {postArticle} from "@/api/articleApi.js";
import useCustomMove from "@/hooks/useCustomMove.jsx";
import {SERVER_HOST} from "../../constants/index.js";

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
  const {
    moveToList,
    page,
    size,
    searchKeyword,
    searchSort
  } = useCustomMove();
  const [values, setValues] = useState('');
  const quillRef = useRef(null);
  const titleRef = useRef(null);
  const [tempImages, setTempImages] = useState(new Map());
  const [fileError, setFileError] = useState(null);
  const {isLogin, moveToLoginReturn,loginState} = useCustomLogin()
  const [article, setArticle] = useState({
    email: '',
    title: '',
    content: '',
    category: 'FOOD',
  });
  const [open, setOpen] = useState(false);

  if (!isLogin) {
    return moveToLoginReturn()
  }

  const mutation = useMutation({
    mutationFn: (article) => postArticle(article),
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
    setArticle({
      ...article,
      category: event.target.value,
    });
  };

  const handleEditorChange = async (content) => {
    const imgTagRegex = /<img[^>]*>/g;
    let updatedContent = content;
    const imgTags = content.match(imgTagRegex);
    if (imgTags) {
      const imageUploadPromises = imgTags.map((imgTag) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          const base64Data = imgTag.match(
              /data:image\/([a-zA-Z]*);base64,([A-Za-z0-9+\/=]+)/);
          if (base64Data) {
            const blob = base64ToBlob(base64Data[2], base64Data[1]);
            const uuid = uuidv4()
            const imagePlace = `[${uuid}]`;
            const contentWithoutImages = updatedContent.replace(imgTag,
                imagePlace);
            const formData = new FormData();
            formData.append('image', blob, uuid + '.' + base64Data[1]);

            try {
              const data = await uploadImage(formData);
              updatedContent = contentWithoutImages.replace(imagePlace,
                  `<img src="${SERVER_HOST}:28080/boards/files/${data}?fileType=IMAGE" alt="${uuid}" />`);
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
      setValues(updatedContent);
    } else {
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
      if (!file) {
        return;
      }
      if (!validateFile(file)) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();

        const tempId = `temp-${Date.now()}`;

        quill.insertEmbed(range.index, 'image', base64);

        setTempImages((prev) => new Map(prev.set(tempId, {file, base64})));
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('user='));

    if (cookieValue) {
      const userInfo = JSON.parse(
          decodeURIComponent(cookieValue.split('=')[1]));
      setArticle((prevBoard) => ({
        ...prevBoard,
        email: userInfo.email,
      }));
    }

    titleRef.current?.focus();
  }, []);

  const handleTitleChange = (event) => {
    setArticle({
      ...article,
      title: event.target.value,
    });
  };

  const modules = useMemo(
      () => ({
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
      }),
      []
  );

  const handleClickWrite = async () => {
    if (!article.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!values.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {

      let finalContent = values;

      const TOTAL_FILE_MAX_SIZE = 80 * 1024 * 1024;
      const formData = new FormData();
      let totalFileSize = 0;


      if (totalFileSize > TOTAL_FILE_MAX_SIZE) {
        throw new Error(
            `파일 크기가 너무 큽니다. 최대 크기: ${TOTAL_FILE_MAX_SIZE / (1024 * 1024)}MB`);
      }

      console.log(finalContent)
      formData.append('email', article.email);
      formData.append('title', article.title);
      formData.append('content', finalContent);
      formData.append('category', article.category);
      await mutation.mutateAsync(formData);
      toast.success('글이 작성되었습니다.');
      moveToList({
        page, size,  category:"FOOD"
      })
    } catch (error) {
      console.error('작성 실패:', error.message);
      if (error.response?.data?.ERROR === 'REQUIRED_LOGIN') {
        setOpen(true);
      }
      if (error.response?.data?.statusCode === 413) {
        toast.error('최대 20MB 까지 업로드 가능합니다.');
      } else {
        toast.error('글 작성에 실패했습니다.');
      }
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
      <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
        <TextFieldComponent
            label="작성자"
            value={loginState.username}
            InputProps={{readOnly: true}}
            variant="outlined"
            fullWidth
        />
        <TextField
            ref={titleRef}
            style={{marginTop: 10}}
            label="제목"
            value={article.title}
            onChange={handleTitleChange}
            variant="outlined"
            fullWidth
            required
            placeholder="제목을 입력해주세요"
            autoFocus
        />

        <CategoryComponent
            value={article.category}
            onChange={handleClassificationChange}
        />

        <div style={{height: '500px', border: '1px solid #ccc', marginTop: 10}}>
          <ReactQuill
              ref={quillRef}
              theme="snow"
              modules={modules}
              formats={formats}
              value={values}
              onChange={handleEditorChange}
              style={{height: '100%'}}
          />
        </div>



        <Button
            variant="outlined"
            color="primary"
            style={{position: 'relative', zIndex: '2'}}
            onClick={handleClickWrite}
        >
          글작성
        </Button>
        <Button
            variant="outlined"
            color="primary"
            style={{position: "relative", zIndex: '2', marginTop: 10}}
            onClick={() => moveToList({page, size, searchKeyword, searchSort})}
        >
          취소
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