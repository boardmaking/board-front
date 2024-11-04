import {Outlet} from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout.jsx";

function UserIndexPage() {
  return (
      <BasicLayout>
        <Outlet/>
      </BasicLayout>
  );
}

export default UserIndexPage;