import {Button} from "@mui/material";
import {styled} from "@mui/material/styles";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useEffect, useRef} from "react";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export default function FileUploadComponent({handleChangeFile,name="files"}) {

  const fileInputRef = useRef(null)

  const handleClearInput = () => {
    if (fileInputRef.current) {
      console.log('파일테스트')
      fileInputRef.current.value = ''; // 파일 입력 리셋
    }
  }

  return (
      <>
      <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon/>}
          onClick={handleClearInput}
      >
        Upload files (~20MB)
        <VisuallyHiddenInput
            ref={fileInputRef}
            name={name}
            type="file"
            onChange={handleChangeFile}
            multiple
        />
      </Button>
      </>
  );
}
