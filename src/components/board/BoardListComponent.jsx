import React, {useState} from 'react';
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {getList} from "../../api/boardApi.js";
import PageComponent from "../common/PageComponent.jsx";

const initState = {
  content: [],
  empty: false,
  first: false,
  last: false,
  number: 0,
  numberOfElements: 0,
  pageable: {},
  size: 0,
  sort: {},
  totalElements: 0,
  totalPages: 0
}

function BoardListComponent() {

  const {isLogin, moveToLoginReturn} = useCustomLogin()
  const {moveToList} = useCustomMove()
  const {searchSort, searchKeyword,page,size, refresh} = useCustomMove()

  if (!isLogin) {
    return moveToLoginReturn()
  }
  console.log(searchSort)
  const {data: response} = useQuery({
    queryKey: ['boardList', {
      refresh,
      searchKeyword,
      searchSort,
      page,
      size,
    }],
    queryFn: () => getList(
        {searchSort:searchSort, searchKeyword: searchKeyword, page: page, size: size}),
  });

  const serverData = response?.data || initState

  const handleClickPage = (pageParam) => {
    moveToList(pageParam)
  }

  return (
      <body>

      {/*title*/}
      <h1 className="text-center text-xl md:text-4xl px-6 py-12 bg-white">
        Our Post
      </h1>
      {/*title*/}

      {/*product grid*/}
      <div className="w-full px-6 py-12 bg-gray-100 border-t">


        <div className="container max-w-4xl mx-auto pb-10 flex flex-wrap">
          {serverData.content.length > 0 && serverData.content.map((item, index) => (
                 <div key={item.boardId} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                  <a href="#">
                    <img
                        src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800"
                        className="w-full h-auto rounded-lg"/>
                  </a>

                  <h2 className="text-xl py-4">
                    <Link to={'boards/'} className="text-black no-underline">
                      {item.title}
                    </Link>
                  </h2>

                  <p className="text-xs leading-normal">
                    content
                  </p>
                </div>
          ))}


        </div>


        <PageComponent serverData={serverData} movePage={handleClickPage}></PageComponent>

      </div>
      {/*product grid*/}


      </body>
  );
}

export default BoardListComponent;