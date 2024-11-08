import { useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postModify, getBoard } from "../../api/boardApi.js";
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import { toast } from "react-toastify";
import { useParams, useLocation } from 'react-router-dom';
import { getCookie } from "../../util/cookieUtil.jsx";

const formats = [
    'font', 'header', 'bold', 'italic', 'underline', 'strike',
    'blockquote', 'list', 'bullet', 'indent', 'link', 'align',
    'color', 'background', 'size', 'h1', 'image'
];

const ModifyComponent = () => {
    const { id: boardId } = useParams();
    const location = useLocation();
    const { moveToMain } = useCustomMove();
    const quillRef = useRef(null);
    const titleRef = useRef(null);
    const userInfo = getCookie('user');

    const initialData = location.state || {};

    const [board, setBoard] = useState({
        boardId: boardId,
        email: userInfo?.email || '',
        title: initialData.title || '',
        userId: userInfo?.id || '',
    });

    const [values, setValues] = useState(initialData.content || '');

    const { data: boardData } = useQuery({
        queryKey: ['board', boardId],
        queryFn: () => getBoard(boardId),
        onSuccess: (fetchedData) => {
            if (!board.title && !values) {
                setBoard(prev => ({
                    ...prev,
                    title: fetchedData.title,
                }));
                setValues(fetchedData.content);
            }
        },
        onError: (error) => {
            console.error("게시글 조회 실패:", error);
            toast.error("게시글을 불러오는데 실패했습니다.");
            moveToMain();
        }
    });

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

    const handleClickUpdate = () => {
        if (!board.title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!values.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        const modifiedBoard = {
            boardId: board.boardId,
            email: board.email,
            title: board.title,
            content: values,
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
                value={userInfo?.email || ''}
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

            <div style={{ height: '500px', border: '1px solid #ccc', marginTop: 10 }}>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    onChange={setValues}
                    value={values}
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