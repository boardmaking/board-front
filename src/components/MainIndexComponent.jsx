import TableComponent from "./common/TableComponent.jsx";
import BasicLayout from "../layouts/BasicLayout.jsx";
import {Button} from "@mui/material";
import useCustomMove from "../hooks/useCustomMove.jsx";

function MainIndexComponent() {

  const {moveToWrite} = useCustomMove()
  return (
      <div>
        <BasicLayout>
          <TableComponent/>
        </BasicLayout>
        <Button
        onClick={moveToWrite}
        >글작성</Button>
      </div>
  );
}

export default MainIndexComponent;