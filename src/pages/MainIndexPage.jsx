import BasicLayout from "../layouts/BasicLayout.jsx";
import MainIndexComponent from "../components/MainIndexComponent.jsx";
import TableComponent from "../components/common/TableComponent.jsx";

function MainIndexPage() {
  return (
      <div>
        <BasicLayout>
          <TableComponent/>
        </BasicLayout>
      </div>
  );
}

export default MainIndexPage