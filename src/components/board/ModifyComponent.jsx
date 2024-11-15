import { useMemo, useRef, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postModify, getBoard } from "../../api/boardApi.js";
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';
import { getCookie } from "../../util/cookieUtil.jsx";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import ClassificationComponent from "./ClassificationComponent.jsx";
import ModalComponent from "../common/ModalComponent.jsx";

const formats = [
    'font', 'header', 'bold', 'italic', 'underline', 'strike',
    'blockquote', 'list', 'bullet', 'indent', 'link', 'align',
    'color', 'background', 'size', 'h1', 'image'
];

const ModifyComponent = () => {
    const { id: boardId } = useParams();
    const { moveToMain } = useCustomMove();
    const { isLogin, moveToLoginReturn } = useCustomLogin();
    const quillRef = useRef(null);
    const titleRef = useRef(null);
    const [imageMap, setImageMap] = useState(new Map());
    const userInfo = getCookie('user');

    const [board, setBoard] = useState({
        boardId: boardId,
        email: userInfo?.email || '',
        title: '',
        userId: userInfo?.id || '',
        username: userInfo?.username || '',
        classification: 'INFO',
    });

    const [values, setValues] = useState('');

    const { data: boardData } = useQuery({
        queryKey: ['board', boardId],
        queryFn: () => getBoard(boardId),
        onError: (error) => {
            console.error("게시글 조회 실패:", error);
            toast.error("게시글을 불러오는데 실패했습니다.");
            moveToMain();
        }
    });

    useEffect(() => {
        if (boardData && !board.title) {
            setBoard(prev => ({
                ...prev,
                title: boardData.title,
                classification: boardData.classification || 'INFO',
            }));
            setValues(boardData.content);
        }
    }, [boardData]);

    const handleClassificationChange = (event) => {
        setBoard(prev => ({
            ...prev,
            classification: event.target.value
        }));
    };

    const boardMutation = useMutation({
        mutationFn: (board) => postModify(board)
    });

    const handleTitleChange = (event) => {
        setBoard(prev => ({
            ...prev,
            title: event.target.value
        }));
    };

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

    const modules = useMemo(() => ({
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
    }), []);

    const handleClickUpdate = async () => {
        if (!board.title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!values.trim()) {
            alert('내용을 입력해주세요.');
            return;
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

        const modifiedBoard = {
            boardId: board.boardId,
            username: board.username,
            email: board.email,
            title: board.title,
            content: replaceBase64WithImageInfo(values),
            classification: board.classification,
            userId: board.userId
        };

        boardMutation.mutate(modifiedBoard, {
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
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
                    onChange={setValues}
                    style={{ height: '100%' }}
                />
            </div>
            <Button
                variant="outlined"
                color="primary"
                style={{ position: "relative", zIndex: '2', marginTop: 20 }}
                onClick={handleClickUpdate}
            >
                수정하기
            </Button>
        </div>
    );
};

export default ModifyComponent;