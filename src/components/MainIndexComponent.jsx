import TableComponent from "./common/TableComponent.jsx";
import BasicLayout from "../layouts/BasicLayout.jsx";
import useCustomLogin from "../hooks/useCustomLogin.jsx";

function MainIndexComponent() {

  const {isLogin, moveToLoginReturn} = useCustomLogin()

  if (!isLogin) {
    return moveToLoginReturn()
  }

  return (
      <div>
        <BasicLayout>
          <TableComponent/>
        </BasicLayout>
      </div>
  );
}

export default MainIndexComponent;