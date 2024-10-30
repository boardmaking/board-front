import React from 'react';
import TableComponent from "./common/TableComponent.jsx";
import BasicLayout from "../layouts/BasicLayout.jsx";
import {Button} from "@mui/material";
import useCustomMove from "../hooks/useCustomMove.jsx";

function MainIndexComponent(props) {

  const {moveToPath} = useCustomMove()
  const handleClickWrite = () => {
    moveToPath('board/writer')
  }
  return (
      <div>
        <BasicLayout>
          <TableComponent/>
        </BasicLayout>
        <Button
        onClick={handleClickWrite}
        >글작성</Button>
      </div>
  );
}

export default MainIndexComponent;