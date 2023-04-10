import React from "react";
import { useState, useContext } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../Contexts/ProfileContext";

const Popupreq = (props) => {
  const { requ, setRequ, suggestions } = useContext(ProfileContext);
  const navigate = useNavigate();

  const popupRef = useRef(null);
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (popupRef.current && !popupRef.current.contains(event.target)) {
  //       props.setTrigger(false);
  //       console.log("clicked outside");
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  return (
    <div className="w-screen h-screen  absolute bg-[#bcb8b899] flex justify-center items-center overflow-hidden overflow-y-hidden bg-cover bg-repeat overflow-auto">
      <div
        className="bg-[#FFFFFF] w-5/6 h-4/6 self-center center shadow-md rounded-md flex flex-col "
        ref={popupRef}
      >
        <div className="flex justify-between">
          <div className=" ml-2 text-textgreen font-semibold mt-2 mb-2 ">
            Requests
          </div>
          <div
            className="font-black self-end mr-4 mb-2 text-lg"
            onClick={() => {
              props.setTrigger(false);
            }}
          >
            X
          </div>
        </div>
        <div className="h-2/4 overflow-scroll text-sm">
          {requ.map((req) => {
            return (
              <div className="flex mx-2  mb-4 items-center justify-around ">
                <img
                  src={req.imgurl}
                  alt="asd"
                  className="h-10 w-10  rounded-full"
                />
                <div
                  className="mt-2 w-9 text-md"
                  onClick={() => {
                    navigate(`/profile/${req.uid}`);
                    props.setTrigger(false);
                  }}
                >
                  {req.name}
                </div>
                <div className="flex ">
                  <div className="bg-blue-700 mt-2 px-2 py-0.5 rounded-full h-full  text-[#ececec] text-xs">
                    Accept
                  </div>
                  <div className="bg-red-700 mt-2 ml-2  px-2 py-0.5 rounded-full h-full   text-[#ececec] text-xs">
                    Reject
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <div className="ml-2 text-textgreen font-semibold">
            Recommendations
          </div>
          <div className="h-2/4  text-sm flex justify-center items-center ">
            {suggestions.map((sug) => {
              return (
                <div className="flex flex-col mx-4    mb-4 items-center justify-center mt-8 ">
                  <img
                    src={sug.imgurl}
                    alt="asd"
                    className="h-10 w-10  rounded-full"
                    onClick={() => {
                      navigate(`/profile/${sug.uid}`);
                      props.setTrigger(false);
                    }}
                  />
                  <div
                    className="mt-2 w-9 text-md h-4"
                    onClick={() => {
                      navigate(`/profile/${sug.uid}`);
                      props.setTrigger(false);
                    }}
                  >
                    {sug.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popupreq;
