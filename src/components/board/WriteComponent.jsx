import { useMemo, useRef, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { postBoard } from "../../api/boardApi.js";
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";

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
    const [board, setBoard] = useState({
        email: '',
        title: '',
        content: '',
        username: ''
    });
    const boardMutation = useMutation({ mutationFn: (board) => postBoard(board) });

    useEffect(() => {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('user='));

        if (cookieValue) {
            const userInfo = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
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

    const modules = useMemo(() => {
        return {
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

        const updatedBoard = {
            ...board,
            content: values
        };

        boardMutation.mutate(updatedBoard, {
            onSuccess: () => {
                moveToMain();
            },
            onError: (error) => {
                console.error('작성 실패:', error);
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

            <div style={{ height: '500px', border: '1px solid #ccc' }}>
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
                style={{ position: "relative", zIndex: '2' }}
                onClick={handleClickWrite}
            >
                글작성
            </Button>
        </div>
    );
};

export default WriteComponent;
