import React, { useEffect, useRef } from "react";
import drop from "../assets/dropdown.png";
import { useState } from "react";
const Requests = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  // to handle click outside of the dropdown

  return (
    <div className="flex mt-4 ml-[12rem]">
      {isOpen ? (
        ""
      ) : (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-md h-11 w-64   mr-4 rounded-md font-bold text-black  pl-20 pt-3  pr-12  text-sm flex cursor-pointer hover:bg-gray-200 hover:transition duration-200"
        >
          <div className="h-2 w-2  pr-2 mr-2 mt-[5px] bg-blue-500 shadow-md rounded-full "></div>
          <div> Requests</div>
        </div>
      )}
      {isOpen && (
        <div ref={ref} className="h-[10rem] ">
          <div
            ref={ref}
            className="bg-white flex flex-col items-start justify-start shadow-md h-[10rem] w-64  mr-4 rounded-md font-bold text-black  pl-12 pt-3 pr-12   text-sm cursor-pointer  "
          >
            <div className="flex flex-col">
              <div className="flex items-start justify-start -mt-6">
                <div className="flex flex-col">
                  <div className="text-[#444444] text-lg font-semibold pt-4">
                    Shreyas
                  </div>
                  <div className=" text-[#898989] text-[13px] font-light">
                    14 Mutual Friends
                  </div>
                </div>
                <div className="rounded-full bg-blue-600 shadow-md h-5 w-5 mt-6 ml-4 hover:bg-blue-400"></div>
                <div className="rounded-full bg-red-600 shadow-md h-5 w-5 mt-6 ml-4 -mr-8 hover:bg-red-400"></div>
              </div>
              <div className="w-[12rem] h-[2px] bg-gray-200"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
