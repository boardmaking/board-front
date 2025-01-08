import React from 'react';
import {Link} from "react-router-dom";

function ListComponent(props) {
  return (


        <>

          <div className="w-full md:pr-12 mb-12">
            <article className="container max-w-4xl mx-auto pb-10 flex flex-wrap">
                {/*product grid*/}
                <div className="container flex flex-wrap max-w-4xl mx-auto pb-10 w-full px-6 py-12 bg-gray-100 border-t">
                  <div
                      className="container max-w-4xl mx-auto pb-10 flex justify-end items-center px-3">
                    <button
                        // onClick={moveToWrite}
                        className="block mb-4 px-3 py-2 text-xs font-bold no-underline hover:shadow bg-black rounded-lg text-white">
                      posting
                    </button>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                    <Link to={'/columns/detail'}>
                      <img
                          src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800"
                          className="w-full h-auto rounded-lg"/>
                    </Link>

                    <h2 className="text-xl py-4">
                      <a href="#" className="text-black no-underline">Product
                        name</a>
                    </h2>

                    <p className="text-xs leading-normal">Lorem ipsum dolor sit
                      amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut
                      enim
                      ad minim veniam,
                      quis nostrud exercitation ullamco laboris nisi ut
                      aliquip.</p>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                    <a href="#">
                      <img
                          src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800"
                          className="w-full h-auto rounded-lg"/>
                    </a>

                    <h2 className="text-xl py-4">
                      <a href="#" className="text-black no-underline">Product
                        name</a>
                    </h2>

                    <p className="text-xs leading-normal">Lorem ipsum dolor sit
                      amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut
                      enim
                      ad minim veniam,
                      quis nostrud exercitation ullamco laboris nisi ut
                      aliquip.</p>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                    <a href="#">
                      <img
                          src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800"
                          className="w-full h-auto rounded-lg"/>
                    </a>

                    <h2 className="text-xl py-4">
                      <a href="#" className="text-black no-underline">Product
                        name</a>
                    </h2>

                    <p className="text-xs leading-normal">Lorem ipsum dolor sit
                      amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut
                      enim
                      ad minim veniam,
                      quis nostrud exercitation ullamco laboris nisi ut
                      aliquip.</p>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                    <a href="#">
                      <img
                          src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800"
                          className="w-full h-auto rounded-lg"/>
                    </a>

                    <h2 className="text-xl py-4">
                      <a href="#" className="text-black no-underline">Product
                        name</a>
                    </h2>

                    <p className="text-xs leading-normal">Lorem ipsum dolor sit
                      amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut
                      enim
                      ad minim veniam,
                      quis nostrud exercitation ullamco laboris nisi ut
                      aliquip.</p>
                  </div>


                  <div
                      className="container max-w-4xl mx-auto pb-10 flex justify-between items-center px-3">
                    <div className="text-xs">
                      <a href="#"
                         className="bg-gray-500 text-white no-underline py-1 px-2 rounded-lg mr-2">Previous</a>
                      <div className="hidden md:inline">
                        <a href="#"
                           className="text-sm px-1 text-gray-900 no-underline">1</a>
                        <a href="#"
                           className="text-sm px-1 text-gray-900 no-underline">2</a>
                        <a href="#"
                           className="text-sm px-1 text-gray-900 no-underline">3</a>
                        <span className="px-2 text-gray">...</span>
                        <a href="#"
                           className="text-sm px-1 text-gray-900 no-underline">42</a>
                      </div>
                      <a href="#"
                         className="bg-black text-white no-underline py-1 px-2 rounded-lg ml-2">Next</a>

                    </div>

                    <div className="text-sm text-gray-600">
                      Per page:
                      <select
                          className="bg-white border rounded-lg w-24 h-8 ml-1">
                        <option>24</option>
                        <option>48</option>
                        <option>All</option>
                      </select>
                    </div>
                  </div>


                  {/*<PageComponent serverData={serverData}
                               movePage={handleClickPage}></PageComponent>*/}

                {/*</div>*/}
              </div>
                {/*product grid*/}

            </article>


            {/*<div className="flex justify-end text-xs">
              <button
                  className="bg-black text-white no-underline py-2 px-3 rounded">뒤로가기
              </button>
            </div>*/}
          </div>

</>
  );
}

export default ListComponent;