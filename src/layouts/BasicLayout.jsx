import React, {useEffect, useState} from "react";
import useCustomMove from "../hooks/useCustomMove.jsx";
import {Link, useLocation} from "react-router-dom";
import useCustomLogin from "../hooks/useCustomLogin.jsx";

const initState = {
  category: '1',
  search: ''
}

export default function BasicLayout({children}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState(initState);
  const {moveToList, moveToMain, moveToPath} = useCustomMove();
  const {doLogout, isLogin} = useCustomLogin();
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const pathname = location.pathname;

  const handleChangeSearch = (e) => {
    search[e.target.name] = e.target.value;
    setSearch(search);
  }

  const handleClickLogout = () => {
    doLogout();
    setIsLoggedIn(false);
    moveToMain();
  }

  const handleClickSearch = () => {
    moveToList(search);
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
              <a href="#"
                 className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 no-underline md:border-r border-gray-400">Posting</a>
              <a href="#"
                 className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 no-underline md:border-r border-gray-400">About
                Us</a>
              <a href="#"
                 className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 no-underline md:border-r border-gray-400">News</a>
              <a href="#"
                 className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 no-underline">Contact</a>
            </div>
            <div
                className="w-full md:w-1/2 text-center md:text-right pb-4 md:p-0">
              <input type="search" placeholder="Search..."
                     className="bg-gray-300 border text-sm p-1"/>
            </div>
          </div>
        </nav>
        {/*<div
            className="w-full py-24 px-6 bg-cover bg-no-repeat bg-center relative z-10"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2100')"
            }}
        >
          <div className="container max-w-4xl mx-auto text-center">
            <h1 className="text-xl leading-tight md:text-3xl text-center text-gray-100 mb-3">Lorem
              ipsum dolor sit amet</h1>
            <p className="text-md md:text-lg text-center text-white ">Ut enim ad
              minim veniam, quis nostrud exercitation</p>

            <a href="/register"
               className="mt-6 inline-block bg-white text-black no-underline px-4 py-3 shadow-lg">Find
              out more</a>
          </div>

        </div>*/}
        {children}
      </>
  )
}