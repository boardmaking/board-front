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
import {cloneElement, useState} from "react";
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

export default function FileUploadComponent() {

  function generate(array,element) {
    return array.map((value) =>
    {
      console.log(value)
        cloneElement(element, {
          key: value,
        })
    }
    );
  }

  const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

    const [dense, setDense] = useState(false);
    const [secondary, setSecondary] = useState(false);

  const [fileList, setFileList] = useState(initState)

  const handleChangeUploadFile = (e) => {
    const files = e.target.files
    fileList.push(files)
    console.log(fileList[0])
    for (let i =0 ; i<fileList[0].length ;i++){
      console.log(i)
      console.log(fileList[0][i].name)
    }

    console.log(fileList)
  }

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
            type="file"
            onChange={handleChangeUploadFile}
            multiple
        />
      </Button>
        <Grid item xs={12} md={6}>
          <Demo>
            <List dense={dense}>
              {fileList[0]?.map((file,index)=>
                  <div key={index}>
                  <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={'ㅍㅇㄴ'}
                        secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  </div>
              )}
            </List>
          </Demo>
        </Grid>

      </>
  );
}
