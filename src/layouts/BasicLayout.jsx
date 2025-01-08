import React, {useState} from "react";
import useCustomMove from "../hooks/useCustomMove.jsx";
import {Link, useLocation} from "react-router-dom";
import useCustomLogin from "../hooks/useCustomLogin.jsx";

const initState = {
  searchSort: '',
  searchKeyword: ''
}

export default function BasicLayout({children}) {
  const [searchCondition, setSearchCondition] = useState({...initState});
  const {moveToList, moveToMain, moveToPath} = useCustomMove();
  const {doLogout, isLogin} = useCustomLogin();
  const location = useLocation();
  const pathname = location.pathname;

  const handleChangeInput = (e) => {
    const {name, value} = e.target;
    setSearchCondition(prevSearchCondition => ({
      ...prevSearchCondition,
      [name]: value
    }))
  }

  const handleClickLogout = () => {
    doLogout();
    moveToMain();
  }

  const handleClickSearch = () => {
    console.log(searchCondition)
    moveToList(searchCondition);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClickSearch()
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleClickSearch(event);
    }
  };

  const handleClickLogin = () => {
    moveToPath('/users/login');
  }

  const handleClickJoin = () => {
    moveToPath('/users/join');
  }

  return (
      <>
        <header className="w-full px-6 bg-white">
          <div
              className="container mx-auto max-w-4xl md:flex justify-between items-center">
            <div
                className="block py-6 w-full text-center md:text-left md:w-auto text-gray-600 no-underline flex justify-center items-center">
              <Link to={"/"}>
                Consent Team
              </Link>
            </div>
            <div
                className="w-full md:w-auto mb-6 md:mb-0 text-center md:text-right">
              <div
                  className="inline-block no-underline bg-black text-white text-sm py-2 px-3">
                {isLogin ?
                    <div onClick={handleClickLogout}>
                      Logout
                    </div> :
                    <Link to="/users/join">
                      Sign Up
                    </Link>
                }
              </div>
            </div>
          </div>
        </header>
        <nav
            className="w-full bg-white md:pt-0 px-6 shadow-lg relative z-20 border-t border-b border-gray-400">
          <div
              className="container mx-auto max-w-4xl md:flex justify-between items-center text-sm md:text-md md:justify-start">
            <div
                className="w-full md:w-1/2 text-center md:text-left py-4 flex flex-wrap justify-center items-stretch md:justify-start md:items-start">
              <div
                  className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 no-underline md:border-r border-gray-400">
                <Link to="/">
                  Home
                </Link>
              </div>
              <div
                  className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 no-underline md:border-r border-gray-400">
                <Link to="/boards/list">
                  Posting
                </Link>
              </div>
              <Link to="/columns/list"
                 className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 no-underline md:border-r border-gray-400">
                Column
              </Link>
              <a href="#"
                 className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 no-underline md:border-r border-gray-400">News</a>
              <a href="#"
                 className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 no-underline">Contact</a>
            </div>
            <div
                className="w-full md:w-1/2 text-center md:text-right pb-4 md:p-0">
              <select className="bg-gray  text-sm p-1"
                      name="searchSort"
              onChange={handleChangeInput}
              >
                <option
                    value="CONTENT">content</option>
                <option
                    value="TITLE">title</option>
                <option
                    value="WRITER">writer</option>
              </select>
              <input onChange={handleChangeInput}
                     onKeyDown={handleKeyDown}
                     name="searchKeyword"
                     value={searchCondition.searchKeyword}
                     type="search"
                     placeholder="Search..."
                     className="bg-gray-300 border text-sm p-1"/>
            </div>
          </div>
        </nav>
        {children}
        {/*  footer*/}
        <footer className="w-full bg-white px-6 border-t">
          <div
              className="container mx-auto max-w-4xl py-6 flex flex-wrap md:flex-no-wrap justify-between items-center text-sm">
            &copy;2024 HSB Company. All rights reserved.
            <div className="pt-4 md:p-0 text-center md:text-right text-xs">
              <a href="#" className="text-black no-underline hover:underline">Privacy
                Policy</a>
              <a href="#"
                 className="text-black no-underline hover:underline ml-4">Terms &amp; Conditions</a>
              <a href="#"
                 className="text-black no-underline hover:underline ml-4">Contact
                Us</a>
            </div>
          </div>
        </footer>
        {/*  footer*/}
      </>
  )
}