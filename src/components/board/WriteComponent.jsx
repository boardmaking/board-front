import { useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
];

const WriteComponent = () => {
  const [values, setValues] = useState('');

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ align: [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
            ['image'],
        ],
      },
    };
  }, []);

  return (
      <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          onChange={setValues}
          value={values}
          style={{height:'500px'}}
      />
  );
};

export default WriteComponent;
