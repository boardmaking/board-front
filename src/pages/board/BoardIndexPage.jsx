import React from 'react';
import {Outlet} from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout.jsx";

function BoardIndexPage(props) {
  return (
      <BasicLayout>
        <Outlet/>
      </BasicLayout>
  );
}

export default BoardIndexPage;