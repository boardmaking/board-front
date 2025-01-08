import React from 'react';
import BasicLayout from "../../layouts/BasicLayout.jsx";
import {Outlet} from "react-router-dom";

function IndexPage(props) {
  return (
      <BasicLayout>
        <div className="w-full bg-white">

          <div className="text-center px-6 py-12 mb-6 bg-gray-100 border-b">
            <h1 className=" text-xl md:text-4xl pb-4">Column</h1>
            <p className="leading-loose text-gray-dark">
              I am posting..
            </p>
          </div>
          <div
              className="container max-w-4xl mx-auto md:flex items-start py-8 px-12 md:px-0">
            <Outlet/>
            <div className="w-full md:w-64">

              <aside className="rounded shadow overflow-hidden mb-6">
                <h3 className="text-sm bg-gray-100 text-gray-700 py-3 px-4 border-b">Categories</h3>

                <div className="p-4">
                  <ul className="list-reset leading-normal">
                    <li><a href="#"
                           className="text-gray-darkest text-sm">Uncategorised</a>
                    </li>
                    <li><a href="#"
                           className="text-gray-darkest text-sm">Food &amp; Drink</a>
                    </li>
                    <li><a href="#"
                           className="text-gray-darkest text-sm">Garden</a></li>
                    <li><a href="#"
                           className="text-gray-darkest text-sm">Tools</a></li>
                  </ul>
                </div>
              </aside>

              <aside className="rounded shadow overflow-hidden mb-6">
                <h3 className="text-sm bg-gray-100 text-gray-700 py-3 px-4 border-b">Latest
                  Posts</h3>

                <div className="p-4">
                  <ul className="list-reset leading-normal">
                    <li><a href="#" className="text-gray-darkest text-sm">Lorem
                      ipsum dolor sit amet.</a></li>
                    <li><a href="#" className="text-gray-darkest text-sm">Sit
                      amet, consectetur adipisicing elit.</a></li>
                    <li><a href="#" className="text-gray-darkest text-sm">Lorem
                      ipsum dolor sit amet.</a></li>
                    <li><a href="#" className="text-gray-darkest text-sm">Sit
                      amet, consectetur adipisicing elit.</a></li>
                  </ul>
                </div>
              </aside>

            </div>
          </div>
        </div>
      </BasicLayout>
  );
}

export default IndexPage;