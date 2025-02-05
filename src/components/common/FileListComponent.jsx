import React from 'react';
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

function FileListComponent({fileStore, onClick, isUploaded = false}) {
  return (
      fileStore.map((item, index) => (
          <ListItem key={index} secondaryAction={<IconButton
              name={isUploaded
                  ? item
                  : item.file.name}
              onClick={() => onClick(index)}
              edge="end"
              aria-label="upload">
            <ClearIcon name={isUploaded
                ? item
                : item.file.name}
            />
          </IconButton>}>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={isUploaded
                ? item.substring(37)
                : item.file.name}/>
          </ListItem>
      ))
  );
}

export default FileListComponent;