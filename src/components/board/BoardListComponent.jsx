import React from 'react';
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import PageComponent from "../common/PageComponent.jsx";
import DateUtil from "../../util/dateUtil.js";
import {SERVER_HOST} from "../../constants/index.js";
import useGetBoards from "../../hooks/queries/useGetBoards.js";

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

  const {data:board} = useGetBoards()
  const boardData = board?.data || initState

  if (!isLogin) {
    return moveToLoginReturn()
  }

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
            {boardData.content.length > 0 ? boardData.content.map(
                    (item) => (
                        <div key={item.boardId}
                             className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                          <div
                              onClick={() => {
                                moveToRead(item.boardId)
                              }}
                          >
                            <img
                                src={`${SERVER_HOST}:28080/boards/files/thumbnail_${item.imageNameList[0]}?fileType=IMAGE`}
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

                          <ul className="text-xs leading-normal" style={{flex: 1, display: 'flex', direction: 'column', justifyContent: 'space-between' }}>
                            <li>
                            조회수 : {item.viewCount}
                            </li>
                            <li>
                            작성일 : {DateUtil.formatDateFrom(item.createdAt)}
                            </li>
                          </ul>
                        </div>
                    )) :
                <h2 className="text-xl py-4 ">게시물이 없습니다</h2>
            }


          </div>


          <PageComponent serverData={boardData}
                         movePage={handleClickPage}></PageComponent>

        </div>
        {/*product grid*/}

      </>
  );
}

export default BoardListComponent;