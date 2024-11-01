import {useMemo, useRef, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Button} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import {postBoard} from "../../api/boardApi.js";

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

const initState = {
    email:'1',
    title:'제목',
    content:''
}

const WriteComponent = () => {
    const [values, setValues] = useState('');
    const quillRef = useRef(null);
    const [board, setBoard] = useState(initState)
    const boardMutation = useMutation({mutationFn:(board)=>postBoard(board)})
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
        console.log(values)
        board.content = values
        setBoard(board)
        console.log(board)
        boardMutation.mutate(board)
    }

    return (
        <>
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
        <Button
            variant="outlined"
            color="primary"
            style={{position:"relative", zIndex:'2'}}
            onClick={handleClickWrite}
        > 글작성</Button>
        </>
    );
};

export default WriteComponent;
