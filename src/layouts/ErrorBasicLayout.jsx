import React from 'react';
import BasicLayout from "./BasicLayout.jsx";

function ErrorBasicLayout(props) {
  return (
      <BasicLayout>
        <body   className="font-sans font-thin">

        <div className="w-full h-screen relative text-white">
          <img
              src="https://images.unsplash.com/photo-1438109491414-7198515b166b?w=1800"
              className="absolute top-0 left-0 w-full h-full object-cover"/>

          <header
              className="z-10 relative mx-auto max-w-6xl px-6 py-8 flex justify-between items-center">

            <a href="#" className="text-xl tracking-wider">sorry</a>

            <ul className="hidden md:flex uppercase text-sm text-gray-500">
              <li>
                <a href="#" className="text-white">Home</a>
              </li>
              <li className="ml-6">
                <a href="#">About</a>
              </li>
              <li className="ml-6">
                <a href="#">Blog</a>
              </li>
              <li className="ml-6">
                <a href="#">Contact</a>
              </li>
            </ul>

          </header>

          <div
              className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-center px-12">
            <div>
              <h1 className="text-3xl md:text-6xl leading-tight mb-16">
                Sorry,
                <br className="hidden md:block"/>
                invalid access
              </h1>
              <a href="#"
                 className="border border-white py-4 px-8 hover:bg-white hover:text-black">
                Go Home
              </a>
            </div>
          </div>

        </div>




        <div
            className="bg-gray-900 text-gray-100 text-center flex justify-center px-6 py-12">

          <a href="#" className="mx-6 hover:text-gray-600">123 Address</a>
          <a href="#" className="mx-6 hover:text-gray-600">0800 123 456</a>
          <a href="#" className="mx-6 hover:text-gray-600">my@email.com</a>

        </div>


        </body>

      </BasicLayout>
  );
}

export default ErrorBasicLayout;