import React, {useRef, useState} from 'react';
import ReactQuill, {Quill} from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import ImageResize from 'quill-image-resize';
Quill.register('modules/ImageResize', ImageResize);

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
  ImageResize: {
    parchment: Quill.import('parchment')
  }
};

const formats = [
  "font",
  "size",
  "header",
  "color",
  "background",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

function WriteComponent2() {
  const [value, setValue] = useState("")
  const quillRef = useRef(null)


  return (
      <>
      <ReactQuill
          style={{height:'400px',overflowY:'auto'}}
          ref={quillRef}
          theme="snow"
          value={value}
          modules={modules}
          format={formats}
          onChange={setValue}
          placeholder="내용을 입력하세요"
        />
        <button
        >
          저장
        </button>
      </>
  );
}

export default WriteComponent2;