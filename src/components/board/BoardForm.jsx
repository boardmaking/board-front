import React, {useEffect, useRef, useState} from 'react';
import ReactQuill, {Quill} from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import ImageResize from 'quill-image-resize';
import {Button, List, TextField} from "@mui/material";
import useMutateUploadImage from "../../hooks/queries/useMutateUploadImage.js";
import useMutateCreateBoard from "../../hooks/queries/useMutateCreateBoard.js";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import {formats, modules} from "../../constants/quills.js";
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import FileUploadComponent from "../common/FileUploadComponent.jsx";
import makeContentFrom from "../../util/content.jsx";
import ClassificationComponent from "./ClassificationComponent.jsx";
import {toast} from "react-toastify";
import {numbers} from "../../constants/numbers.js";
import ModalComponent from "../common/ModalComponent.jsx";
import useModal from "../../hooks/useModal.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import useGetBoard from "../../hooks/queries/useGetBoard.js";
import FileListComponent from "../common/FileListComponent.jsx";
import {
  useMutateModifyBoard
} from "../../hooks/queries/useMutateModifyBoard.js";

Quill.register('modules/ImageResize', ImageResize);

function BoardForm({id, isEdit = false}) {
  const [value, setValue] = useState("")
  const [title, setTitle] = useState("")
  const [classification, setClassification] = useState("INFO")
  const [fileStore, setFileStore] = useState([])
  const [uploadedFileStore, setUploadedFileStore] = useState([])

  const createBoard = useMutateCreateBoard();
  const modifyBoard = useMutateModifyBoard()
  const uploadImage = useMutateUploadImage();
  const {data: boardDetail} = useGetBoard(id)
  const isEditMode = isEdit && boardDetail;
  const fileUploadComponentName = isEditMode ? "newFiles" : "files"

  useEffect(() => {
    setValue(boardDetail?.content ?? "")
    setTitle(boardDetail?.title ?? "")
    setUploadedFileStore(boardDetail?.uploadFileNameList ?? [])
    setClassification(boardDetail?.classification ?? "INFO")
  }, [boardDetail, id]);

  const {loginState, isLogin} = useCustomLogin();
  const {isVisible, show, hide} = useModal()
  const {
    moveToList,
    page,
    size,
    searchKeyword,
    searchSort
  } = useCustomMove();

  if (!isLogin) {
    show()
  }

  const quillRef = useRef(null)

  const handleChangeContent = (content) => {
    setValue(content);
  }

  const handleChangeTitle = (event) => {
    const {value} = event.target;
    setTitle(value)
  }

  const handleChangeClassification = (event) => {
    const {value} = event.target;
    setClassification(value)
  }

  const handleChangeFile = (event) => {
    const {files} = event.target;
    const fileList = Array.from(files)
    .filter(file => {
      if (file.size > numbers.FILE_MAX_SIZE) {
        toast.error(
            `${file.name} 파일 크기가 너무 큽니다. 최대 크기: 
            ${numbers.FILE_MAX_SIZE / numbers.MB_SIZE}MB`
        );
        return false;
      } else {
        return true;
      }
    })

    setFileStore(prev => [...prev, ...fileList.map(file => ({file}))]);
  };

  const handleClickFileClear = (clearFileIndex) => {
    const updatedFileStore = fileStore.filter(
        (_, fileIndex) => fileIndex !== clearFileIndex);
    setFileStore(updatedFileStore);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleClickUploadedFileClear = (clearFileIndex) => {
    const updatedSavedFileStore = uploadedFileStore.filter(
        (_, fileIndex) => fileIndex !== clearFileIndex)
    setUploadedFileStore(updatedSavedFileStore)
  }

  const handleClickSave = () => {
    console.log(value)
    const {newContent} = makeContentFrom(uploadImage, value);

    const formData = new FormData();
    formData.append('email', loginState.email);
    formData.append('title', title);
    formData.append('content', newContent);
    formData.append('classification', classification);

    if (fileStore.length > 0) {
      fileStore.forEach((item) => {
        formData.append(fileUploadComponentName, item.file);
      })
    }

    if (isEditMode) {
      formData.append('boardId', boardDetail.boardId);
      formData.append('userId', loginState.id);
      formData.append('username', loginState.username);
      formData.append('files', uploadedFileStore);
      modifyBoard.mutate(formData, {
        onSuccess: () => {
          toast.success('글이 수정되었습니다.');
          moveToList({page, size, searchKeyword, searchSort})
        }
      })
      return;
    }

    createBoard.mutate(formData, {
      onSuccess: ({success}) => {

        if (success) {
          toast.success('글이 작성되었습니다.');
          moveToList({page, size, searchKeyword, searchSort})
        }
      }
    })
  }

  return (
      <>
        <div
            style={styles.container}>
          <TextFieldComponent
              label="작성자"
              value={loginState.username}
              disabled
              variant="outlined"
              fullWidth
          />
          <TextField
              style={{marginTop: 10}}
              label="제목"
              value={title}
              onChange={handleChangeTitle}
              variant="outlined"
              fullWidth
              required
              placeholder="제목을 입력해주세요"
              autoFocus
          />

          <ClassificationComponent
              value={classification}
              onChange={handleChangeClassification}
          />

          <div style={styles.contentContainer}>
            <ReactQuill
                style={{height: '400px', overflowY: 'auto'}}
                ref={quillRef}
                theme="snow"
                value={value}
                modules={modules}
                format={formats}
                onChange={handleChangeContent}
                placeholder="내용을 입력하세요"
            />
          </div>
          {isEditMode && (
              <List>
                {uploadedFileStore.length > 0 &&
                    <FileListComponent fileStore={uploadedFileStore} isUploaded
                                       onClick={handleClickUploadedFileClear}/>

                }
              </List>
          )}
          <FileUploadComponent
              name={fileUploadComponentName}
              handleChangeFile={handleChangeFile}
          />


          {fileStore.length > 0 && <FileListComponent fileStore={fileStore}
                                                      onClick={handleClickFileClear}/>}

          <Button
              variant="outlined"
              color="primary"
              style={{position: 'relative', zIndex: '2'}}
              onClick={handleClickSave}
          >
            글작성
          </Button>
          <Button
              variant="outlined"
              color="primary"
              style={{position: "relative", zIndex: '2', marginTop: 10}}
              onClick={() => moveToList(
                  {page, size, searchKeyword, searchSort})}
          >
            취소
          </Button>
          <ModalComponent
              title="회원 전용 기능"
              content="회원이 아니어서 글을 작성할 수 없습니다. 로그인 해주세요:)"
              // handleClose={handleClickClose}
              open={isVisible}
          />
        </div>
      </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
  },
  contentContainer: {
    height: '500px',
    border: '1px solid #ccc',
    marginTop: 10
  }
}

export default BoardForm;