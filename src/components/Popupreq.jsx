import React from "react";
import { useState, useContext } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../Contexts/ProfileContext";

const Popupreq = (props) => {
  const { requ, setRequ } = useContext(ProfileContext);
  const navigate = useNavigate();

  const popupRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        props.setTrigger(false);
        console.log("clicked outside");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [popupRef]);

  return (
    <div className="w-screen h-screen  absolute bg-transaprent flex justify-center items-center">
      <div
        className="bg-[#FFFFFF] w-5/6 h-4/6 self-center center shadow-md rounded-md flex flex-col "
        ref={popupRef}
      >
        <div className=" font-medium text-center mt-2">Requests</div>
        <div className="h-2/4 overflow-scroll text-sm">
          {requ.map((req) => {
            return (
              <div className="flex mx-2  mb-4 justify-between">
                <img
                  src={req.imgurl}
                  alt="asd"
                  className="h-10 w-10  rounded-full"
                />
                <div
                  className="mt-2"
                  onClick={() => {
                    navigate(`/profile/${req.uid}`);
                  }}
                >
                  {req.name}
                </div>
                <div className="bg-blue-600 mt-2  rounded-md h-full p-1 text-white text-xs">
                  Accept
                </div>
                <div className="bg-red-600 mt-2  rounded-md h-full p-1 text-white text-xs">
                  Reject
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Popupreq;
