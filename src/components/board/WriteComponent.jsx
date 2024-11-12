import {useMemo, useRef, useState, useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {Button, TextField} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import {postBoard, uploadImage} from "../../api/boardApi.js";
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {toast} from "react-toastify";
import FileUploadComponent from "../common/FileUploadComponent.jsx";

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

  const {moveToMain} = useCustomMove();
  const [values, setValues] = useState('');
  const quillRef = useRef(null);
  const titleRef = useRef(null);
  const [imageMap, setImageMap] = useState(new Map());
  const [board, setBoard] = useState({
        email: '',
        title: '',
        content: '',
        username: '',
        files: [],
        savePath: '',
        originalName: '',
        saveName: '',
    });

  const boardMutation = useMutation({mutationFn: (board) => postBoard(board)});

  const imageMutation = useMutation({
        mutationFn: uploadImage,
        onSuccess: (data, variables) => {
            const requestBlob = variables.get('request');
            const reader = new FileReader();
            reader.onload = () => {
                const request = JSON.parse(reader.result);
                const imageInfo = {
                    originalName: request.originalName,
                    saveName: request.saveName,
                    savePath: request.savePath
                };

                const quill = quillRef.current.getEditor();
                const contents = quill.getContents();
                contents.ops.forEach((op) => {
                    if (op.insert && op.insert.image && op.insert.image.startsWith('data:')) {
                        setImageMap(prev => new Map(prev.set(op.insert.image, imageInfo)));
                    }
                });
            };
            reader.readAsText(requestBlob);
        },
        onError: (error) => {
            toast.error("이미지 업로드 실패");
            console.error('Image upload error:', error);
        }
    });

    const validateFile = (file) => {
        const fileSize = file.size;
        const maxSize = 20 * 1024 * 1024;
        const ext = file.name.split('.').pop().toLowerCase();

        if (fileSize > maxSize) {
            toast.error("업로드 가능한 최대 이미지 용량은 20MB 입니다.");
            return false;
        }

        if (!['gif', 'jpg', 'jpeg', 'png', 'bmp'].includes(ext)) {
            toast.error("jpg, jpeg, png, bmp, gif 파일만 업로드 가능합니다.");
            return false;
        }

        return true;
    };

  useEffect(() => {
    const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('user='));

    if (cookieValue) {
      const userInfo = JSON.parse(
          decodeURIComponent(cookieValue.split('=')[1]));
      setBoard(prevBoard => ({
        ...prevBoard,
        email: userInfo.email,
        username: userInfo.username
      }));
    }

    titleRef.current?.focus();
  }, []);

  const handleTitleChange = (event) => {
    setBoard({
      ...board,
      title: event.target.value
    });
  };

  const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            if (!validateFile(file)) return;

            const reader = new FileReader();
            reader.onload = () => {
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                const position = range ? range.index : 0;

                quill.insertEmbed(position, 'image', reader.result);
                quill.setSelection(position + 1);

                const formData = new FormData();
                const saveName = `${Date.now()}_${file.name}`;

                formData.append('file', file);
                formData.append('request', new Blob([JSON.stringify({
                    saveName: saveName,
                    originalName: file.name
                })], { type: 'application/json' }));

                imageMutation.mutate(formData);
            };
            reader.readAsDataURL(file);
        };

        input.click();
  }
    const replaceBase64WithImageInfo = (content) => {
        let newContent = content;

        for (const [base64Url, imageInfo] of imageMap.entries()) {
            const imageData = {
                path: imageInfo.savePath
            };

            newContent = newContent.replace(base64Url, JSON.stringify(imageData));
        }

        return newContent;
    };

    const content = replaceBase64WithImageInfo(values);

  const modules = useMemo(() => {
    return {
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
    };
  }, []);

  const handleClickWrite = () => {
    if (!board.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!values.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const formData = new FormData()
    const files = board.files
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }
    formData.append("username", board.username)
    formData.append("email", board.email)
    formData.append("title", board.title)
    formData.append("content", content)

    if (imageMap.size) {
        const imageInfo = [...imageMap.values()][0];
        formData.append("save_path", imageInfo.savePath);
        formData.append("originalName", imageInfo.originalName);
        formData.append("saveName", imageInfo.saveName);
        console.log("save_path"+imageInfo.savePath)

    }

    boardMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("글이 작성되었습니다.");
        moveToMain();
      },
      onError: (error) => {
        console.error('작성 실패:', error);
      }
    });
  }


  const handleChangeUploadFile = (e) => {
    board[e.target.name] = e.target.files
    setBoard({...board})
  }

  return (
      <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
        <TextFieldComponent
            label="작성자"
            value={board.username}
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
            onChange={handleTitleChange}
            variant="outlined"
            fullWidth
            required
            placeholder="제목을 입력해주세요"
            autoFocus
        />

        <div style={{height: '500px', border: '1px solid #ccc'}}>
          <ReactQuill
              ref={quillRef}
              theme="snow"
              modules={modules}
              formats={formats}
              onChange={setValues}
              value={values}
              style={{height: '100%'}}
          />

        </div>
        <FileUploadComponent
            handleChangeUploadFile={handleChangeUploadFile}
        />
        <Button
            variant="outlined"
            color="primary"
            style={{position: "relative", zIndex: '2'}}
            onClick={handleClickWrite}
        >
          글작성
        </Button>
      </div>
  );
};

export default WriteComponent;
