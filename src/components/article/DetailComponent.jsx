import React from 'react';

function DetailComponent(props) {
  return (

      <div
          className="container max-w-4xl mx-auto md:flex items-start py-8 px-12 md:px-0">

        <div className="w-full md:pr-12 mb-12">
          <article className="mb-12">
            <h2 className="mb-4">
              <a href="#"
                 className="text-black text-xl md:text-2xl no-underline hover:underline">
                멀티 스레드
              </a>
            </h2>

            <div className="mb-4 text-sm text-gray-700">
              by <a href="#" className="text-gray-700">작성자</a> 작성일
              <span className="font-bold mx-1"> | </span>
              <a href="#" className="text-gray-700">카테고리</a>
              <span className="font-bold mx-1"> | </span>
              <a href="#" className="text-gray-700">2 Comments</a>
            </div>

            <p className="text-gray-700 leading-normal">
              멀티 스레드는 어렵다 암튼 그렇다
            </p>

          </article>


          <div className="flex justify-end text-xs">
            <button
                className="bg-black text-white no-underline py-2 px-3 rounded">뒤로가기
            </button>
          </div>
        </div>


      </div>
  );
}

export default DetailComponent;