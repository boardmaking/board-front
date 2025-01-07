import React, {useEffect, useState} from 'react';


function PageComponent({serverData, movePage}) {

  const [size, setSize] = useState(12)
  const {pageable, totalPages} = serverData

  const offset = pageable.offset
  const currentNumber = offset === 0 ? 1 : Math.ceil((offset + 1) / size);
  let endNumber =  Math.ceil(currentNumber / size) * size;
  const startNumber = endNumber - (size - 1);

  endNumber = Math.min(endNumber, totalPages);

  const pageNumberList = []
  for (let pageNumber = startNumber; pageNumber <= endNumber; pageNumber++) {
    console.log(pageNumber);
    pageNumberList.push(pageNumber)
  }

  const handleChangeSize = (e) => {
    const {value} = e.target
    setSize(value)
  }

  useEffect(() => {
    console.log(size)
    movePage({size})
  },[size])

  return (
      <div
          className="container max-w-4xl mx-auto pb-10 flex justify-between items-center px-3">
        <div className="text-xs">
          {!serverData.first &&
              (<span
                  onClick={() => movePage({page: (currentNumber -2),size:size})}
                  className="bg-gray-500 text-white no-underline py-1 px-2 rounded-lg mr-2">Previous</span>)
          }
          <div className="hidden md:inline">
            {pageNumberList.map((pageNumber) => (
                <span key={pageNumber}
                      onClick={() => movePage({page: pageNumber-1,size:size})}
                   className={`text-sm 
                   ${pageNumber === currentNumber ? 'px-4 text-gray-900 font-bold' : 'px-1 text-gray-700'} 
                   no-underline`}>{pageNumber}</span>
            ))}
          </div>
          {!serverData.last &&
              (<span
                  onClick={() => movePage({page: (currentNumber),size:size})}
                  className="bg-black text-white no-underline py-1 px-2 rounded-lg ml-2">Next</span>)
          }

        </div>

        <div className="text-sm text-gray-600">
          Per page:
          <select
              name="size"
              onChange={handleChangeSize}
              className="bg-white border rounded-lg w-24 h-8 ml-1">
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>
  );
}

export default PageComponent;