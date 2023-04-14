import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Mutualuser = (props) => {
  const navigate = useNavigate();
  function gotoProfile() {
    navigate(`/profile/${props.users.uid}`);
  }

  return (
    <div className="flex flex-col">
      <div className="flex m-3 -ml-4">
        <img
          src={props.users.imgurl}
          alt=""
          className="h-10 w-10 rounded-md ml-8"
        />
        <div className="flex flex-col ml-4">
          <div
            onClick={gotoProfile}
            className="text-md font-bold text-green cursor-pointer self-end hover:text-[#498e43]"
          >
            {props.users.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mutualuser;
