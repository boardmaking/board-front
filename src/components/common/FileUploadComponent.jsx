import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import {styled} from "@mui/material/styles";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {cloneElement, useEffect, useState} from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';

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

const initState = []

/*function FolderIcon() {
  return null;
}*/

export default function FileUploadComponent({handleChangeUploadFile}) {


  return (
      <>
      <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon/>}
      >
        Upload files
        <VisuallyHiddenInput
            name={"files"}
            type="file"
            onChange={handleChangeUploadFile}
            multiple
        />
      </Button>
      </>
  );
}
