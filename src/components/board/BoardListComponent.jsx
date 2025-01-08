import React from 'react';
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
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
  const {moveToList, moveToRead, moveToWrite} = useCustomMove()
  const {searchSort, searchKeyword, page, size, refresh} = useCustomMove()

  if (!isLogin) {
    return moveToLoginReturn()
  }
  console.log('리스트')
  const {data: response} = useQuery({
    queryKey: ['boards/list', {
      refresh,
      searchKeyword,
      searchSort,
      page,
      size,
    }],
    queryFn: () =>
        getList({
          searchSort,
          searchKeyword,
          page,
          size
        }),
    // staleTime:1000 * 5
  });

  const serverData = response?.data || initState
  console.log('serverData', serverData)

  const handleClickPage = (pageParam) => {
    moveToList(pageParam)
  }

  return (
      <>

        {/*title*/}
        <h1 className="text-center text-xl md:text-4xl px-6 py-12 bg-white">
          Our Post
        </h1>
        {/*title*/}

        {/*product grid*/}
        <div className="w-full px-6 py-12 bg-gray-100 border-t">
          <div
              className="container max-w-4xl mx-auto pb-10 flex justify-end items-center px-3">
            <button
                onClick={moveToWrite}
                className="block mb-4 px-3 py-2 text-xs font-bold no-underline hover:shadow bg-black rounded-lg text-white">
              posting
            </button>
          </div>

          <div className="container max-w-4xl mx-auto pb-10 flex flex-wrap">
            {serverData.content.length > 0 ? serverData.content.map(
                    (item) => (
                        <div key={item.boardId}
                             className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                          <div
                              onClick={() => {
                                moveToRead(item.boardId)
                              }}
                          >
                            <img
                                src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800"
                                className="w-full h-auto rounded-lg"/>
                          </div>

                          <h2 className="text-xl py-4">
                            <button
                                onClick={() => {
                                  moveToRead(item.boardId)
                                }}
                                className="text-black no-underline">
                              {item.title}
                            </button>
                          </h2>

                          <p className="text-xs leading-normal">
                            content
                          </p>
                        </div>
                    )) :
                <h2 className="text-xl py-4 ">게시물이 없습니다</h2>
            }


          </div>


          <PageComponent serverData={serverData}
                         movePage={handleClickPage}></PageComponent>

        </div>
        {/*product grid*/}

      </>
  );
}

export default BoardListComponent;